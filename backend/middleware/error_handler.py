import logging
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("soa_nexus_gateway")

def register_exception_handlers(app):
    """
    Registers global exception handlers to wrap all errors in standardized envelopes:
    {
        "status": "error",
        "code": "...",
        "message": "...",
        "correlation_id": "...",
        "details": [...] (optional)
    }
    """

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        correlation_id = getattr(request.state, "correlation_id", "req-unknown")
        errors = []
        for err in exc.errors():
            loc = " -> ".join(str(l) for l in err.get("loc", []))
            errors.append({
                "field": loc,
                "issue": err.get("msg", "Invalid input format")
            })

        logger.warning(f"[{correlation_id}] Validation failed: {errors}")

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            headers={"X-Correlation-ID": correlation_id},
            content={
                "status": "error",
                "code": "VALIDATION_FAILED",
                "message": "Input request validation failed. Please check field requirements.",
                "correlation_id": correlation_id,
                "details": errors
            }
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        correlation_id = getattr(request.state, "correlation_id", "req-unknown")
        
        # Map status code to standard error codes
        code_map = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "UNPROCESSABLE_ENTITY",
            429: "RATE_LIMIT_EXCEEDED"
        }
        error_code = code_map.get(exc.status_code, "HTTP_ERROR")

        return JSONResponse(
            status_code=exc.status_code,
            headers={"X-Correlation-ID": correlation_id},
            content={
                "status": "error",
                "code": error_code,
                "detail": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
                "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
                "correlation_id": correlation_id
            }
        )

    @app.exception_handler(StarletteHTTPException)
    async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
        correlation_id = getattr(request.state, "correlation_id", "req-unknown")
        return JSONResponse(
            status_code=exc.status_code,
            headers={"X-Correlation-ID": correlation_id},
            content={
                "status": "error",
                "code": "HTTP_ERROR",
                "detail": str(exc.detail),
                "message": str(exc.detail),
                "correlation_id": correlation_id
            }
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        correlation_id = getattr(request.state, "correlation_id", "req-unknown")
        logger.error(f"[{correlation_id}] Unhandled server exception: {exc}", exc_info=True)

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            headers={"X-Correlation-ID": correlation_id},
            content={
                "status": "error",
                "code": "INTERNAL_SERVER_ERROR",
                "detail": "An unexpected server error occurred. Please contact institutional support.",
                "message": "An unexpected server error occurred. Please contact institutional support.",
                "correlation_id": correlation_id
            }
        )
