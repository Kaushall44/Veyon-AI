from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from tools.grievance_tools import (
    GRIEVANCE_CATEGORIES,
    create_grievance,
    get_sanitized_grievance_queue,
    GRIEVANCE_RECORDS
)

router = APIRouter(prefix="/grievances", tags=["Grievance Escalation Service"])

class SubmitGrievancePayload(BaseModel):
    category: str = Field("ACADEMIC", example="ACADEMIC")
    department: str = Field("Computer Science & Engineering", example="Computer Science & Engineering")
    description: str = Field("Lab equipment non-functional during mid-term evaluation.", example="Lab equipment issue")
    is_anonymous: bool = Field(True, example=True)
    student_name: Optional[str] = Field("Rahul Sharma")
    student_reg_no: Optional[str] = Field("2023-CSE-042")

class ResolveGrievancePayload(BaseModel):
    resolution_notes: str = Field("Inspected Lab 4 computers. Replaced 5 faulty memory modules and updated OS image.", example="Replaced memory modules")
    officer_name: Optional[str] = Field("Prof. S. N. Panda")

@router.get("/categories")
async def get_categories():
    """Returns official grievance redressal categories."""
    return GRIEVANCE_CATEGORIES

@router.get("/queue")
async def get_queue():
    """Returns grievance queue with mandatory anonymity identity masking."""
    return get_sanitized_grievance_queue()

@router.post("/submit")
async def submit_grievance(payload: SubmitGrievancePayload):
    """
    Submits confidential grievance and returns tracking token e.g. #GR-1049.
    Enforces identity masking when is_anonymous is True.
    """
    return create_grievance(
        category=payload.category,
        department=payload.department,
        description=payload.description,
        is_anonymous=payload.is_anonymous,
        student_name=payload.student_name or "Rahul Sharma",
        student_reg_no=payload.student_reg_no or "2023-CSE-042"
    )

@router.post("/{token}/resolve")
async def resolve_grievance(token: str, payload: ResolveGrievancePayload):
    """Logs officer resolution notes and marks grievance as RESOLVED."""
    matched = next((g for g in GRIEVANCE_RECORDS if g["tracking_token"] == token), None)
    if not matched:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Grievance token '{token}' not found.")

    matched["status"] = "RESOLVED"
    matched["resolution_notes"] = payload.resolution_notes
    matched["assigned_officer"] = payload.officer_name or matched["assigned_officer"]
    return matched
