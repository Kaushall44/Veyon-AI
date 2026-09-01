from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

try:
    from backend.services.lab_service import LabReservationService
    from backend.database.session import get_sync_db
    from backend.middleware.rbac import get_current_user_from_token
except ImportError:
    from services.lab_service import LabReservationService
    from database.session import get_sync_db
    from middleware.rbac import get_current_user_from_token

router = APIRouter(prefix="/labs", tags=["Lab Room Catalog & Reservations"])

class CommitBookingRequest(BaseModel):
    request_id: Optional[str] = Field(None, example="50000000-0000-0000-0000-000000000001")
    student_id: Optional[str] = Field("u1000000-0000-0000-0000-000000000001")
    student_name: Optional[str] = Field("Kaushal Raj Gupta")
    student_reg_no: Optional[str] = Field("2023-CSE-042")
    lab_id: str = Field("LAB-AI-101", example="LAB-AI-101")
    date: str = Field("2026-08-24", example="2026-08-24")
    start_time: str = Field("14:00", example="14:00")
    end_time: str = Field("16:00", example="16:00")
    workstation_no: Optional[int] = Field(None, example=12)
    purpose: Optional[str] = Field("B.Tech Capstone Project Work")
    approver_name: Optional[str] = Field("Prof. A. K. Samanta")

@router.get("/catalog")
async def get_catalog(db: Session = Depends(get_sync_db)):
    """Retrieves full catalog of institutional lab rooms and workstations."""
    return LabReservationService.get_lab_catalog(db=db)

@router.get("/availability")
async def check_availability(
    lab_id: str = Query("LAB-AI-101"),
    date: str = Query("2026-08-24"),
    start_time: str = Query("14:00"),
    end_time: str = Query("16:00"),
    student_attendance: float = Query(88.5),
    student_cgpa: float = Query(8.2),
    db: Session = Depends(get_sync_db)
):
    """
    Checks real-time slot capacity, prerequisite qualification, and fast-track eligibility.
    """
    return LabReservationService.check_lab_availability(
        lab_id=lab_id,
        date=date,
        start_time=start_time,
        end_time=end_time,
        student_attendance=student_attendance,
        student_cgpa=student_cgpa,
        db=db
    )

@router.post("/book", status_code=status.HTTP_201_CREATED)
async def book_lab_slot(
    payload: CommitBookingRequest,
    db: Session = Depends(get_sync_db)
):
    """
    Commits lab slot reservation with concurrency protection.
    Raises HTTP 409 Conflict if workstation is already booked or slot is at full capacity.
    """
    try:
        return LabReservationService.commit_lab_booking(
            lab_id=payload.lab_id,
            date=payload.date,
            start_time=payload.start_time,
            end_time=payload.end_time,
            student_id=payload.student_id or "u1000000-0000-0000-0000-000000000001",
            student_name=payload.student_name or "Kaushal Raj Gupta",
            student_reg_no=payload.student_reg_no or "2023-CSE-042",
            purpose=payload.purpose or "B.Tech Capstone Project Work",
            request_id=payload.request_id,
            approver_name=payload.approver_name or "Prof. A. K. Samanta",
            workstation_no=payload.workstation_no,
            db=db
        )
    except ValueError as e:
        error_msg = str(e)
        if "Conflicting booking" in error_msg or "already reserved" in error_msg:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=error_msg)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
