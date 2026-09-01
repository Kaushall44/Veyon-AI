from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

try:
    from backend.database.session import get_sync_db
    from backend.database.models import User
    from backend.middleware.rbac import get_current_user_from_token
    from backend.services.request_service import (
        create_service_request,
        get_service_requests,
        get_service_request_by_id,
        transition_request_status
    )
except ImportError:
    from database.session import get_sync_db
    from database.models import User
    from middleware.rbac import get_current_user_from_token
    from services.request_service import (
        create_service_request,
        get_service_requests,
        get_service_request_by_id,
        transition_request_status
    )

router = APIRouter(prefix="/requests", tags=["Service Requests Lifecycle Engine"])

class CreateRequestPayload(BaseModel):
    request_type: str = Field(..., example="LAB_BOOKING")  # LAB_BOOKING, CERTIFICATE, MAINTENANCE, GRIEVANCE
    payload: Dict[str, Any] = Field(..., example={"lab_id": "LAB-AI-101", "date": "2026-08-25", "slot": "14:00-16:00"})
    risk_level: str = Field("LOW", example="HIGH")
    is_anonymous: bool = Field(False, example=False)
    assigned_approver_id: Optional[str] = Field(None, example=None)

class UpdateStatusPayload(BaseModel):
    status: str = Field(..., example="APPROVED")
    resolution_notes: Optional[str] = Field(None, example="Approved after prerequisite check.")

@router.post("", status_code=status.HTTP_201_CREATED)
def create_request_endpoint(
    body: CreateRequestPayload,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_sync_db)
):
    """
    Creates a new persistent service request in the database.
    """
    req = create_service_request(
        db=db,
        request_type=body.request_type,
        payload=body.payload,
        student_id=current_user.id,
        risk_level=body.risk_level,
        is_anonymous=body.is_anonymous,
        assigned_approver_id=body.assigned_approver_id
    )
    return req.to_dict()

@router.get("")
def list_requests_endpoint(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves list of service requests with optional filters.
    """
    reqs = get_service_requests(
        db=db,
        user=current_user,
        request_type=type,
        status_filter=status
    )
    return [r.to_dict() for r in reqs]

@router.get("/{id}")
def get_request_detail_endpoint(
    id: str,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves a single request by ID or tracking code.
    """
    req = get_service_request_by_id(db, id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request '{id}' not found."
        )
    return req.to_dict()

@router.patch("/{id}/status")
def update_status_endpoint(
    id: str,
    body: UpdateStatusPayload,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_sync_db)
):
    """
    Transitions service request state according to deterministic state machine rules.
    """
    updated_req = transition_request_status(
        db=db,
        request_id=id,
        new_status=body.status,
        actor=current_user,
        resolution_notes=body.resolution_notes
    )
    return updated_req.to_dict()
