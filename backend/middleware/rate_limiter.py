import time
from typing import Dict, List
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from core.config import settings

# In-Memory Rate Limiting Tracker: { client_ip: [timestamp1, timestamp2, ...] }
IP_REQUEST_LOGS: Dict[str, List[float]] = {}

class RateLimiterMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        window_start = now - 60.0  # 60 second sliding window

        # Clean old timestamps
        if client_ip in IP_REQUEST_LOGS:
            IP_REQUEST_LOGS[client_ip] = [t for t in IP_REQUEST_LOGS[client_ip] if t > window_start]
        else:
            IP_REQUEST_LOGS[client_ip] = []

        # Check rate limit cap
        if len(IP_REQUEST_LOGS[client_ip]) >= settings.RATE_LIMIT_PER_MINUTE:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": f"Rate Limit Exceeded: Maximum {settings.RATE_LIMIT_PER_MINUTE} requests per minute allowed.",
                    "retry_after_seconds": 60
                }
            )

        # Log current request timestamp
        IP_REQUEST_LOGS[client_ip].append(now)

        return await call_next(request)
