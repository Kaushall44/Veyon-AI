from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from tools.lab_tools import get_lab_catalog, check_lab_availability, commit_lab_booking

router = APIRouter(prefix="/labs", tags=["Lab Room Catalog & Reservations"])

class CommitBookingRequest(BaseModel):
    request_id: Optional[str] = Field("50000000-0000-0000-0000-000000000001")
    student_name: Optional[str] = Field("Kaushal Raj Gupta")
    lab_id: str = Field("LAB-AI-101", example="LAB-AI-101")
    date: str = Field("2026-08-24", example="2026-08-24")
    start_time: str = Field("14:00", example="14:00")
    end_time: str = Field("16:00", example="16:00")
    purpose: Optional[str] = Field("B.Tech Capstone Project Work")
    approver_name: Optional[str] = Field("Prof. A. K. Samanta")

@router.get("/catalog")
async def get_catalog():
    """Retrieves full catalog of institutional lab rooms and workstations."""
    return get_lab_catalog()

@router.get("/availability")
async def check_availability(
    lab_id: str = Query("LAB-AI-101"),
    date: str = Query("2026-08-24"),
    start_time: str = Query("14:00"),
    end_time: str = Query("16:00")
):
    """
    Checks real-time slot capacity and double-booking rules.
    """
    return check_lab_availability(lab_id, date, start_time, end_time)

@router.post("/book")
async def book_lab_slot(payload: CommitBookingRequest):
    """
    Tool execution endpoint: Commits lab slot reservation and issues Digital Access Pass.
    """
    try:
        return commit_lab_booking(
            request_id=payload.request_id or "50000000-0000-0000-0000-000000000001",
            student_name=payload.student_name or "Kaushal Raj Gupta",
            lab_id=payload.lab_id,
            date=payload.date,
            start_time=payload.start_time,
            end_time=payload.end_time,
            purpose=payload.purpose or "B.Tech Capstone Project Work",
            approver_name=payload.approver_name or "Prof. A. K. Samanta"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
