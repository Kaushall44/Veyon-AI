from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ComplianceCheck(BaseModel):
    check_name: str = Field(..., example="Course Prerequisites")
    status: str = Field(..., example="PASSED") # PASSED, CHECKED, WARNING
    details: str = Field(..., example="Student passed CS301 Machine Learning with Grade B+")

class ApprovalTaskSchema(BaseModel):
    id: str = Field(..., example="80000000-0000-0000-0000-000000000001")
    request_id: str = Field(..., example="50000000-0000-0000-0000-000000000001")
    student_name: str = Field(..., example="Rahul Sharma")
    student_reg_no: str = Field(..., example="2023-CSE-042")
    department: str = Field(..., example="Computer Science & Engineering")
    service_type: str = Field(..., example="LAB_BOOKING")
    lab_name: str = Field(..., example="Advanced AI Lab (Room C-204)")
    date_slot: str = Field(..., example="Tomorrow (24 Aug 2026), 14:00 - 16:00")
    purpose: str = Field(..., example="B.Tech Capstone Project Work")
    risk_level: str = Field(..., example="HIGH")
    status: str = Field(..., example="PENDING") # PENDING, APPROVED, REJECTED
    assigned_role: str = Field(..., example="Lab_In_Charge")
    ai_compliance_checks: List[ComplianceCheck]
    approver_comments: Optional[str] = None
    access_pass_code: Optional[str] = None
    created_at: str = Field(..., example="10 mins ago")

class ApprovePayload(BaseModel):
    approver_id: Optional[str] = Field("u1000000-0000-0000-0000-000000000003")
    comments: Optional[str] = Field(None, example="Approved for Capstone project work.")

class RejectPayload(BaseModel):
    approver_id: Optional[str] = Field("u1000000-0000-0000-0000-000000000003")
    rejection_reason: str = Field(..., example="Lab capacity reserved for end-semester lab examinations.")
