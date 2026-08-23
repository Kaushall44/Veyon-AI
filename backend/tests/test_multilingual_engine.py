import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ai.multilingual_engine import (
    detect_language,
    translate_to_canonical_english,
    translate_response_to_native
)
from services.ai.intent_classifier import classify_intent

class TestMultilingualEngine(unittest.TestCase):

    def test_language_detection(self):
        self.assertEqual(detect_language("ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍ କାମ କରୁନାହିଁ"), "OR")
        self.assertEqual(detect_language("हमारे हॉस्टल रूम B-204 में पंखा काम नहीं कर रहा है"), "HI")
        self.assertEqual(detect_language("The fan in my room is not working"), "EN")
        print("\n[PASSED] Test 1: Language detection validated for Odia (OR), Hindi (HI), and English (EN).")

    def test_acceptance_criteria_odia_prompt_to_intent(self):
        odia_prompt = "ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍ କାମ କରୁନାହିଁ"
        
        # 1. Translate to Canonical English
        trans = translate_to_canonical_english(odia_prompt)
        self.assertEqual(trans["source_language"], "OR")
        self.assertEqual(trans["canonical_text"], "The fan in my hostel room B-204 is not working.")

        # 2. Intent Classification on Canonical English
        intent, confidence = classify_intent(trans["canonical_text"])
        self.assertEqual(intent, "MAINTENANCE")

        # 3. Translate Response back to Native Odia script
        native_response = translate_response_to_native(
            "Maintenance request registered successfully.",
            intent,
            "OR"
        )
        self.assertIn("ରକ୍ଷଣାବେକ୍ଷଣ", native_response)
        print(f"[PASSED] Test 2: Acceptance Criteria Passed! Odia prompt extracted MAINTENANCE intent and returned Odia confirmation.")

    def test_hindi_prompt_pipeline(self):
        hindi_prompt = "मैं कल दोपहर 2 से 4 बजे तक एआई लैब बुक करना चाहता हूं"
        trans = translate_to_canonical_english(hindi_prompt)
        self.assertEqual(trans["source_language"], "HI")

        intent, confidence = classify_intent(trans["canonical_text"])
        self.assertEqual(intent, "LAB_BOOKING")

        native_response = translate_response_to_native(
            "Lab booking request received.",
            intent,
            "HI"
        )
        self.assertIn("अनुरोध", native_response)
        print(f"[PASSED] Test 3: Hindi prompt extracted LAB_BOOKING intent and returned Hindi response.")

if __name__ == "__main__":
    unittest.main()
