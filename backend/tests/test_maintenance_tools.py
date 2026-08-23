import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.maintenance_tools import (
    classify_priority,
    create_maintenance_ticket,
    update_ticket_status,
    MAINTENANCE_TICKETS
)

class TestMaintenanceTools(unittest.TestCase):

    def test_classify_priority_matrix(self):
        p1 = classify_priority("B-Block Server Room", "Main electrical short circuit", "HVAC")
        self.assertEqual(p1, "Urgent")

        p2 = classify_priority("C-Block Room 302", "The AC in C-Block Room 302 is leaking water", "HVAC")
        self.assertEqual(p2, "Medium")

        p3 = classify_priority("Classroom A-101", "Broken chair desk", "FURNITURE")
        self.assertEqual(p3, "Low")
        print("\n[PASSED] Test 1: Priority Auto-Classification Matrix validated (Urgent / Medium / Low).")

    def test_create_maintenance_ticket(self):
        ticket = create_maintenance_ticket(
            location="C-Block Room 302",
            category="HVAC",
            issue_description="The AC in C-Block Room 302 is leaking water",
            reporter_name="Rahul Sharma"
        )
        self.assertTrue(ticket["ticket_id"].startswith("MT-"))
        self.assertEqual(ticket["priority"], "Medium")
        self.assertEqual(ticket["status"], "New")
        self.assertIn("Estates Team", ticket["assigned_team"])
        print(f"[PASSED] Test 2: Ticket created successfully ({ticket['ticket_id']} assigned to {ticket['assigned_team']}).")

    def test_update_ticket_status(self):
        # Initial ticket MT-8842 in queue
        ticket_id = MAINTENANCE_TICKETS[0]["ticket_id"]

        # Step 1: Transition New -> In_Progress
        updated1 = update_ticket_status(ticket_id, "In_Progress")
        self.assertEqual(updated1["status"], "In_Progress")

        # Step 2: Transition In_Progress -> Resolved with proof notes
        notes = "Replaced AC drain pipe gasket and verified 18°C cooling performance."
        updated2 = update_ticket_status(ticket_id, "Resolved", resolution_notes=notes)
        self.assertEqual(updated2["status"], "Resolved")
        self.assertEqual(updated2["resolution_notes"], notes)
        self.assertIsNotNone(updated2["resolved_at"])
        print(f"[PASSED] Test 3: Ticket status transitions (New -> In_Progress -> Resolved) verified with resolution notes.")

if __name__ == "__main__":
    unittest.main()
