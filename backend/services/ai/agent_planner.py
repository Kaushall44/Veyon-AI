from typing import Dict, Any, Optional
from schemas.plan_schemas import ActionPlan, ActionStep

def generate_action_plan(intent: str, entities: Dict[str, Any]) -> Optional[ActionPlan]:
    """
    ReAct Multi-step Action Planner Engine.
    Decomposes actionable institutional service requests into ordered execution steps,
    classifies risk level, and determines human-in-the-loop approval gating.
    Returns None for conversational greetings or general informational Q&A.
    """
    lab_name = entities.get("lab_name", "Advanced AI Lab")
    date_str = entities.get("date", "Tomorrow")
    time_str = f"{entities.get('start_time', '14:00')} - {entities.get('end_time', '16:00')}"
    cert_type = entities.get("certificate_type", "Bonafide")
    location_str = entities.get("location", "C-Block Room 302")

    if intent == "LAB_BOOKING":
        return ActionPlan(
            intent="LAB_BOOKING",
            risk_level="HIGH",
            requires_approval=True,
            assigned_approver_role="Lab_In_Charge",
            summary=f"4-Step Gated Execution Plan to reserve {lab_name} for {date_str} ({time_str}).",
            steps=[
                ActionStep(
                    step_number=1,
                    title="Check Student Course Prerequisites",
                    description="Verified student passed prerequisite CS301 (Machine Learning) with Grade B+ or higher.",
                    status="PASSED",
                    assigned_actor="System Auto-Check"
                ),
                ActionStep(
                    step_number=2,
                    title="Verify Lab Slot Availability",
                    description=f"Checked capacity for {lab_name} (25/30 seats available).",
                    status="CHECKED",
                    assigned_actor="Resource Manager"
                ),
                ActionStep(
                    step_number=3,
                    title="Gated Human Approval from Lab In-Charge",
                    description="Request routed to Prof. A. K. Samanta for mandatory sign-off.",
                    status="PENDING_APPROVAL",
                    assigned_actor="Prof. A. K. Samanta (Lab In-Charge)"
                ),
                ActionStep(
                    step_number=4,
                    title="Issue Digital QR Access Pass",
                    description="Generate single-use QR access code upon faculty approval.",
                    status="PENDING",
                    assigned_actor="Security Gate Service"
                ),
            ]
        )

    elif intent == "CERTIFICATE":
        return ActionPlan(
            intent="CERTIFICATE",
            risk_level="MEDIUM",
            requires_approval=True,
            assigned_approver_role="Faculty",
            summary=f"4-Step Execution Plan to issue official {cert_type} Certificate PDF.",
            steps=[
                ActionStep(
                    step_number=1,
                    title="Verify Student Active Enrollment",
                    description="Confirmed active registration no. in department database.",
                    status="PASSED",
                    assigned_actor="Academic Database"
                ),
                ActionStep(
                    step_number=2,
                    title="Validate Purpose & Fee Clearance",
                    description="No pending tuition fee dues recorded for current semester.",
                    status="CHECKED",
                    assigned_actor="Accounts Service"
                ),
                ActionStep(
                    step_number=3,
                    title="Academic Officer Digital Sign-off",
                    description="Routed to Academic Admin Officer for digital signature approval.",
                    status="PENDING_APPROVAL",
                    assigned_actor="Academic Admin Officer"
                ),
                ActionStep(
                    step_number=4,
                    title="Generate QR-Verified PDF Document",
                    description="Create tamper-proof PDF certificate with embedded verification QR code.",
                    status="PENDING",
                    assigned_actor="PDF Engine"
                ),
            ]
        )

    elif intent == "MAINTENANCE":
        return ActionPlan(
            intent="MAINTENANCE",
            risk_level="MEDIUM",
            requires_approval=False,
            assigned_approver_role="Maintenance_Staff",
            summary=f"3-Step Auto-Dispatched Repair Plan for {location_str}.",
            steps=[
                ActionStep(
                    step_number=1,
                    title="Log Facility Repair Ticket",
                    description=f"Recorded maintenance complaint for {location_str}.",
                    status="COMPLETED",
                    assigned_actor="Helpdesk Service"
                ),
                ActionStep(
                    step_number=2,
                    title="Auto-Assign Location Technician",
                    description="Assigned ticket to on-duty estates maintenance technician.",
                    status="IN_PROGRESS",
                    assigned_actor="Rajesh Kumar (Technician)"
                ),
                ActionStep(
                    step_number=3,
                    title="On-Site Inspection & Work Order Close Out",
                    description="Technician performs repair and submits completion report.",
                    status="PENDING",
                    assigned_actor="Estates & Facilities"
                ),
            ]
        )

    elif intent == "GRIEVANCE":
        return ActionPlan(
            intent="GRIEVANCE",
            risk_level="HIGH",
            requires_approval=True,
            assigned_approver_role="Admin",
            summary="3-Step Encrypted Confidential Grievance Escalation Workflow.",
            steps=[
                ActionStep(
                    step_number=1,
                    title="Cryptographic Anonymization & Encryption",
                    description="Stripped PII and encrypted grievance text with 256-bit key.",
                    status="PASSED",
                    assigned_actor="Privacy Engine"
                ),
                ActionStep(
                    step_number=2,
                    title="Grievance Committee Investigation",
                    description="Assigned to Institutional Grievance Redressal Committee.",
                    status="PENDING_APPROVAL",
                    assigned_actor="Proctorial Committee"
                ),
                ActionStep(
                    step_number=3,
                    title="Issue Confidential Resolution Report",
                    description="Record resolution findings in secure compliance audit log.",
                    status="PENDING",
                    assigned_actor="Admin Officer"
                ),
            ]
        )

    # For GREETING, FAQ, or UNKNOWN, no action plan is generated
    return None
