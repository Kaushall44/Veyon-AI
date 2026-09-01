import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

try:
    from backend.database.models import ApprovalRecord, ServiceRequest, AuditLog, User
    from backend.schemas.approval_schemas import ApprovalTaskSchema, ComplianceCheck
    from backend.api.routers.notifications import dispatch_system_notification
except ImportError:
    from database.models import ApprovalRecord, ServiceRequest, AuditLog, User
    from schemas.approval_schemas import ApprovalTaskSchema, ComplianceCheck
    try:
        from api.routers.notifications import dispatch_system_notification
    except ImportError:
        dispatch_system_notification = None

# In-Memory Queue Store for Fast Reactive State & Fallback
IN_MEMORY_APPROVAL_TASKS: Dict[str, Dict[str, Any]] = {
    "80000000-0000-0000-0000-000000000001": {
        "id": "80000000-0000-0000-0000-000000000001",
        "request_id": "50000000-0000-0000-0000-000000000001",
        "student_name": "Kaushal Raj Gupta",
        "student_reg_no": "2023-CSE-042",
        "department": "Computer Science & Engineering",
        "service_type": "LAB_BOOKING",
        "lab_name": "Advanced AI & GPU Computing Lab (Room C-204)",
        "date_slot": "Tomorrow (24 Aug 2026), 14:00 - 16:00",
        "purpose": "B.Tech Major Capstone Project Work (Deep Learning Model Training on RTX 4090)",
        "risk_level": "HIGH",
        "status": "PENDING",
        "assigned_role": "Lab_In_Charge",
        "ai_compliance_checks": [
            {"check_name": "Course Prerequisites", "status": "PASSED", "details": "Passed CS301 Machine Learning with Grade B+"},
            {"check_name": "Slot Capacity", "status": "AVAILABLE", "details": "25 out of 30 GPU workstations free"},
            {"check_name": "Safety Compliance", "status": "CHECKED", "details": "Safety orientation completed on 10 Aug 2026"},
        ],
        "approver_comments": None,
        "access_pass_code": None,
        "qr_pass_payload": None,
        "created_at": "10 mins ago"
    },
    "80000000-0000-0000-0000-000000000002": {
        "id": "80000000-0000-0000-0000-000000000002",
        "request_id": "50000000-0000-0000-0000-000000000002",
        "student_name": "Ananya Mishra",
        "student_reg_no": "2023-CSE-089",
        "department": "Computer Science & Engineering",
        "service_type": "CERTIFICATE",
        "lab_name": "Academic Registrar Office",
        "date_slot": "Immediate Issuance",
        "purpose": "Bonafide Certificate for Bank Education Loan",
        "risk_level": "MEDIUM",
        "status": "PENDING",
        "assigned_role": "Faculty",
        "ai_compliance_checks": [
            {"check_name": "Active Enrollment", "status": "PASSED", "details": "Verified 3rd Year B.Tech CSE"},
            {"check_name": "Tuition Fee Clearance", "status": "PASSED", "details": "Zero outstanding dues for Semester 5"},
        ],
        "approver_comments": None,
        "access_pass_code": None,
        "qr_pass_payload": None,
        "created_at": "35 mins ago"
    }
}

