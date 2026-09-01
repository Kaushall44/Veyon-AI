from typing import List, Optional, Callable
from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session

try:
    from backend.core.security import decode_token
    from backend.database.session import get_sync_db
    from backend.database.models import User
except ImportError:
    from core.security import decode_token
    from database.session import get_sync_db
    from database.models import User

def get_current_user_from_token(
    request: Request,
    db: Session = Depends(get_sync_db)
) -> User:
    """
    Extracts Bearer token from headers, decodes JWT, and returns active user model from DB.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing or malformed Bearer token."
        )

    token = auth_header[7:].strip()
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token."
        )

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        user = db.query(User).filter(User.email == payload.get("email")).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token does not exist."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated."
        )

    return user

def require_roles(allowed_roles: List[str]) -> Callable:
    """
    Dependency factory to enforce Role-Based Access Control (RBAC).
    Normalizes roles (case-insensitive) and allows 'Admin' / 'Super_Admin' global pass.
    """
    normalized_allowed = [r.lower().replace(" ", "_") for r in allowed_roles]
    normalized_allowed.extend(["admin", "super_admin"])

    def role_checker(current_user: User = Depends(get_current_user_from_token)) -> User:
        user_role_clean = current_user.role.lower().replace(" ", "_")
        if user_role_clean not in normalized_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Role '{current_user.role}' is not authorized. Required: {allowed_roles}"
            )
        return current_user

    return role_checker
