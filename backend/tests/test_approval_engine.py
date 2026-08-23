import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.workflow.approval_engine import (
    get_pending_approvals,
    approve_approval_task,
    reject_approval_task,
    INITIAL_APPROVAL_TASKS
)

class TestApprovalEngine(unittest.TestCase):

    def setUp(self):
        INITIAL_APPROVAL_TASKS["80000000-0000-0000-0000-000000000001"].status = "PENDING"
        INITIAL_APPROVAL_TASKS["80000000-0000-0000-0000-000000000002"].status = "PENDING"

    def test_list_pending_approvals(self):
        pending = get_pending_approvals()
        self.assertGreaterEqual(len(pending), 1)
        self.assertEqual(pending[0].id, "80000000-0000-0000-0000-000000000001")
        self.assertEqual(pending[0].status, "PENDING")
        print("\n[PASSED] Test 1: Pending approval tasks listed successfully.")

    def test_approve_task(self):
        task_id = "80000000-0000-0000-0000-000000000001"
        task = approve_approval_task(task_id, approver_id="faculty-001", comments="Approved for project.")

        self.assertEqual(task.status, "APPROVED")
        self.assertIsNotNone(task.access_pass_code)
        self.assertTrue(task.access_pass_code.startswith("PASS-LAB-AI-"))
        print(f"[PASSED] Test 2: Task approved successfully. Access Pass Code: {task.access_pass_code}")

    def test_reject_task_validation(self):
        task_id = "80000000-0000-0000-0000-000000000002"
        # Test mandatory reason validation
        with self.assertRaises(ValueError):
            reject_approval_task(task_id, approver_id="faculty-001", rejection_reason="")

        # Test valid rejection
        rejected_task = reject_approval_task(
            task_id,
            approver_id="faculty-001",
            rejection_reason="Prerequisite course verification pending."
        )
        self.assertEqual(rejected_task.status, "REJECTED")
        self.assertIn("Prerequisite course verification pending", rejected_task.approver_comments)
        print("[PASSED] Test 3: Task rejected with mandatory reason enforcement.")

if __name__ == "__main__":
    unittest.main()
