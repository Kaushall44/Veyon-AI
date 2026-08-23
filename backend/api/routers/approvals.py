from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from schemas.approval_schemas import ApprovalTaskSchema, ApprovePayload, RejectPayload
from services.workflow.approval_engine import (
    get_all_approvals,
    get_pending_approvals,
    approve_approval_task,
    reject_approval_task
)

router = APIRouter(prefix="/approvals", tags=["Human Approvals & HITL Engine"])

@router.get("", response_model=List[ApprovalTaskSchema])
async def list_approvals(role: Optional[str] = Query(None)):
    """Retrieves all approval tasks optionally filtered by assigned role."""
    return get_all_approvals()

@router.get("/pending", response_model=List[ApprovalTaskSchema])
async def list_pending_approvals(role: Optional[str] = Query(None)):
    """Retrieves all pending human-in-the-loop approval tasks."""
    return get_pending_approvals(role_filter=role)

@router.post("/{task_id}/approve", response_model=ApprovalTaskSchema)
async def approve_task_endpoint(task_id: str, payload: ApprovePayload):
    """
    Approve human-in-the-loop task.
    Triggers downstream tool execution (issues digital access pass) and logs audit record.
    """
    try:
        return approve_approval_task(
            task_id=task_id,
            approver_id=payload.approver_id or "faculty-001",
            comments=payload.comments
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/{task_id}/reject", response_model=ApprovalTaskSchema)
async def reject_task_endpoint(task_id: str, payload: RejectPayload):
    """
    Reject human-in-the-loop task.
    Requires mandatory rejection reason input before rejecting request.
    """
    try:
        return reject_approval_task(
            task_id=task_id,
            approver_id=payload.approver_id or "faculty-001",
            rejection_reason=payload.rejection_reason
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
