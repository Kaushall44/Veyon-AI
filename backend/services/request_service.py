import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

try:
    from backend.database.models import ServiceRequest, User, AuditLog, Notification
    from backend.database.supabase_client import supabase_insert, supabase_update, supabase_select
except ImportError:
    from database.models import ServiceRequest, User, AuditLog, Notification
    from database.supabase_client import supabase_insert, supabase_update, supabase_select

# Deterministic State Machine Transition Matrix
VALID_TRANSITIONS: Dict[str, List[str]] = {
    "DRAFT": ["SUBMITTED", "CANCELLED"],
    "SUBMITTED": ["WAITING_FOR_APPROVAL", "APPROVED", "IN_PROGRESS", "REJECTED", "CANCELLED"],
    "WAITING_FOR_APPROVAL": ["APPROVED", "REJECTED", "CANCELLED"],
    "APPROVED": ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
    "IN_PROGRESS": ["COMPLETED", "REJECTED", "CANCELLED"],
    "COMPLETED": [],  # Terminal state
    "REJECTED": [],   # Terminal state
    "CANCELLED": []   # Terminal state
}

# Prefix mapping for tracking codes
TYPE_PREFIX_MAP: Dict[str, str] = {
    "LAB_BOOKING": "LB",
    "CERTIFICATE": "CERT",
    "MAINTENANCE": "MT",
    "GRIEVANCE": "GRV",
}

def generate_tracking_code(request_type: str) -> str:
    prefix = TYPE_PREFIX_MAP.get(request_type.upper(), "REQ")
    random_digits = uuid.uuid4().hex[:4].upper()
    return f"#{prefix}-{random_digits}"

def create_service_request(
    db: Session,
    request_type: str,
    payload: Dict[str, Any],
    student_id: Optional[str] = None,
    risk_level: str = "LOW",
    is_anonymous: bool = False,
    assigned_approver_id: Optional[str] = None,
    initial_status: Optional[str] = None
) -> ServiceRequest:
    """
    Creates a persistent service request record in PostgreSQL with unique tracking code.
    """
    status_to_set = initial_status or ("WAITING_FOR_APPROVAL" if risk_level == "HIGH" else "SUBMITTED")
    tracking_code = generate_tracking_code(request_type)

    new_req = ServiceRequest(
        id=str(uuid.uuid4()),
        tracking_code=tracking_code,
        request_type=request_type.upper(),
        student_id=student_id if not is_anonymous else None,
        status=status_to_set,
        risk_level=risk_level.upper(),
        assigned_approver_id=assigned_approver_id,
        is_anonymous=is_anonymous,
        payload=payload,
        resolution_notes=None
    )

    db.add(new_req)
    
    # Audit log
    audit_entry = AuditLog(
        actor_id=student_id or "ANONYMOUS",
        actor_role="Student" if not is_anonymous else "ANONYMOUS",
        action_type=f"{request_type.upper()}_CREATED",
        request_id=new_req.id,
        ip_address="127.0.0.1",
        details={
            "tracking_code": tracking_code,
            "status": status_to_set,
            "risk_level": risk_level
        }
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(new_req)

    # Sync to Supabase Cloud Database
    try:
        supa_status = "APPROVED" if status_to_set in ["APPROVED", "COMPLETED", "RESOLVED"] else "REJECTED" if status_to_set in ["REJECTED", "CANCELLED"] else "PENDING_APPROVAL"
        supabase_insert("service_requests", {
            "id": new_req.id,
            "user_id": student_id or "20000000-0000-0000-0000-000000000001",
            "service_type": request_type.upper(),
            "status": supa_status,
            "current_step": 1,
            "ai_plan": payload
        })
        supabase_insert("audit_logs", {
            "id": str(uuid.uuid4()),
            "actor_id": student_id or "ANONYMOUS",
            "actor_role": "Student" if not is_anonymous else "ANONYMOUS",
            "action_type": f"{request_type.upper()}_CREATED",
            "request_id": new_req.id,
            "ip_address": "127.0.0.1",
            "details": {
                "tracking_code": tracking_code,
                "status": status_to_set,
                "risk_level": risk_level
            }
        })
    except Exception:
        pass

    return new_req

def get_service_requests(
    db: Session,
    user: Optional[User] = None,
    request_type: Optional[str] = None,
    status_filter: Optional[str] = None
) -> List[ServiceRequest]:
    """
    Queries requests from database with role-based visibility and filters.
    """
    query = db.query(ServiceRequest)

    # If student, restrict to own requests (unless anonymous)
    if user and user.role == "Student":
        query = query.filter(ServiceRequest.student_id == user.id)

    if request_type:
        query = query.filter(ServiceRequest.request_type == request_type.upper())

    if status_filter:
        query = query.filter(ServiceRequest.status.ilike(f"%{status_filter}%"))

    return query.order_by(ServiceRequest.created_at.desc()).all()

def get_service_request_by_id(db: Session, request_id: str) -> Optional[ServiceRequest]:
    """
    Retrieves a single request by UUID or tracking code.
    """
    return db.query(ServiceRequest).filter(
        (ServiceRequest.id == request_id) | (ServiceRequest.tracking_code == request_id) | (ServiceRequest.tracking_code == f"#{request_id}")
    ).first()

def transition_request_status(
    db: Session,
    request_id: str,
    new_status: str,
    actor: Optional[User] = None,
    resolution_notes: Optional[str] = None
) -> ServiceRequest:
    """
    Executes a deterministic state machine transition with strict validation.
    """
    req = get_service_request_by_id(db, request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request '{request_id}' not found."
        )

    current_status = req.status.upper()
    target_status = new_status.upper()

    # Validate State Transition
    allowed_next_states = VALID_TRANSITIONS.get(current_status, [])
    if target_status not in allowed_next_states:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Illegal state transition: Cannot change status from '{current_status}' to '{target_status}'. Allowed next states: {allowed_next_states}"
        )

    # Apply Transition
    req.status = target_status
    if resolution_notes:
        req.resolution_notes = resolution_notes

    # Notification & Audit dispatch
    if req.student_id:
        notif = Notification(
            user_id=req.student_id,
            title=f"Request Status Updated ({req.tracking_code})",
            message=f"Your {req.request_type} request is now {target_status}. {resolution_notes or ''}".strip(),
            category=req.request_type if req.request_type in ["LAB", "MAINTENANCE", "GRIEVANCE"] else "SYSTEM",
            link_path="/requests"
        )
        db.add(notif)

    audit_entry = AuditLog(
        actor_id=actor.id if actor else "SYSTEM",
        actor_role=actor.role if actor else "SYSTEM",
        action_type="REQUEST_STATUS_TRANSITIONED",
        request_id=req.id,
        ip_address="127.0.0.1",
        details={
            "tracking_code": req.tracking_code,
            "old_status": current_status,
            "new_status": target_status,
            "notes": resolution_notes
        }
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(req)

    # Sync status to Supabase Cloud Database
    try:
        supa_status = "APPROVED" if target_status in ["APPROVED", "COMPLETED", "RESOLVED"] else "REJECTED" if target_status in ["REJECTED", "CANCELLED"] else "PENDING_APPROVAL"
        supabase_update("service_requests", {"id": req.id}, {
            "status": supa_status
        })
    except Exception:
        pass

    return req
