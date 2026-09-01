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
from backend.services.ai.uncertainty import UncertaintyEngine
from backend.services.ai.conflict_detector import ConflictDetector
from backend.middleware.rate_limiter import RateLimiterMiddleware

class TestUncertaintyEngine(unittest.TestCase):

    def setUp(self):
        RateLimiterMiddleware.reset()
        self.client = TestClient(app)

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_uncertainty_refusal_below_threshold(self):
        # Simulated low-similarity citations (< 0.82)
        citations = [
            {"document_title": "SOA Academic Regulations 2025.pdf", "similarity_score": 0.45, "text": "Unrelated passage"}
        ]
        query = "What is the policy for borrowing electric skateboards?"
        result = UncertaintyEngine.evaluate_retrieval_confidence(query, citations, threshold=0.82)

        self.assertTrue(result["is_uncertainty_refusal"])
        self.assertEqual(result["confidence_score"], 0.45)
        self.assertIn("below confidence threshold", result["refusal_reason"])
        self.assertIsNotNone(result["department_contact"])
        print("\n[PASSED] Test 1: Low similarity score (0.45 < 0.82) triggered zero-hallucination uncertainty refusal.")

    def test_02_flagship_acceptance_criteria_ungrounded_question(self):
        # Flagship Acceptance Criteria:
        # Asking ungrounded questions (e.g., "What is the fee refund for 3rd semester dropout?") triggers the uncertainty refusal without fabricating answers.
        response = self.client.post(
            "/api/chat",
            json={
                "prompt": "What is the fee refund for 3rd semester dropout?",
                "user_role": "Student",
                "language": "en"
            }
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertTrue(data.get("is_uncertainty_refusal"))
        self.assertIn("Zero-Hallucination", data.get("message"))
        self.assertIsNotNone(data.get("department_contact"))
        self.assertEqual(data.get("department_contact")["email"], "academic.dean@soa.ac.in")

        print("[PASSED] Test 2: Acceptance Criteria Passed! Ungrounded query 'What is the fee refund for 3rd semester dropout?' refused to fabricate answers and returned Dean Office contact.")

    def test_03_multi_document_lex_posterior_conflict_resolution(self):
        # Contradicting regulations across 2024 and 2025 versions
        passages = [
            {
                "document_title": "SOA Regulations 2024.pdf",
                "effective_year": 2024,
                "text": "Lab booking deadline is 12:00 PM previous day."
            },
            {
                "document_title": "SOA Regulations 2025.pdf",
                "effective_year": 2025,
                "text": "Lab booking deadline is 5:00 PM previous day."
            }
        ]

        resolution = ConflictDetector.analyze_document_conflicts(passages)
        self.assertTrue(resolution["has_conflict"])
        self.assertEqual(resolution["resolved_by"], "LEX_POSTERIOR_PRECEDENCE")
        self.assertEqual(resolution["winning_policy"]["effective_year"], 2025)
        self.assertEqual(resolution["superseded_policy"]["effective_year"], 2024)

        print("[PASSED] Test 3: Multi-document conflict resolved via Lex Posterior (2025 circular superseded 2024 circular).")

    def test_04_grounded_high_confidence_query_succeeds(self):
        # Grounded query with high confidence (>= 0.82)
        response = self.client.post(
            "/api/chat",
            json={
                "prompt": "What attendance is needed for fast track lab permits?",
                "user_role": "Student",
                "language": "en"
            }
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertFalse(data.get("is_uncertainty_refusal"))
        self.assertGreaterEqual(len(data.get("citations", [])), 1)
        self.assertIn("85%", data["citations"][0]["text"])

        print("[PASSED] Test 4: Grounded query successfully answered with official citations without triggering refusal.")

if __name__ == "__main__":
    unittest.main()
