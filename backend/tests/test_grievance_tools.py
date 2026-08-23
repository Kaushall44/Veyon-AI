import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.grievance_tools import (
    create_grievance,
    get_sanitized_grievance_queue,
    GRIEVANCE_RECORDS
)

class TestGrievanceTools(unittest.TestCase):

    def test_anonymous_identity_masking(self):
        grievance = create_grievance(
            category="ACADEMIC",
            department="Computer Science & Engineering",
            description="Lab equipment issue in Lab 4.",
            is_anonymous=True,
            student_name="Rahul Sharma",
            student_reg_no="2023-CSE-042"
        )

        self.assertTrue(grievance["tracking_token"].startswith("GR-"))
        self.assertEqual(grievance["complainant_name"], "ANONYMOUS_COMPLAINANT")
        self.assertIn("MASKED", grievance["complainant_reg_no"])
        self.assertIsNotNone(grievance["sla_deadline"])
        print(f"\n[PASSED] Test 1: Anonymous grievance created with masked identity ({grievance['tracking_token']}).")

    def test_identified_grievance_submission(self):
        grievance = create_grievance(
            category="HOSTEL_FACILITIES",
            department="Hostel Block 4 Wing",
            description="Geyser issue.",
            is_anonymous=False,
            student_name="Rahul Sharma",
            student_reg_no="2023-CSE-042"
        )

        self.assertEqual(grievance["complainant_name"], "Rahul Sharma")
        self.assertEqual(grievance["complainant_reg_no"], "2023-CSE-042")
        print(f"[PASSED] Test 2: Identified grievance created cleanly for {grievance['complainant_name']}.")

    def test_sanitized_queue_zero_exposure(self):
        queue = get_sanitized_grievance_queue()
        for item in queue:
            if item["is_anonymous"]:
                self.assertNotEqual(item["complainant_name"], "Rahul Sharma")
                self.assertEqual(item["complainant_name"], "ANONYMOUS_COMPLAINANT")
        print(f"[PASSED] Test 3: Grievance Queue sanitized with ZERO exposure of anonymous identities.")

if __name__ == "__main__":
    unittest.main()
