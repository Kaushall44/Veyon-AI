import uuid
from typing import List, Optional, Dict, Any
from schemas.approval_schemas import ApprovalTaskSchema, ComplianceCheck

# Prototype In-Memory Approval Task Queue Store (Seeded with Flagship Lab Booking Request #LB-4019)
INITIAL_APPROVAL_TASKS: Dict[str, ApprovalTaskSchema] = {
    "80000000-0000-0000-0000-000000000001": ApprovalTaskSchema(
        id="80000000-0000-0000-0000-000000000001",
        request_id="50000000-0000-0000-0000-000000000001",
        student_name="Kaushal Raj Gupta",
        student_reg_no="2023-CSE-042",
        department="Computer Science & Engineering",
        service_type="LAB_BOOKING",
        lab_name="Advanced AI Lab (Room C-204)",
        date_slot="Tomorrow (24 Aug 2026), 14:00 - 16:00",
        purpose="B.Tech Major Capstone Project Work (Deep Learning Model Training)",
        risk_level="HIGH",
        status="PENDING",
        assigned_role="Lab_In_Charge",
        ai_compliance_checks=[
            ComplianceCheck(check_name="Course Prerequisites", status="PASSED", details="Passed CS301 Machine Learning with Grade B+"),
            ComplianceCheck(check_name="Slot Capacity", status="AVAILABLE", details="25 out of 30 GPU workstations free"),
            ComplianceCheck(check_name="Safety Compliance", status="CHECKED", details="Safety orientation completed on 10 Aug 2026"),
        ],
        approver_comments=None,
        access_pass_code=None,
        created_at="10 mins ago"
    ),
    "80000000-0000-0000-0000-000000000002": ApprovalTaskSchema(
        id="80000000-0000-0000-0000-000000000002",
        request_id="50000000-0000-0000-0000-000000000002",
        student_name="Ananya Mishra",
        student_reg_no="2023-CSE-089",
        department="Computer Science & Engineering",
        service_type="CERTIFICATE",
        lab_name="Academic Registrar Office",
        date_slot="Immediate Issuance",
        purpose="Bonafide Certificate for Bank Education Loan",
        risk_level="MEDIUM",
        status="PENDING",
        assigned_role="Faculty",
        ai_compliance_checks=[
            ComplianceCheck(check_name="Active Enrollment", status="PASSED", details="Verified 3rd Year B.Tech CSE"),
            ComplianceCheck(check_name="Tuition Fee Clearance", status="PASSED", details="Zero outstanding dues for Semester 5"),
        ],
        approver_comments=None,
        access_pass_code=None,
        created_at="35 mins ago"
    ),
}

def get_all_approvals() -> List[ApprovalTaskSchema]:
    return list(INITIAL_APPROVAL_TASKS.values())

def get_pending_approvals(role_filter: Optional[str] = None) -> List[ApprovalTaskSchema]:
    tasks = [t for t in INITIAL_APPROVAL_TASKS.values() if t.status == "PENDING"]
    if role_filter:
        tasks = [t for t in tasks if t.assigned_role.lower() == role_filter.lower()]
    return tasks

def approve_approval_task(task_id: str, approver_id: str = "faculty-001", comments: Optional[str] = None) -> ApprovalTaskSchema:
    if task_id not in INITIAL_APPROVAL_TASKS:
        raise ValueError(f"Approval task #{task_id} not found.")

    task = INITIAL_APPROVAL_TASKS[task_id]
    if task.status != "PENDING":
        raise ValueError(f"Approval task #{task_id} is already in {task.status} status.")

    task.status = "APPROVED"
    task.approver_comments = comments or "Approved after AI pre-verification check."
    task.access_pass_code = f"PASS-LAB-AI-{uuid.uuid4().hex[:5].upper()}"

    return task

def reject_approval_task(task_id: str, approver_id: str = "faculty-001", rejection_reason: str = "") -> ApprovalTaskSchema:
    if not rejection_reason or not rejection_reason.strip():
        raise ValueError("Rejection reason is mandatory before rejecting a request.")

    if task_id not in INITIAL_APPROVAL_TASKS:
        raise ValueError(f"Approval task #{task_id} not found.")

    task = INITIAL_APPROVAL_TASKS[task_id]
    if task.status != "PENDING":
        raise ValueError(f"Approval task #{task_id} is already in {task.status} status.")

    task.status = "REJECTED"
    task.approver_comments = f"REJECTED: {rejection_reason.strip()}"

    return task
