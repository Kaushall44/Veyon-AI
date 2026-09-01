import unittest
import uuid
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import create_access_token
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User, ServiceRequest
from backend.middleware.rate_limiter import RateLimiterMiddleware

client = TestClient(app)

class TestRequestsLifecycle(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        RateLimiterMiddleware.reset()
        init_db()
        session = SyncSessionFactory()
        cls.student = session.query(User).filter(User.role == "Student").first()
        cls.student_token = create_access_token({
            "sub": cls.student.id,
            "email": cls.student.email,
            "role": "Student"
        })
        session.close()

    def setUp(self):
        RateLimiterMiddleware.reset()

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_create_lab_booking_request(self):
        payload = {
            "request_type": "LAB_BOOKING",
            "payload": {
                "lab_id": "LAB-AI-101",
                "lab_name": "Advanced AI & GPU Lab",
                "date": "2026-08-28",
                "slot": "10:00 - 12:00",
                "purpose": "Deep Learning Thesis Experimentation"
            },
            "risk_level": "HIGH",
            "is_anonymous": False
        }
        res = client.post("/api/requests", json=payload, headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn("tracking_code", data)
        self.assertTrue(data["tracking_code"].startswith("#LB-"))
        self.assertEqual(data["request_type"], "LAB_BOOKING")
        self.assertEqual(data["status"], "WAITING_FOR_APPROVAL")
        self.__class__.created_request_id = data["id"]
        print("\n[PASSED] Test 1: Created service request with tracking code " + data["tracking_code"])

    def test_02_get_requests_list(self):
        res = client.get("/api/requests?type=LAB_BOOKING", headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        print("[PASSED] Test 2: Listed user requests filtered by type=LAB_BOOKING.")

    def test_03_get_single_request_detail(self):
        req_id = self.__class__.created_request_id
        res = client.get(f"/api/requests/{req_id}", headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], req_id)
        print("[PASSED] Test 3: Retrieved single request detail payload.")

    def test_04_valid_state_transitions(self):
        req_id = self.__class__.created_request_id
        
        # 1. WAITING_FOR_APPROVAL -> APPROVED
        res_approve = client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "APPROVED", "resolution_notes": "Prerequisites verified by Lab In-Charge."},
            headers={"Authorization": f"Bearer {self.student_token}"}
        )
        self.assertEqual(res_approve.status_code, 200)
        self.assertEqual(res_approve.json()["status"], "APPROVED")

        # 2. APPROVED -> COMPLETED
        res_complete = client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "COMPLETED", "resolution_notes": "Session ended successfully."},
            headers={"Authorization": f"Bearer {self.student_token}"}
        )
        self.assertEqual(res_complete.status_code, 200)
        self.assertEqual(res_complete.json()["status"], "COMPLETED")
        print("[PASSED] Test 4: Executed deterministic state transitions (WAITING_FOR_APPROVAL -> APPROVED -> COMPLETED).")

    def test_05_illegal_state_transition_rejected(self):
        req_id = self.__class__.created_request_id
        
        # Attempt illegal transition: COMPLETED -> SUBMITTED (COMPLETED is terminal)
        res_illegal = client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "SUBMITTED"},
            headers={"Authorization": f"Bearer {self.student_token}"}
        )
        self.assertEqual(res_illegal.status_code, 422)
        self.assertIn("Illegal state transition", res_illegal.json()["detail"])
        print("[PASSED] Test 5: Illegal state transition correctly rejected with HTTP 422 Unprocessable Entity.")

if __name__ == "__main__":
    unittest.main()
