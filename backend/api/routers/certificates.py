from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query, Response
from pydantic import BaseModel, Field
from tools.certificate_tools import (
    CERTIFICATE_TYPES,
    verify_student_eligibility,
    commit_certificate_request,
    CERTIFICATE_RECORDS
)
from services.pdf.certificate_generator import (
    generate_bonafide_certificate_html,
    generate_bonafide_pdf
)

router = APIRouter(prefix="/certificates", tags=["Bonafide Certificate Service"])

class CertificateRequestPayload(BaseModel):
    request_id: Optional[str] = Field("50000000-0000-0000-0000-000000000002")
    student_name: Optional[str] = Field("Kaushal Raj Gupta")
    father_name: Optional[str] = Field("Rajesh Sharma")
    student_reg_no: Optional[str] = Field("24E042")
    department: Optional[str] = Field("Computer Science and Engineering")
    branch: Optional[str] = Field("Computer Science and Engineering")
    academic_year: Optional[str] = Field("2nd")
    academic_session: Optional[str] = Field("2025-2026")
    batch: Optional[str] = Field("2024 - 2025")
    certificate_type: str = Field("BONAFIDE", example="BONAFIDE")
    purpose: str = Field("Jharkhand state e Kalyan Scholarship", example="Jharkhand state e Kalyan Scholarship")
    approver_name: Optional[str] = Field("Admin Officer Patnaik")
    annual_fee: Optional[str] = Field("Rs. 2, 75,000/-")

@router.get("/types")
async def get_types():
    """Returns list of supported official university certificate workflows."""
    return CERTIFICATE_TYPES

@router.get("/eligibility")
async def check_eligibility(student_reg_no: str = Query("24E042")):
    """Auto-verifies student active enrollment status and fee clearance."""
    return verify_student_eligibility(student_reg_no)

@router.post("/request")
async def request_certificate(payload: CertificateRequestPayload):
    """
    Submits Bonafide Certificate request and generates QR-verified record.
    """
    try:
        record = commit_certificate_request(
            request_id=payload.request_id or "50000000-0000-0000-0000-000000000002",
            student_name=payload.student_name or "Kaushal Raj Gupta",
            student_reg_no=payload.student_reg_no or "24E042",
            department=payload.department or payload.branch or "Computer Science and Engineering",
            certificate_type=payload.certificate_type,
            purpose=payload.purpose,
            approver_name=payload.approver_name or "Admin Officer Patnaik"
        )
        record.update({
            "father_name": payload.father_name or "Rajesh Sharma",
            "branch": payload.branch or payload.department or "Computer Science and Engineering",
            "academic_year": payload.academic_year or "2nd",
            "academic_session": payload.academic_session or "2025-2026",
            "batch": payload.batch or "2024 - 2025",
            "annual_fee": payload.annual_fee or "Rs. 2, 75,000/-",
        })
        return record
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{cert_id}/download")
async def download_certificate_pdf(
    cert_id: str,
    student_name: Optional[str] = "Kaushal Raj Gupta",
    father_name: Optional[str] = "Rajesh Sharma",
    student_reg_no: Optional[str] = "24E042",
    branch: Optional[str] = "Computer Science and Engineering",
    academic_year: Optional[str] = "2nd",
    academic_session: Optional[str] = "2025-2026",
    batch: Optional[str] = "2024 - 2025",
    purpose: Optional[str] = "Jharkhand state e Kalyan Scholarship",
    issued_date: Optional[str] = "27.01.2026",
    annual_fee: Optional[str] = "Rs. 2, 75,000/-",
):
    """
    Renders official ReportLab binary PDF file stream for download.
    """
    matched = next((c for c in CERTIFICATE_RECORDS if c["cert_id"] == cert_id), None)
    cert_data = {
        "cert_id": cert_id if cert_id != "download" else "ITER/SOA/219",
        "student_name": matched.get("student_name", student_name) if matched else student_name,
        "father_name": matched.get("father_name", father_name) if matched else father_name,
        "student_reg_no": matched.get("student_reg_no", student_reg_no) if matched else student_reg_no,
        "branch": matched.get("branch", branch) if matched else branch,
        "academic_year": matched.get("academic_year", academic_year) if matched else academic_year,
        "academic_session": matched.get("academic_session", academic_session) if matched else academic_session,
        "batch": matched.get("batch", batch) if matched else batch,
        "purpose": matched.get("purpose", purpose) if matched else purpose,
        "issued_date": matched.get("issued_date", issued_date) if matched else issued_date,
        "annual_fee": matched.get("annual_fee", annual_fee) if matched else annual_fee,
        "qr_verification_code": matched.get("qr_verification_code", f"QR-SOA-{cert_id}") if matched else f"QR-SOA-ITER-{cert_id}"
    }

    pdf_bytes = generate_bonafide_pdf(cert_data)
    safe_id = cert_id.replace("/", "_")
    filename = f"SOA_ITER_Bonafide_Certificate_{safe_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.get("/{cert_id}/pdf")
async def get_certificate_pdf_preview(cert_id: str):
    """
    Renders watermarked HTML/PDF preview document for the specified certificate ID.
    """
    matched = next((c for c in CERTIFICATE_RECORDS if c["cert_id"] == cert_id), None)
    if not matched:
        matched = {
            "cert_id": cert_id,
            "student_name": "Kaushal Raj Gupta",
            "father_name": "Rajesh Sharma",
            "student_reg_no": "24E042",
            "department": "Computer Science and Engineering",
            "branch": "Computer Science and Engineering",
            "certificate_type": "BONAFIDE",
            "purpose": "Jharkhand state e Kalyan Scholarship",
            "approver_name": "Admin Officer Patnaik",
            "qr_verification_code": f"QR-BONAFIDE-2026-{cert_id}",
            "issued_date": "27.01.2026"
        }

    html_code = generate_bonafide_certificate_html(matched)
    return Response(content=html_code, media_type="text/html")
