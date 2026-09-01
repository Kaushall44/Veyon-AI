import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

try:
    from backend.core.config import settings
    from backend.database.base import Base
except ImportError:
    from core.config import settings
    from database.base import Base

# Database URLs
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    ASYNC_DATABASE_URL = DATABASE_URL

# Fallback SQLite DB for local zero-config testing
db_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(db_dir, "soa_nexus.db").replace("\\", "/")
SQLITE_SYNC_URL = f"sqlite:///{db_path}"
SQLITE_ASYNC_URL = f"sqlite+aiosqlite:///{db_path}"

# Sync Engine
try:
    if "sqlite" in DATABASE_URL or settings.ENVIRONMENT == "test":
        sync_engine = create_engine(SQLITE_SYNC_URL, connect_args={"check_same_thread": False})
    else:
        sync_url = DATABASE_URL.replace("+asyncpg", "")
        sync_engine = create_engine(sync_url, pool_pre_ping=True, pool_size=20, max_overflow=30)
except Exception:
    sync_engine = create_engine(SQLITE_SYNC_URL, connect_args={"check_same_thread": False})

SyncSessionFactory = sessionmaker(bind=sync_engine, autoflush=False, autocommit=False)

def init_db():
    """Initializes database schema tables and seeds baseline role users."""
    try:
        from backend.database import models  # noqa
    except ImportError:
        from database import models  # noqa
    Base.metadata.create_all(bind=sync_engine)

    # Seed baseline roles
    db = SyncSessionFactory()
    try:
        from backend.database.models import User
        if db.query(User).count() == 0:
            seed_users = [
                User(
                    id="u1000000-0000-0000-0000-000000000001",
                    reg_number="2023-CSE-042",
                    email="student@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_student",
                    full_name="Kaushal Raj Gupta",
                    role="Student",
                    department="Computer Science & Engineering",
                    semester=5,
                    cgpa=8.85,
                    attendance_pct=92.5,
                    is_active=True
                ),
                User(
                    id="u2000000-0000-0000-0000-000000000002",
                    reg_number="FAC-CSE-012",
                    email="faculty@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_faculty",
                    full_name="Prof. S. R. Pattnaik",
                    role="Faculty",
                    department="Computer Science & Engineering",
                    is_active=True
                ),
                User(
                    id="u3000000-0000-0000-0000-000000000003",
                    reg_number="LAB-INC-004",
                    email="labincharge@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_labincharge",
                    full_name="Prof. A. K. Samanta",
                    role="Lab_In_Charge",
                    department="Computer Science & Engineering",
                    is_active=True
                ),
                User(
                    id="u4000000-0000-0000-0000-000000000004",
                    reg_number="EST-STAFF-02",
                    email="estates@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_estates",
                    full_name="Rajesh Kumar (HVAC Lead)",
                    role="Estates_Staff",
                    department="Campus Estates & Facility Management",
                    is_active=True
                ),
                User(
                    id="u5000000-0000-0000-0000-000000000005",
                    reg_number="GRV-OFF-001",
                    email="grievance@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_grievance",
                    full_name="Dr. B. K. Mohapatra",
                    role="Grievance_Officer",
                    department="University Ombudsman Council",
                    is_active=True
                ),
                User(
                    id="u6000000-0000-0000-0000-000000000006",
                    reg_number="ADM-SYS-001",
                    email="admin@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_admin",
                    full_name="Dean Academics Office",
                    role="Admin",
                    department="Central University Administration",
                    is_active=True
                ),
            ]
            db.add_all(seed_users)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

def get_sync_db() -> Generator[Session, None, None]:
    """Dependency / helper yielding database session with guaranteed closure."""
    db = SyncSessionFactory()
    try:
        yield db
    finally:
        db.close()
