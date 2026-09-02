import sys
import os

# Ensure both project root and backend directory are in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load Environment Variables & Core Configuration
load_dotenv()
from core.config import settings
from middleware.correlation import CorrelationIdMiddleware
from middleware.auth_middleware import JWTAuthMiddleware
from middleware.rate_limiter import RateLimiterMiddleware
from middleware.error_handler import register_exception_handlers

from api.routers import auth, users, requests, chat, approvals, labs, certificates, maintenance, grievances, audit, notifications, knowledge, analytics, community, marketplace

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Human-in-the-Loop Agentic AI Platform for Institutional Service Delivery (SOAIDEATHON-S1)",
    version=settings.VERSION
)

# CORS Middleware Configuration (Restricted to Authorized Origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-ID", "X-Response-Time-Ms", "Retry-After"]
)

# Register Gateway & Security Middlewares (Order: Correlation -> RateLimit -> JWT)
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(RateLimiterMiddleware)
app.add_middleware(JWTAuthMiddleware)

# Register Global Standardized Error Envelopes
register_exception_handlers(app)

# Register API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(approvals.router, prefix="/api")
app.include_router(labs.router, prefix="/api")
app.include_router(certificates.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(grievances.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(community.router, prefix="/api")
app.include_router(marketplace.router, prefix="/api")

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
