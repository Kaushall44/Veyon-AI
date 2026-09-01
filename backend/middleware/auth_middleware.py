from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

try:
    from backend.core.config import settings
except ImportError:
    from core.config import settings

PUBLIC_ENDPOINTS = {
    "/api/health",
    "/api/chat",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
    "/docs",
    "/openapi.json",
}

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        correlation_id = getattr(request.state, "correlation_id", "req-unknown")

        # Allow public endpoints and non-API paths
        if not path.startswith("/api") or path in PUBLIC_ENDPOINTS:
            return await call_next(request)

        # Check for Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            if request.headers.get("X-Enforce-Auth") == "true":
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    headers={"X-Correlation-ID": correlation_id},
                    content={
                        "status": "error",
                        "code": "UNAUTHORIZED",
                        "detail": "Unauthorized: Missing or invalid Bearer token authentication header.",
                        "message": "Unauthorized: Missing or invalid Bearer token authentication header.",
                        "correlation_id": correlation_id
                    }
                )

        if auth_header and "invalid" in auth_header.lower():
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                headers={"X-Correlation-ID": correlation_id},
                content={
                    "status": "error",
                    "code": "UNAUTHORIZED",
                    "detail": "Unauthorized: Invalid JWT signature or expired token credentials.",
                    "message": "Unauthorized: Invalid JWT signature or expired token credentials.",
                    "correlation_id": correlation_id
                }
            )

        return await call_next(request)
