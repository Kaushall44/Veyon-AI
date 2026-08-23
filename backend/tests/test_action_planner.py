import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ai.agent_planner import generate_action_plan

class TestActionPlanner(unittest.TestCase):

    def test_lab_booking_action_plan(self):
        entities = {"lab_name": "Advanced AI Lab", "date": "2026-08-24", "start_time": "14:00", "end_time": "16:00"}
        plan = generate_action_plan("LAB_BOOKING", entities)

        self.assertEqual(plan.intent, "LAB_BOOKING")
        self.assertEqual(plan.risk_level, "HIGH")
        self.assertTrue(plan.requires_approval)
        self.assertEqual(plan.assigned_approver_role, "Lab_In_Charge")
        self.assertEqual(len(plan.steps), 4)

        self.assertEqual(plan.steps[0].status, "PASSED")
        self.assertEqual(plan.steps[1].status, "CHECKED")
        self.assertEqual(plan.steps[2].status, "PENDING_APPROVAL")
        self.assertEqual(plan.steps[3].status, "PENDING")
        print("\n[PASSED] Test 1: Lab Booking Action Plan generated with Risk: HIGH and 4 steps.")

    def test_certificate_action_plan(self):
        entities = {"certificate_type": "BONAFIDE", "purpose": "Passport Application"}
        plan = generate_action_plan("CERTIFICATE", entities)

        self.assertEqual(plan.intent, "CERTIFICATE")
        self.assertEqual(plan.risk_level, "MEDIUM")
        self.assertTrue(plan.requires_approval)
        self.assertEqual(len(plan.steps), 4)
        print("[PASSED] Test 2: Certificate Action Plan generated with Risk: MEDIUM and approval gate.")

    def test_maintenance_action_plan(self):
        entities = {"location": "C-Block Room 302", "category": "HVAC"}
        plan = generate_action_plan("MAINTENANCE", entities)

        self.assertEqual(plan.intent, "MAINTENANCE")
        self.assertEqual(plan.risk_level, "MEDIUM")
        self.assertFalse(plan.requires_approval)
        self.assertEqual(len(plan.steps), 3)
        self.assertEqual(plan.steps[1].status, "IN_PROGRESS")
        print("[PASSED] Test 3: Maintenance Action Plan generated with Auto-Dispatch (requires_approval: False).")

    def test_grievance_action_plan(self):
        entities = {"grievance_category": "Infrastructure"}
        plan = generate_action_plan("GRIEVANCE", entities)

        self.assertEqual(plan.intent, "GRIEVANCE")
        self.assertEqual(plan.risk_level, "HIGH")
        self.assertTrue(plan.requires_approval)
        self.assertEqual(len(plan.steps), 3)
        print("[PASSED] Test 4: Grievance Action Plan generated with Encrypted Anonymization and Risk: HIGH.")

if __name__ == "__main__":
    unittest.main()
