from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

try:
    from backend.database.session import get_sync_db
    from backend.database.models import User
    from backend.middleware.rbac import get_current_user_from_token
except ImportError:
    from database.session import get_sync_db
    from database.models import User
    from middleware.rbac import get_current_user_from_token

router = APIRouter(prefix="/users", tags=["User Profiles & RBAC Management"])

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, example="Kaushal Raj Gupta")
    email: Optional[EmailStr] = Field(None, example="student@soa.ac.in")
    department: Optional[str] = Field(None, example="Computer Science & Engineering")

@router.get("/profile")
def get_user_profile(current_user: User = Depends(get_current_user_from_token)):
    """
    Returns the complete profile of the currently authenticated user.
    """
    return current_user.to_dict()

@router.put("/profile")
def update_user_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_sync_db)
):
    """
    Allows the authenticated user to update their personal contact details.
    """
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.email is not None:
        existing = db.query(User).filter(User.email == payload.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email address is already in use by another account."
            )
        current_user.email = payload.email
    if payload.department is not None:
        current_user.department = payload.department

    db.commit()
    db.refresh(current_user)
    return {
        "status": "success",
        "message": "User profile updated successfully.",
        "user": current_user.to_dict()
    }
