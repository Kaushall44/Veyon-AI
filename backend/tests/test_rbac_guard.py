import unittest
import uuid
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import create_access_token
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User
from backend.middleware.rate_limiter import RateLimiterMiddleware

client = TestClient(app)

class TestRBACGuardAndProfiles(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        RateLimiterMiddleware.reset()
        init_db()
        session = SyncSessionFactory()
        cls.student = session.query(User).filter(User.role == "Student").first()
        cls.faculty = session.query(User).filter(User.role == "Faculty").first()
        cls.admin = session.query(User).filter(User.role == "Admin").first()

        cls.student_token = create_access_token({
            "sub": cls.student.id,
            "email": cls.student.email,
            "role": cls.student.role
        })
        cls.faculty_token = create_access_token({
            "sub": cls.faculty.id,
            "email": cls.faculty.email,
            "role": cls.faculty.role
        })
        cls.admin_token = create_access_token({
            "sub": cls.admin.id,
            "email": cls.admin.email,
            "role": cls.admin.role
        })
        session.close()

    def setUp(self):
        RateLimiterMiddleware.reset()

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_student_forbidden_on_approvals(self):
        # Students attempting to list faculty approval tasks must get HTTP 403
        res = client.get("/api/approvals/pending", headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res.status_code, 403)
        self.assertIn("Access forbidden", res.json()["detail"])
        print("\n[PASSED] Test 1: Student token correctly rejected with HTTP 403 on /api/approvals/pending.")

    def test_02_student_forbidden_on_audit_logs(self):
        # Students attempting to view immutable audit logs must get HTTP 403
        res = client.get("/api/audit/logs", headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res.status_code, 403)
        self.assertIn("Access forbidden", res.json()["detail"])
        print("[PASSED] Test 2: Student token correctly rejected with HTTP 403 on /api/audit/logs.")

    def test_03_faculty_allowed_on_approvals(self):
        # Faculty role must be granted access
        res = client.get("/api/approvals/pending", headers={"Authorization": f"Bearer {self.faculty_token}"})
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)
        print("[PASSED] Test 3: Faculty token successfully authorized on /api/approvals/pending.")

    def test_04_admin_allowed_on_audit_logs(self):
        # Admin role must be granted access
        res = client.get("/api/audit/logs", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json(), list)
        print("[PASSED] Test 4: Admin token successfully authorized on /api/audit/logs.")

    def test_05_user_profile_management(self):
        # 1. Get current profile
        res_get = client.get("/api/users/profile", headers={"Authorization": f"Bearer {self.student_token}"})
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(res_get.json()["email"], self.student.email)

        # 2. Update profile
        new_name = f"Student {uuid.uuid4().hex[:4]}"
        res_put = client.put(
            "/api/users/profile",
            json={"full_name": new_name},
            headers={"Authorization": f"Bearer {self.student_token}"}
        )
        self.assertEqual(res_put.status_code, 200)
        self.assertEqual(res_put.json()["user"]["full_name"], new_name)
        print("[PASSED] Test 5: User Profile GET & PUT endpoints successfully read and updated database.")

if __name__ == "__main__":
    unittest.main()
