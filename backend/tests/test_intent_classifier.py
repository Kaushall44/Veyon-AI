import unittest
from schemas.chat_schemas import IntentResult, ExtractedEntities
from services.ai.intent_classifier import classify_intent, process_nlu_pipeline

class TestIntentClassifier(unittest.TestCase):

    def test_20_nlu_sample_prompts(self):
        """
        Runs full intent classification test suite across 20 synthetic user prompts 
        spanning all service categories to ensure zero regressions.
        """
        test_cases = [
            # LAB_BOOKING
            ("I want to book the AI Lab tomorrow from 2 PM to 4 PM.", "LAB_BOOKING"),
            ("Reserve the Microelectronics Lab for next Monday 10:00 to 12:00.", "LAB_BOOKING"),
            ("Book CAD Kiosk for 3 hours.", "LAB_BOOKING"),
            ("Need to reserve AI Lab slot tomorrow.", "LAB_BOOKING"),

            # CERTIFICATE
            ("I need a Bonafide Certificate for my passport application.", "CERTIFICATE"),
            ("Issue conduct certificate for bank loan.", "CERTIFICATE"),
            ("Request for academic transcript certificate.", "CERTIFICATE"),
            ("Apply for bonafide student cert.", "CERTIFICATE"),

            # MAINTENANCE
            ("The AC in C-Block Room 302 is leaking water and making noise.", "MAINTENANCE"),
            ("Fan not working in hostel room B-204.", "MAINTENANCE"),
            ("Light socket is broken in Lab 3.", "MAINTENANCE"),
            ("Plumbing issue water pipe leaking in hostel.", "MAINTENANCE"),

            # GRIEVANCE
            ("I want to submit a formal grievance regarding mess hygiene.", "GRIEVANCE"),
            ("File a confidential complaint about harassment during hostel hours.", "GRIEVANCE"),
            ("Submit formal ragging complaint.", "GRIEVANCE"),

            # FAQ
            ("What is the minimum attendance requirement to sit for exams?", "FAQ"),
            ("What are the hostel night curfew rules?", "FAQ"),
            ("What is the exam fee refund regulation?", "FAQ"),

            # GREETING / UNKNOWN
            ("Hello good morning.", "GREETING"),
            ("Tell me a random joke.", "UNKNOWN")
        ]

        print("\n=== Running Phase 5 NLU Intent Classification Suite (20 Prompts) ===")
        for idx, (prompt, expected_intent) in enumerate(test_cases, start=1):
            result = process_nlu_pipeline(prompt)
            print(f"Test {idx:02d}: Prompt: '{prompt[:45]}...' -> Intent: {result.detected_intent} (Conf: {result.intent_confidence})")
            self.assertEqual(result.detected_intent, expected_intent)
            self.assertGreaterEqual(result.intent_confidence, 0.60)

    def test_flagship_acceptance_criteria(self):
        """Verifies specific Acceptance Criteria for Flagship Lab Booking Prompt."""
        prompt = "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project."
        result = process_nlu_pipeline(prompt)
        
        self.assertEqual(result.detected_intent, "LAB_BOOKING")
        self.assertGreaterEqual(result.intent_confidence, 0.95)
        self.assertEqual(result.extracted_entities.lab_id, "LAB-AI-101")
        self.assertEqual(result.extracted_entities.start_time, "14:00")
        self.assertEqual(result.extracted_entities.end_time, "16:00")
        print("\n[PASSED] Flagship Acceptance Criteria Passed: LAB_BOOKING, LAB-AI-101, 14:00-16:00, Conf > 0.95")

if __name__ == "__main__":
    unittest.main()
