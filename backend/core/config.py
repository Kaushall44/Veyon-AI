import os
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment from both backend directory and workspace root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))
load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "SOA Nexus AI Backend"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/soa_nexus")
    USE_MOCK_FALLBACK: bool = os.getenv("USE_MOCK_FALLBACK", "true").lower() == "true"
    
    # Secrets & OpenRouter / Gemini API Keys
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Supabase Credentials
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY", "")
    USE_SUPABASE: bool = os.getenv("USE_SUPABASE", "true").lower() == "true"
    
    # Auth & JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "soa-nexus-super-secret-jwt-key-2026")
    JWT_ALGORITHM: str = "HS256"
    AUTH_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Rate Limiting & CORS
    RATE_LIMIT_PER_MINUTE: int = 60
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://soa-nexus.vercel.app"
    ]

settings = Settings()
