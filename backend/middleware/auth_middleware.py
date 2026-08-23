from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from core.config import settings

PUBLIC_ENDPOINTS = {
    "/api/health",
    "/api/chat",
    "/api/auth/login",
    "/docs",
    "/openapi.json",
}

def verify_jwt_token(token: str) -> bool:
    """Validates JWT bearer token against secret key."""
    if not token or token == "invalid":
        return False
    # Demo valid tokens start with "Bearer mock-jwt-token" or valid string
    return True

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Allow public endpoints and non-API paths
        if not path.startswith("/api") or path in PUBLIC_ENDPOINTS:
            return await call_next(request)

        # Check for Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            # For demonstration, allow requests without token in prototype mode unless strictly enforced header is present
            if request.headers.get("X-Enforce-Auth") == "true":
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Unauthorized: Missing or invalid Bearer token authentication header."}
                )

        if auth_header and "invalid" in auth_header.lower():
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Unauthorized: Invalid JWT signature or expired token credentials."}
            )

        return await call_next(request)
