import sys
import os
import unittest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
for p in [PROJECT_ROOT, BACKEND_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.services.ai.orchestrator import ReActOrchestrator
from backend.middleware.rate_limiter import RateLimiterMiddleware

class TestReActOrchestrator(unittest.TestCase):

    def setUp(self):
        RateLimiterMiddleware.reset()

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_lab_booking_react_plan_generation(self):
        # Flagship Acceptance Criteria: "Book AI Lab for tomorrow 2-4 PM" generates a 4-step plan categorized as HIGH risk with requires_approval: true.
        prompt = "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my machine learning capstone project."
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertEqual(result["intent"], "LAB_BOOKING")
        self.assertEqual(result["risk_level"], "HIGH")
        self.assertTrue(result["requires_approval"])
        self.assertEqual(result["assigned_approver_role"], "Lab_In_Charge")
        self.assertEqual(len(result["steps"]), 4)
        
        # Step titles verification
        step_titles = [s["title"] for s in result["steps"]]
        self.assertIn("Check Student Course Prerequisites", step_titles[0])
        self.assertIn("Verify Lab Slot Availability", step_titles[1])
        self.assertIn("Gated Human Approval from Lab In-Charge", step_titles[2])
        self.assertIn("Issue Digital QR Access Pass", step_titles[3])

        print("\n[PASSED] Test 1: Acceptance Criteria Verified: 'Book AI Lab for tomorrow 2-4 PM' generated 4-step HIGH-risk plan with requires_approval: True.")

    def test_02_certificate_react_plan_generation(self):
        prompt = "I need a Bonafide Certificate for my passport application."
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertEqual(result["intent"], "CERTIFICATE")
        self.assertEqual(result["risk_level"], "MEDIUM")
        self.assertTrue(result["requires_approval"])
        self.assertEqual(len(result["steps"]), 4)
        print("[PASSED] Test 2: Certificate prompt generated 4-step MEDIUM-risk plan with approval gating.")

    def test_03_maintenance_react_auto_dispatch_plan(self):
        prompt = "The AC in C-Block Room 302 is leaking water and making loud compressor noise."
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertEqual(result["intent"], "MAINTENANCE")
        self.assertEqual(result["risk_level"], "MEDIUM")
        self.assertFalse(result["requires_approval"])  # Auto-dispatched
        self.assertEqual(len(result["steps"]), 3)
        print("[PASSED] Test 3: Maintenance repair inquiry generated auto-dispatched plan with requires_approval: False.")

    def test_04_grievance_react_confidential_plan(self):
        prompt = "I want to file a confidential grievance regarding hostel quiet hours harassment."
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertEqual(result["intent"], "GRIEVANCE")
        self.assertEqual(result["risk_level"], "HIGH")
        self.assertTrue(result["requires_approval"])
        self.assertIn("Anonymization", result["steps"][0]["title"])
        print("[PASSED] Test 4: Grievance inquiry generated 3-step HIGH-risk encrypted plan.")

    def test_05_faq_rag_plan_generation(self):
        prompt = "What is the minimum attendance requirement to sit for end semester exams?"
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertEqual(result["intent"], "FAQ")
        self.assertEqual(result["risk_level"], "LOW")
        self.assertFalse(result["requires_approval"])
        print("[PASSED] Test 5: FAQ inquiry generated LOW-risk RAG plan.")

    def test_06_ai_invariant_enforcement(self):
        # AI INVARIANT: The LLM/orchestrator only outputs proposed plan parameters.
        prompt = "Book AI Lab for tomorrow 2-4 PM"
        result = ReActOrchestrator.decompose_and_plan(prompt, user_role="Student")

        self.assertIn("thought", result)
        self.assertIn("steps", result)
        self.assertIn("summary", result)
        # Ensure it does not contain execution side effects or database write mutations directly
        self.assertNotIn("db_mutated", result)
        self.assertNotIn("session_committed", result)
        print("[PASSED] Test 6: AI Invariant verified: Orchestrator outputs declarative plan schema without direct side effects.")

if __name__ == "__main__":
    unittest.main()
