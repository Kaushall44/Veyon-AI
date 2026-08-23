import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from core.config import settings

client = TestClient(app)

class TestSecurityHardening(unittest.TestCase):

    def test_secrets_management(self):
        # 1. Verify secrets read strictly from environment/settings
        self.assertIsNotNone(settings.JWT_SECRET_KEY)
        self.assertEqual(settings.RATE_LIMIT_PER_MINUTE, 60)
        self.assertIn("http://localhost:5173", settings.CORS_ORIGINS)
        print("\n[PASSED] Test 1: Secret credentials and security settings verified.")

    def test_http_401_unauthorized_rejection(self):
        # 2. Test HTTP 401 rejection on invalid token with header enforcement
        response = client.get(
            "/api/knowledge/documents",
            headers={"Authorization": "Bearer invalid-jwt-token"}
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Unauthorized", response.json()["detail"])
        print("[PASSED] Test 2: API rejected invalid JWT credentials with HTTP 401 Unauthorized.")

    def test_http_429_rate_limit_exceeded(self):
        # 3. Test HTTP 429 rate limit enforcement
        # Simulate high-frequency requests from client IP
        responses = []
        for _ in range(65):
            res = client.get("/api/health")
            responses.append(res.status_code)

        self.assertIn(429, responses)
        print("[PASSED] Test 3: API rejected rate-exceeded requests with HTTP 429 Too Many Requests.")

if __name__ == "__main__":
    unittest.main()
