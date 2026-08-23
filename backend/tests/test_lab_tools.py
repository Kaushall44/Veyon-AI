import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.lab_tools import (
    get_lab_catalog,
    check_lab_availability,
    commit_lab_booking,
    EXISTING_BOOKINGS
)

class TestLabTools(unittest.TestCase):

    def test_get_lab_catalog(self):
        catalog = get_lab_catalog()
        self.assertEqual(len(catalog), 3)
        lab_ids = [l["lab_id"] for l in catalog]
        self.assertIn("LAB-AI-101", lab_ids)
        self.assertIn("LAB-MICRO-202", lab_ids)
        self.assertIn("LAB-CAD-103", lab_ids)
        print("\n[PASSED] Test 1: Lab Room Catalog returned 3 active lab rooms.")

    def test_check_lab_availability(self):
        avail = check_lab_availability("LAB-AI-101", "2026-08-24", "14:00", "16:00")
        self.assertTrue(avail["available"])
        self.assertEqual(avail["total_seats"], 30)
        self.assertGreater(avail["free_seats"], 0)
        print(f"[PASSED] Test 2: Slot Availability checked ({avail['free_seats']}/{avail['total_seats']} seats free).")

    def test_commit_lab_booking(self):
        booking = commit_lab_booking(
            request_id="50000000-0000-0000-0000-000000000001",
            student_name="Rahul Sharma",
            lab_id="LAB-AI-101",
            date="2026-08-25",
            start_time="10:00",
            end_time="12:00",
            purpose="B.Tech Capstone Model Evaluation",
            approver_name="Prof. A. K. Samanta"
        )

        self.assertEqual(booking["status"], "APPROVED")
        self.assertEqual(booking["lab_id"], "LAB-AI-101")
        self.assertTrue(booking["access_pass_code"].startswith("PASS-LAB-AI-"))
        self.assertIn("SOA-NEXUS-PASS", booking["qr_payload"])
        print(f"[PASSED] Test 3: Lab Booking committed successfully. Access Pass Code: {booking['access_pass_code']}")

if __name__ == "__main__":
    unittest.main()