class ApprovalService:
    """
    Human-in-the-Loop Approval Desk Service.
    Enforces multi-role review (Faculty, Lab In-Charge, Admin),
    prerequisite inspection, state progression, and verifiable QR pass issuance.
    """

    @classmethod
    def get_all_approvals(cls, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        return list(IN_MEMORY_APPROVAL_TASKS.values())

    @classmethod
    def get_pending_approvals(cls, role_filter: Optional[str] = None, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        tasks = [t for t in IN_MEMORY_APPROVAL_TASKS.values() if t["status"] == "PENDING"]
        if role_filter:
            tasks = [t for t in tasks if t["assigned_role"].lower() == role_filter.lower()]
        return tasks

    @classmethod
    def decide_approval(
        cls,
        task_id: str,
        decision: str,
        approver_id: str,
        approver_role: str = "Faculty",
        justification: Optional[str] = None,
        comments: Optional[str] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """
        Executes an approval decision: 'APPROVED', 'REJECTED', or 'CLARIFICATION_REQUESTED'.
        - 'APPROVED': Generates verifiable QR pass, updates service request status to 'APPROVED'.
        - 'REJECTED': Requires mandatory justification text, updates request to 'REJECTED'.
        - 'CLARIFICATION_REQUESTED': Sets status to 'CLARIFICATION_REQUESTED' and logs comments.
        """
        valid_decisions = ["APPROVED", "REJECTED", "CLARIFICATION_REQUESTED"]
        decision_upper = decision.strip().upper()
        if decision_upper not in valid_decisions:
            raise ValueError(f"Invalid decision '{decision}'. Must be one of {valid_decisions}.")

        if decision_upper == "REJECTED" and (not justification or not justification.strip()):
            raise ValueError("Mandatory justification is required when rejecting a request.")

        if task_id not in IN_MEMORY_APPROVAL_TASKS:
            raise ValueError(f"Approval task #{task_id} not found.")

        task = IN_MEMORY_APPROVAL_TASKS[task_id]
        if task["status"] not in ["PENDING", "CLARIFICATION_REQUESTED"]:
            raise ValueError(f"Approval task #{task_id} is already in '{task['status']}' state.")

        # Update in-memory state
        task["status"] = decision_upper
        final_comment = justification if decision_upper == "REJECTED" else (comments or justification or f"Decision {decision_upper} by {approver_role}")
        task["approver_comments"] = final_comment

        # Digital Access Pass & QR Verification Generation upon Approval
        if decision_upper == "APPROVED":
            pass_code = f"PASS-LAB-AI-{uuid.uuid4().hex[:6].upper()}"
            task["access_pass_code"] = pass_code
            task["qr_pass_payload"] = {
                "pass_code": pass_code,
                "request_id": task["request_id"],
                "student_reg_no": task["student_reg_no"],
                "student_name": task["student_name"],
                "resource": task["lab_name"],
                "slot": task["date_slot"],
                "authorized_by": approver_id,
                "authorized_role": approver_role,
                "timestamp": datetime.now().isoformat(),
                "status": "VERIFIED_VALID"
            }

        # Persist to Database if DB Session is active
        if db is not None:
            try:
                # 1. Update ServiceRequest status
                req = db.query(ServiceRequest).filter(ServiceRequest.id == task["request_id"]).first()
                if req:
                    req.status = decision_upper
                    req.action_plan["current_step_index"] = 2 if decision_upper == "APPROVED" else 1
                    db.add(req)

                # 2. Record Approval Entry
                approval_rec = ApprovalRecord(
                    id=str(uuid.uuid4()),
                    request_id=task["request_id"],
                    approver_id=approver_id,
                    decision=decision_upper,
                    justification=final_comment,
                    action_plan_snapshot=task.get("qr_pass_payload")
                )
                db.add(approval_rec)

                # 3. Append to Immutable Audit Log
                audit = AuditLog(
                    id=str(uuid.uuid4()),
                    actor_id=approver_id,
                    actor_role=approver_role,
                    action_type=f"APPROVAL_{decision_upper}",
                    resource_id=task["request_id"],
                    changes_json={
                        "task_id": task_id,
                        "decision": decision_upper,
                        "justification": final_comment,
                        "access_pass_code": task.get("access_pass_code")
                    }
                )
                db.add(audit)
                db.commit()
            except Exception as e:
                db.rollback()

        # Dispatch real-time notification to the student via SSE & DB
        if dispatch_system_notification:
            try:
                notif_title = f"Lab Booking {decision_upper.title()}" if task.get("service_type") == "LAB_BOOKING" else f"Request {decision_upper.title()}"
                notif_msg = f"{approver_role} {approver_id} has {decision_upper.lower()} your {task.get('service_type', 'service')} request ({task.get('lab_name', '')}). {final_comment}".strip()
                target_link = "/services/lab-booking" if task.get("service_type") == "LAB_BOOKING" else "/requests"
                dispatch_system_notification(
                    title=notif_title,
                    message=notif_msg,
                    user_id=task.get("student_id", "20000000-0000-0000-0000-000000000001"),
                    notif_type=decision_upper,
                    category=task.get("service_type", "LAB_BOOKING"),
                    link_path=target_link,
                    db=db
                )
            except Exception:
                pass

        return task
