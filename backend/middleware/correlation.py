import time
import uuid
import logging
import json
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

# Configure structured JSON logger
logger = logging.getLogger("soa_nexus_gateway")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract existing X-Correlation-ID or generate new UUID
        correlation_id = request.headers.get("X-Correlation-ID", f"req-{uuid.uuid4().hex[:12]}")
        request.state.correlation_id = correlation_id

        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        process_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Inject X-Correlation-ID and execution time into response headers
        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Response-Time-Ms"] = str(process_time_ms)

        # Log structured request telemetry
        if request.url.path.startswith("/api"):
            client_ip = request.client.host if request.client else "127.0.0.1"
            log_data = {
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "latency_ms": process_time_ms,
                "client_ip": client_ip,
            }
            logger.info(json.dumps(log_data))

        return response
