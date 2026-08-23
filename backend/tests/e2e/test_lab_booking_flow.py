import unittest
import sys
import os

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from services.ai.intent_classifier import classify_intent
from services.ai.agent_planner import generate_action_plan
from services.workflow.approval_engine import get_pending_approvals, approve_approval_task
from tools.lab_tools import check_lab_availability, commit_lab_booking
from services.audit.audit_logger import log_audit_event, get_audit_logs

class TestLabBookingFlowE2E(unittest.TestCase):
    """
    End-to-End E2E Integration Suite for Flagship Lab Booking Workflow:
    Intent Classification -> RAG Pre-check -> ReAct Action Plan -> HITL Approval Sign-off -> Tool Execution -> Immutable Audit Log Record.
    """

    def test_full_lab_booking_e2e_lifecycle(self):
        user_prompt = "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project."
        student_name = "Kaushal Raj Gupta"

        # Step 1: NLU Intent Classification
        intent, confidence = classify_intent(user_prompt)
        self.assertEqual(intent, "LAB_BOOKING")
        self.assertGreaterEqual(confidence, 0.90)

        # Step 2: Check Slot Availability
        availability = check_lab_availability("LAB-AI-101", "2026-08-24", "14:00", "16:00")
        self.assertTrue(availability["available"])
        self.assertGreater(availability["free_seats"], 0)

        # Step 3: ReAct Action Plan Generation
        plan = generate_action_plan(intent, {"lab_name": "Advanced AI Lab", "date": "2026-08-24", "start_time": "14:00", "end_time": "16:00"})
        self.assertEqual(plan.intent, "LAB_BOOKING")
        self.assertEqual(plan.risk_level, "HIGH")
        self.assertTrue(plan.requires_approval)
        self.assertEqual(plan.assigned_approver_role, "Lab_In_Charge")

        # Step 4: Route to Faculty for HITL Sign-off
        tasks = get_pending_approvals("Lab_In_Charge")
        self.assertGreater(len(tasks), 0)
        target_task_id = tasks[0].id

        # Step 5: Faculty Grants Sign-off
        approval_task = approve_approval_task(
            task_id=target_task_id,
            approver_id="faculty-001",
            comments="Approved for B.Tech Capstone Model Training"
        )
        self.assertEqual(approval_task.status, "APPROVED")
        self.assertIsNotNone(approval_task.access_pass_code)

        # Step 6: Tool Execution - Commit Booking
        booking_result = commit_lab_booking(
            request_id="50000000-0000-0000-0000-000000000001",
            student_name=student_name,
            lab_id="LAB-AI-101",
            date="2026-08-24",
            start_time="14:00",
            end_time="16:00",
            purpose="B.Tech Capstone Project Work"
        )
        self.assertEqual(booking_result["status"], "APPROVED")
        self.assertIn("PASS-LAB", booking_result["access_pass_code"])

        # Step 7: Verify Immutable JSON Audit Log Payload
        audit_record = log_audit_event(
            event_type="TOOL_EXECUTED",
            action_summary=f"E2E Lab Booking committed for {booking_result['access_pass_code']}",
            provenance_payload={
                "intent": intent,
                "confidence": confidence,
                "plan_risk": plan.risk_level,
                "approval_id": target_task_id,
                "booking_result": booking_result
            },
            actor_id=f"{student_name} (2023-CSE-042)",
            actor_role="Student"
        )
        self.assertIsNotNone(audit_record["audit_id"])

        # Verify audit logs complete verifier
        logs = get_audit_logs()
        self.assertGreater(len(logs), 0)

if __name__ == '__main__':
    unittest.main()
