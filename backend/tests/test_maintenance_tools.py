import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.maintenance_tools import (
    classify_priority,
    create_maintenance_ticket,
    update_ticket_status,
    MAINTENANCE_TICKETS,
    MAINTENANCE_TEAMS
)

class TestMaintenanceTools(unittest.TestCase):

    def test_classify_priority_matrix(self):
        # 1. Server Room AC failure -> URGENT
        p1 = classify_priority("B-Block Server Room", "Main server room AC cooling failure", "HVAC")
        self.assertEqual(p1["priority"], "URGENT")
        self.assertEqual(p1["sla_hours"], 1)

        # 2. Exam Hall Projector -> HIGH
        p2 = classify_priority("Exam Hall 3", "Projector dead before semester exam", "IT_INFRA")
        self.assertEqual(p2["priority"], "HIGH")
        self.assertEqual(p2["sla_hours"], 4)

        # 3. Classroom AC leaking / fan -> MEDIUM
        p3 = classify_priority("C-Block Room 302", "The AC in C-Block Room 302 is leaking water", "HVAC")
        self.assertEqual(p3["priority"], "MEDIUM")
        self.assertEqual(p3["sla_hours"], 8)

        # 4. Broken chair desk -> LOW
        p4 = classify_priority("Classroom A-101", "Broken chair desk armrest", "FURNITURE")
        self.assertEqual(p4["priority"], "LOW")
        self.assertEqual(p4["sla_hours"], 24)

        print("\n[PASSED] Test 1: Priority Auto-Classification Matrix validated (URGENT / HIGH / MEDIUM / LOW).")

    def test_create_maintenance_ticket_technician_dispatch(self):
        ticket = create_maintenance_ticket(
            location="B-Block Server Room",
            category="HVAC",
            issue_description="Server room AC unit #2 compressor tripped",
            reporter_name="System Monitor"
        )
        self.assertTrue(ticket["ticket_id"].startswith("MT-"))
        self.assertEqual(ticket["priority"], "URGENT")
        self.assertEqual(ticket["status"], "NEW")
        self.assertIn("Rajesh Kumar", ticket["assigned_technician"])
        self.assertIn("URGENT DISPATCH", ticket["assigned_technician"])
        print(f"[PASSED] Test 2: Ticket created & dispatched to on-duty lead ({ticket['assigned_technician']}).")

    def test_update_ticket_status_with_proof_notes(self):
        ticket_id = MAINTENANCE_TICKETS[0]["ticket_id"]

        # Step 1: Transition NEW -> IN_PROGRESS
        updated1 = update_ticket_status(ticket_id, "IN_PROGRESS")
        self.assertEqual(updated1["status"], "IN_PROGRESS")

        # Step 2: Transition IN_PROGRESS -> RESOLVED with proof notes
        notes = "Replaced AC drain pipe gasket and cleared condensation line. Verified 18°C cooling performance."
        updated2 = update_ticket_status(ticket_id, "RESOLVED", resolution_notes=notes)
        self.assertEqual(updated2["status"], "RESOLVED")
        self.assertEqual(updated2["resolution_notes"], notes)
        self.assertIsNotNone(updated2["resolved_at"])
        print(f"[PASSED] Test 3: Status transitions (NEW -> IN_PROGRESS -> RESOLVED) verified with proof notes.")

if __name__ == "__main__":
    unittest.main()
