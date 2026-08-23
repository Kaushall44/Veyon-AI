from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query, Response
from pydantic import BaseModel, Field
from tools.certificate_tools import (
    CERTIFICATE_TYPES,
    verify_student_eligibility,
    commit_certificate_request,
    CERTIFICATE_RECORDS
)
from services.pdf.certificate_generator import generate_bonafide_certificate_html

router = APIRouter(prefix="/certificates", tags=["Bonafide Certificate Service"])

class CertificateRequestPayload(BaseModel):
    request_id: Optional[str] = Field("50000000-0000-0000-0000-000000000002")
    student_name: Optional[str] = Field("Kaushal Raj Gupta")
    student_reg_no: Optional[str] = Field("2023-CSE-042")
    department: Optional[str] = Field("Computer Science & Engineering")
    certificate_type: str = Field("BONAFIDE", example="BONAFIDE")
    purpose: str = Field("Passport Application at SBI Branch", example="Passport Application")
    approver_name: Optional[str] = Field("Admin Officer Patnaik")

@router.get("/types")
async def get_types():
    """Returns list of supported official university certificate workflows."""
    return CERTIFICATE_TYPES

@router.get("/eligibility")
async def check_eligibility(student_reg_no: str = Query("2023-CSE-042")):
    """Auto-verifies student active enrollment status and fee clearance."""
    return verify_student_eligibility(student_reg_no)

@router.post("/request")
async def request_certificate(payload: CertificateRequestPayload):
    """
    Submits Bonafide Certificate request and generates QR-verified record.
    """
    try:
        return commit_certificate_request(
            request_id=payload.request_id or "50000000-0000-0000-0000-000000000002",
            student_name=payload.student_name or "Kaushal Raj Gupta",
            student_reg_no=payload.student_reg_no or "2023-CSE-042",
            department=payload.department or "Computer Science & Engineering",
            certificate_type=payload.certificate_type,
            purpose=payload.purpose,
            approver_name=payload.approver_name or "Admin Officer Patnaik"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{cert_id}/pdf")
async def get_certificate_pdf(cert_id: str):
    """
    Renders watermarked HTML/PDF preview document for the specified certificate ID.
    """
    matched = next((c for c in CERTIFICATE_RECORDS if c["cert_id"] == cert_id), None)
    if not matched:
        matched = {
            "cert_id": cert_id,
            "student_name": "RAHUL SHARMA",
            "student_reg_no": "2023-CSE-042",
            "department": "Computer Science & Engineering",
            "certificate_type": "BONAFIDE",
            "purpose": "Passport Application at SBI Branch",
            "approver_name": "Admin Officer Patnaik",
            "qr_verification_code": f"QR-BONAFIDE-2026-{cert_id}",
            "issued_date": "23 August 2026"
        }

    html_code = generate_bonafide_certificate_html(matched)
    return Response(content=html_code, media_type="text/html")
