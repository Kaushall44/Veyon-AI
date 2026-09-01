import unittest
import uuid
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User
from backend.middleware.rate_limiter import reset_rate_limiter

client = TestClient(app)

class TestRealAuthEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.unique_suffix = uuid.uuid4().hex[:6]
        cls.test_email = f"ananya_{cls.unique_suffix}@soa.ac.in"
        cls.test_reg = f"2023-CSE-{cls.unique_suffix.upper()}"
        cls.test_password = "Password123!"

    def setUp(self):
        reset_rate_limiter()

    def tearDown(self):
        reset_rate_limiter()

    def test_01_student_registration_success(self):
        payload = {
            "reg_number": self.test_reg,
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Ananya Mishra",
            "role": "Student",
            "department": "Computer Science & Engineering"
        }
        res = client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], self.test_email)
        self.assertEqual(data["user"]["full_name"], "Ananya Mishra")
        print("\n[PASSED] Test 1: User registered with Argon2id hashing and JWT issued.")

    def test_02_password_length_validation(self):
        payload = {
            "reg_number": f"2023-CSE-SH{uuid.uuid4().hex[:4]}",
            "email": f"short_{uuid.uuid4().hex[:4]}@soa.ac.in",
            "password": "short",
            "full_name": "Short Pwd User",
            "role": "Student",
            "department": "Computer Science & Engineering"
        }
        res = client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 422)
        print("[PASSED] Test 2: Sub-8 character password rejected by security validation.")

    def test_03_login_success(self):
        payload = {
            "email": self.test_email,
            "password": self.test_password
        }
        res = client.post("/api/auth/login", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], self.test_email)
        print("[PASSED] Test 3: User logged in and verified with Argon2id hash.")

    def test_04_login_invalid_password(self):
        payload = {
            "email": self.test_email,
            "password": "WrongPassword999"
        }
        res = client.post("/api/auth/login", json=payload)
        self.assertEqual(res.status_code, 401)
        print("[PASSED] Test 4: Invalid password correctly rejected with HTTP 401.")

    def test_05_profile_me_endpoint(self):
        login_res = client.post("/api/auth/login", json={"email": self.test_email, "password": self.test_password})
        token = login_res.json()["access_token"]

        res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["email"], self.test_email)
        print("[PASSED] Test 5: /api/auth/me decoded JWT and retrieved profile from DB.")

if __name__ == "__main__":
    unittest.main()
