import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.middleware.rate_limiter import RateLimiterMiddleware

client = TestClient(app)

class TestAPIGatewayHardening(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        RateLimiterMiddleware.reset()

    @classmethod
    def tearDownClass(cls):
        RateLimiterMiddleware.reset()

    def setUp(self):
        RateLimiterMiddleware.reset()

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_correlation_id_generated_and_propagated(self):
        # 1. Server generates new correlation ID if not provided
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertIn("X-Correlation-ID", res.headers)
        self.assertIn("X-Response-Time-Ms", res.headers)
        generated_id = res.headers["X-Correlation-ID"]
        self.assertTrue(generated_id.startswith("req-"))

        # 2. Server propagates custom correlation ID if provided
        custom_id = "req-custom-audit-trace-12345"
        res_custom = client.get("/api/health", headers={"X-Correlation-ID": custom_id})
        self.assertEqual(res_custom.headers["X-Correlation-ID"], custom_id)
        print("\n[PASSED] Test 1: X-Correlation-ID and latency headers generated and propagated.")

    def test_02_structured_validation_error_envelope(self):
        # Trigger validation error by sending invalid payload to /api/auth/register
        invalid_payload = {
            "email": "not-an-email",
            "password": "123"
        }
        res = client.post("/api/auth/register", json=invalid_payload)
        self.assertEqual(res.status_code, 422)
        data = res.json()
        
        self.assertEqual(data["status"], "error")
        self.assertEqual(data["code"], "VALIDATION_FAILED")
        self.assertIn("correlation_id", data)
        self.assertIn("details", data)
        self.assertIsInstance(data["details"], list)
        print("[PASSED] Test 2: Validation errors wrapped in structured error envelope.")

    def test_03_structured_http_exception_envelope(self):
        # Trigger 401 error
        res = client.get("/api/requests/non-existent-id-9999", headers={"Authorization": "Bearer invalid-jwt-signature"})
        self.assertEqual(res.status_code, 401)
        data = res.json()
        self.assertEqual(data["status"], "error")
        self.assertIn("correlation_id", data)
        self.assertIn("code", data)
        print("[PASSED] Test 3: HTTP exceptions returned in standardized JSON envelope.")

    def test_04_rate_limiting_throttle_envelope(self):
        # Send rapid requests with rate test header to trigger throttle
        triggered_429 = False
        for _ in range(65):
            res = client.get("/api/health", headers={"X-Test-Rate-Limit": "true"})
            if res.status_code == 429:
                triggered_429 = True
                data = res.json()
                self.assertEqual(data["status"], "error")
                self.assertEqual(data["code"], "RATE_LIMIT_EXCEEDED")
                self.assertIn("correlation_id", data)
                self.assertIn("Retry-After", res.headers)
                break

        self.assertTrue(triggered_429, "Rate limiter did not trigger HTTP 429 after 65 rapid requests.")
        RateLimiterMiddleware.reset()
        print("[PASSED] Test 4: Rate limiter successfully throttled burst traffic with HTTP 429.")

if __name__ == "__main__":
    unittest.main()
