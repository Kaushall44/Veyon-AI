from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.orm import Session

try:
    from backend.schemas.approval_schemas import ApprovalTaskSchema, DecidePayload, ApprovePayload, RejectPayload
    from backend.services.approval_service import ApprovalService
    from backend.middleware.rbac import require_roles
    from backend.database.session import get_sync_db
except ImportError:
    from schemas.approval_schemas import ApprovalTaskSchema, DecidePayload, ApprovePayload, RejectPayload
    from services.approval_service import ApprovalService
    from middleware.rbac import require_roles
    from database.session import get_sync_db

router = APIRouter(prefix="/approvals", tags=["Human Approvals & HITL Engine"])

@router.get("", response_model=List[ApprovalTaskSchema])
async def list_approvals(
    role: Optional[str] = Query(None),
    current_user = Depends(require_roles(["Faculty", "Lab_In_Charge", "Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """Retrieves all approval tasks optionally filtered by assigned role."""
    return ApprovalService.get_all_approvals(db=db)

@router.get("/pending", response_model=List[ApprovalTaskSchema])
async def list_pending_approvals(
    role: Optional[str] = Query(None),
    current_user = Depends(require_roles(["Faculty", "Lab_In_Charge", "Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """Retrieves all pending human-in-the-loop approval tasks."""
    return ApprovalService.get_pending_approvals(role_filter=role, db=db)

@router.post("/{task_id}/decide", response_model=ApprovalTaskSchema)
async def decide_task_endpoint(
    task_id: str,
    payload: DecidePayload,
    current_user = Depends(require_roles(["Faculty", "Lab_In_Charge", "Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Executes a formal Human-in-the-Loop decision:
    - 'APPROVED': Issues verifiable digital access pass / QR code and advances workflow state.
    - 'REJECTED': Enforces mandatory justification text and closes request.
    - 'CLARIFICATION_REQUESTED': Returns task to student for prerequisite clarification.
    """
    try:
        approver_id = payload.approver_id or getattr(current_user, "id", "faculty-001")
        approver_role = getattr(current_user, "role", "Faculty")
        return ApprovalService.decide_approval(
            task_id=task_id,
            decision=payload.decision,
            approver_id=approver_id,
            approver_role=approver_role,
            justification=payload.justification,
            comments=payload.comments,
            db=db
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/{task_id}/approve", response_model=ApprovalTaskSchema)
async def approve_task_endpoint(
    task_id: str,
    payload: ApprovePayload,
    current_user = Depends(require_roles(["Faculty", "Lab_In_Charge", "Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Approve human-in-the-loop task.
    Triggers downstream tool execution (issues digital access pass) and logs audit record.
    """
    try:
        approver_id = payload.approver_id or getattr(current_user, "id", "faculty-001")
        approver_role = getattr(current_user, "role", "Faculty")
        return ApprovalService.decide_approval(
            task_id=task_id,
            decision="APPROVED",
            approver_id=approver_id,
            approver_role=approver_role,
            comments=payload.comments,
            db=db
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/{task_id}/reject", response_model=ApprovalTaskSchema)
async def reject_task_endpoint(
    task_id: str,
    payload: RejectPayload,
    current_user = Depends(require_roles(["Faculty", "Lab_In_Charge", "Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Reject human-in-the-loop task.
    Requires mandatory rejection reason input before rejecting request.
    """
    try:
        approver_id = payload.approver_id or getattr(current_user, "id", "faculty-001")
        approver_role = getattr(current_user, "role", "Faculty")
        return ApprovalService.decide_approval(
            task_id=task_id,
            decision="REJECTED",
            approver_id=approver_id,
            approver_role=approver_role,
            justification=payload.rejection_reason,
            db=db
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
