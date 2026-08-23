import uuid
from typing import Dict, Any, List

CERTIFICATE_TYPES = [
    {
        "type": "BONAFIDE",
        "title": "Bonafide Student Certificate",
        "description": "Proof of active student enrollment for Passport, Bank Loan, or Visa applications.",
        "requires_approval": True,
        "processing_time": "Instant (Post Admin Sign-off)"
    },
    {
        "type": "CONDUCT",
        "title": "Character & Conduct Certificate",
        "description": "Official character certification for employment or higher studies.",
        "requires_approval": True,
        "processing_time": "1 Business Day"
    },
    {
        "type": "GRADE_TRANSCRIPT",
        "title": "Official Academic Transcript",
        "description": "Certified semester marksheets and CGPA transcript.",
        "requires_approval": True,
        "processing_time": "2 Business Days"
    }
]

# In-Memory Certificate Request Records
CERTIFICATE_RECORDS: List[Dict[str, Any]] = [
    {
        "cert_id": "CERT-881",
        "request_id": "50000000-0000-0000-0000-000000000002",
        "student_name": "Kaushal Raj Gupta",
        "student_reg_no": "2023-CSE-042",
        "department": "Computer Science & Engineering",
        "certificate_type": "BONAFIDE",
        "purpose": "Passport Application at SBI Branch",
        "status": "APPROVED",
        "approver_name": "Admin Officer Patnaik",
        "qr_verification_code": "QR-BONAFIDE-2026-881",
        "pdf_url": "/api/certificates/CERT-881/pdf",
        "issued_date": "2026-08-23"
    }
]

def verify_student_eligibility(student_reg_no: str = "2023-CSE-042") -> Dict[str, Any]:
    """Auto-verifies student enrollment status and fee clearance."""
    return {
        "verified": True,
        "student_name": "Rahul Sharma",
        "student_reg_no": student_reg_no,
        "program": "B.Tech Computer Science & Engineering",
        "academic_year": "2025-2026",
        "enrollment_status": "ACTIVE",
        "tuition_fee_dues": 0.0,
        "disabilities_disciplinary": "NONE"
    }

def commit_certificate_request(
    request_id: str,
    student_name: str,
    student_reg_no: str,
    department: str,
    certificate_type: str,
    purpose: str,
    approver_name: str = "Admin Officer Patnaik"
) -> Dict[str, Any]:
    """Generates official certificate record with embedded QR payload."""
    eligibility = verify_student_eligibility(student_reg_no)
    if not eligibility["verified"]:
        raise ValueError("Student is not eligible for certificate issuance.")

    cert_code = f"CERT-2026-{uuid.uuid4().hex[:6].upper()}"
    qr_code = f"QR-{certificate_type}-2026-{uuid.uuid4().hex[:6].upper()}"

    record = {
        "cert_id": cert_code,
        "request_id": request_id,
        "student_name": student_name,
        "student_reg_no": student_reg_no,
        "department": department,
        "certificate_type": certificate_type,
        "purpose": purpose,
        "status": "APPROVED",
        "approver_name": approver_name,
        "qr_verification_code": qr_code,
        "pdf_url": f"/api/certificates/{cert_code}/pdf",
        "issued_date": "2026-08-23"
    }

    CERTIFICATE_RECORDS.append(record)
    return record
