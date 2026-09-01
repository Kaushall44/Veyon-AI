import sys
import os
import unittest
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
for p in [PROJECT_ROOT, BACKEND_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.main import app
from backend.core.security import create_access_token
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User
from backend.middleware.rate_limiter import RateLimiterMiddleware
from backend.services.approval_service import ApprovalService, IN_MEMORY_APPROVAL_TASKS

class TestApprovalService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        RateLimiterMiddleware.reset()
        init_db()
        session = SyncSessionFactory()
        cls.faculty_user = session.query(User).filter(User.role.in_(["Faculty", "Lab_In_Charge"])).first()
        cls.student_user = session.query(User).filter(User.role == "Student").first()

        cls.faculty_token = create_access_token(
            data={"sub": cls.faculty_user.id, "email": cls.faculty_user.email, "role": cls.faculty_user.role}
        )
        cls.faculty_headers = {"Authorization": f"Bearer {cls.faculty_token}"}

        cls.student_token = create_access_token(
            data={"sub": cls.student_user.id, "email": cls.student_user.email, "role": cls.student_user.role}
        )
        cls.student_headers = {"Authorization": f"Bearer {cls.student_token}"}
        session.close()

    def setUp(self):
        RateLimiterMiddleware.reset()
        self.client = TestClient(app)

        # Reset task state for repeatable tests
        IN_MEMORY_APPROVAL_TASKS["80000000-0000-0000-0000-000000000001"]["status"] = "PENDING"
        IN_MEMORY_APPROVAL_TASKS["80000000-0000-0000-0000-000000000001"]["access_pass_code"] = None
        IN_MEMORY_APPROVAL_TASKS["80000000-0000-0000-0000-000000000001"]["qr_pass_payload"] = None

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_get_pending_approvals(self):
        response = self.client.get("/api/approvals/pending", headers=self.faculty_headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data) > 0)
        self.assertEqual(data[0]["status"], "PENDING")
        print("\n[PASSED] Test 1: Retrieved pending approval tasks queue successfully.")

    def test_02_acceptance_criteria_approve_lab_booking_with_qr_pass(self):
        """
        Acceptance Criteria:
        Lab in-charge signing off on a lab booking updates service_requests.status to APPROVED
        and generates a verifiable QR access pass.
        """
        task_id = "80000000-0000-0000-0000-000000000001"
        response = self.client.post(
            f"/api/approvals/{task_id}/decide",
            headers=self.faculty_headers,
            json={
                "decision": "APPROVED",
                "comments": "Approved after checking CS301 prerequisites and lab GPU workstation availability."
            }
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Check status is APPROVED
        self.assertEqual(data["status"], "APPROVED")

        # Check verifiable access pass code is generated
        self.assertIsNotNone(data.get("access_pass_code"))
        self.assertTrue(data["access_pass_code"].startswith("PASS-LAB-AI-"))

        # Check verifiable QR pass payload structure
        qr_payload = data.get("qr_pass_payload")
        self.assertIsNotNone(qr_payload)
        self.assertEqual(qr_payload["pass_code"], data["access_pass_code"])
        self.assertEqual(qr_payload["student_reg_no"], "2023-CSE-042")
        self.assertEqual(qr_payload["status"], "VERIFIED_VALID")

        print(f"[PASSED] Test 2: Acceptance Criteria Passed! Lab booking signed off to APPROVED. Issued QR Pass: {data['access_pass_code']}")

    def test_03_rejection_requires_mandatory_justification(self):
        task_id = "80000000-0000-0000-0000-000000000001"
        IN_MEMORY_APPROVAL_TASKS[task_id]["status"] = "PENDING"

        # Rejection without justification must fail
        response = self.client.post(
            f"/api/approvals/{task_id}/decide",
            headers=self.faculty_headers,
            json={
                "decision": "REJECTED",
                "justification": ""
            }
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Mandatory justification is required", response.json()["detail"])
        print("[PASSED] Test 3: Rejection without mandatory justification correctly rejected with HTTP 400.")

    def test_04_clarification_requested_decision(self):
        task_id = "80000000-0000-0000-0000-000000000001"
        IN_MEMORY_APPROVAL_TASKS[task_id]["status"] = "PENDING"

        response = self.client.post(
            f"/api/approvals/{task_id}/decide",
            headers=self.faculty_headers,
            json={
                "decision": "CLARIFICATION_REQUESTED",
                "comments": "Please attach faculty recommendation letter for weekend lab access."
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "CLARIFICATION_REQUESTED")
        self.assertIn("faculty recommendation letter", data["approver_comments"])
        print("[PASSED] Test 4: Decision 'CLARIFICATION_REQUESTED' successfully recorded.")

    def test_05_student_rbac_forbidden_from_approving(self):
        task_id = "80000000-0000-0000-0000-000000000001"
        response = self.client.post(
            f"/api/approvals/{task_id}/decide",
            headers=self.student_headers,
            json={"decision": "APPROVED"}
        )
        self.assertEqual(response.status_code, 403)
        print("[PASSED] Test 5: Student account strictly rejected with HTTP 403 Forbidden on approval actions.")

if __name__ == "__main__":
    unittest.main()
