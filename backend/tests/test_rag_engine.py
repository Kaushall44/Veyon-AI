import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.rag.confidence_evaluator import evaluate_rag_response
from services.rag.retrieval import search_hybrid_knowledge_base

class TestRAGEngine(unittest.TestCase):

    def test_rag_10_policy_queries(self):
        test_queries = [
            ("What is the minimum attendance requirement?", True, "SOA Academic Regulations 2025.pdf"),
            ("What are the AI lab booking prerequisites?", True, "SOA Lab Guidelines 2025.pdf"),
            ("What time do weekend venue bookings terminate?", True, "SOA Hostel Rules 2025.pdf"),
            ("What is the B.Tech degree mandatory credit count?", True, "SOA Academic Regulations 2025.pdf"),
            ("What is the mess refund for 45-day summer break?", False, None),
            ("What is the exact fine for losing a cafeteria spoon?", False, None),
            ("How many hours max can I book the AI Lab?", True, "SOA Lab Guidelines 2025.pdf"),
            ("What is the grading scale for Grade O?", True, "SOA Academic Regulations 2025.pdf"),
            ("What time do hostel entry gates close?", True, "SOA Hostel Rules 2025.pdf"),
            ("What is the fee for flight ticket booking?", False, None),
        ]

        print("\n=== Running Phase 6 RAG Retrieval & Confidence Test Suite (10 Queries) ===")
        for idx, (query, expected_grounded, expected_doc) in enumerate(test_queries, start=1):
            eval_res = evaluate_rag_response(query, threshold=0.70)
            status_str = "GROUNDED" if eval_res["is_grounded"] else "UNCERTAINTY_REFUSAL"
            print(f"Test {idx:02d}: Query: '{query}' -> Status: {status_str} (Score: {eval_res['confidence_score']:.2f})")
            
            self.assertEqual(eval_res["is_grounded"], expected_grounded)
            if expected_grounded:
                self.assertGreaterEqual(eval_res["confidence_score"], 0.70)
                self.assertTrue(len(eval_res["citations"]) > 0)
                self.assertEqual(eval_res["citations"][0]["document_title"], expected_doc)
            else:
                self.assertTrue(eval_res["uncertainty_refusal"])

    def test_acceptance_criteria_attendance_query(self):
        """Acceptance Criteria: 'What is the minimum attendance requirement?' returns grounded answer citing Page 14."""
        query = "What is the minimum attendance requirement to sit for exams?"
        eval_res = evaluate_rag_response(query, threshold=0.70)

        self.assertTrue(eval_res["is_grounded"])
        self.assertGreaterEqual(eval_res["confidence_score"], 0.70)
        self.assertEqual(eval_res["citations"][0]["document_title"], "SOA Academic Regulations 2025.pdf")
        self.assertEqual(eval_res["citations"][0]["page"], 14)
        print("\n[PASSED] Acceptance Criteria Passed: Attendance Query grounded in Page 14 of SOA Academic Regulations 2025.pdf")

    def test_acceptance_criteria_ungrounded_refusal(self):
        """Acceptance Criteria: Ungrounded query triggers Uncertainty Refusal."""
        query = "What is the mess refund for 45-day summer break?"
        eval_res = evaluate_rag_response(query, threshold=0.70)

        self.assertFalse(eval_res["is_grounded"])
        self.assertTrue(eval_res["uncertainty_refusal"])
        self.assertIn("unable to verify", eval_res["answer"].lower())
        print("[PASSED] Acceptance Criteria Passed: Ungrounded query triggered Uncertainty Refusal without fabricating rules")

if __name__ == "__main__":
    unittest.main()
