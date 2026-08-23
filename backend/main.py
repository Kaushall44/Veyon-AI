import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend root directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load Environment Variables & Core Configuration
load_dotenv()
from core.config import settings
from middleware.auth_middleware import JWTAuthMiddleware
from middleware.rate_limiter import RateLimiterMiddleware

from api.routers import chat, approvals, labs, certificates, maintenance, grievances, audit, notifications, knowledge

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
)

# Register Security Middlewares
app.add_middleware(JWTAuthMiddleware)
app.add_middleware(RateLimiterMiddleware)

# Register API Routers
app.include_router(chat.router, prefix="/api")
app.include_router(approvals.router, prefix="/api")
app.include_router(labs.router, prefix="/api")
app.include_router(certificates.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(grievances.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")

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
