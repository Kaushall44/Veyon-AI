import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List

GRIEVANCE_CATEGORIES = {
    "ACADEMIC": "Academic & Evaluation Concerns",
    "HOSTEL_FACILITIES": "Hostel & Mess Facilities",
    "EXAMINATION": "Examination & Grading Integrity",
    "HARASSMENT_DISCRIMINATION": "Harassment & Anti-Discrimination Cell"
}

# Initial In-Memory Grievance Records
GRIEVANCE_RECORDS: List[Dict[str, Any]] = [
    {
        "tracking_token": "GR-1049",
        "request_id": "50000000-0000-0000-0000-000000000004",
        "category": "ACADEMIC",
        "department": "Computer Science & Engineering",
        "description": "Lab equipment non-functional in Lab 4 during mid-term evaluation.",
        "is_anonymous": True,
        "complainant_name": "[IDENTITY MASKED BY POLICY]",
        "complainant_reg_no": "[MASKED]",
        "status": "UNDER_REVIEW",
        "assigned_officer": "Prof. S. N. Panda (Grievance Redressal Officer)",
        "created_at": "2026-08-23 14:00",
        "sla_deadline": "2026-08-25 14:00",  # 48 hours SLA
        "is_escalated": False,
        "resolution_notes": None
    }
]

def mask_identity_if_needed(record: Dict[str, Any]) -> Dict[str, Any]:
    """Strictly masks complainant identity if is_anonymous is True."""
    sanitized = dict(record)
    if sanitized.get("is_anonymous"):
        sanitized["complainant_name"] = "ANONYMOUS_COMPLAINANT"
        sanitized["complainant_reg_no"] = "[MASKED BY ANONYMITY POLICY]"
        sanitized["student_email"] = "[MASKED]"
    return sanitized

def create_grievance(
    category: str,
    department: str,
    description: str,
    is_anonymous: bool = True,
    student_name: str = "Rahul Sharma",
    student_reg_no: str = "2023-CSE-042"
) -> Dict[str, Any]:
    """Submits a confidential grievance and enforces anonymity masking rules."""
    token = f"GR-{uuid.uuid4().hex[:4].upper()}"
    now = datetime.now()
    sla_deadline = (now + timedelta(hours=48)).strftime("%Y-%m-%d %H:%M")

    record = {
        "tracking_token": token,
        "request_id": str(uuid.uuid4()),
        "category": category,
        "department": department,
        "description": description,
        "is_anonymous": is_anonymous,
        "complainant_name": "[IDENTITY MASKED BY POLICY]" if is_anonymous else student_name,
        "complainant_reg_no": "[MASKED]" if is_anonymous else student_reg_no,
        "status": "SUBMITTED",
        "assigned_officer": "Prof. S. N. Panda (Grievance Redressal Officer)",
        "created_at": now.strftime("%Y-%m-%d %H:%M"),
        "sla_deadline": sla_deadline,
        "is_escalated": False,
        "resolution_notes": None
    }

    GRIEVANCE_RECORDS.append(record)
    return mask_identity_if_needed(record)

def get_sanitized_grievance_queue() -> List[Dict[str, Any]]:
    """Returns all grievances with mandatory identity masking for anonymous submissions."""
    return [mask_identity_if_needed(g) for g in GRIEVANCE_RECORDS]
