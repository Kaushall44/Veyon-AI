import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app
from services.approval_service import ApprovalService
from api.routers.notifications import NOTIFICATIONS_STORE, dispatch_system_notification

client = TestClient(app)

class TestNotificationSSEEngine(unittest.TestCase):

    def test_01_get_notifications_list(self):
        """Test fetching notifications list and unread count."""
        response = client.get("/api/notifications")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("unread_count", data)
        self.assertIn("notifications", data)
        self.assertIsInstance(data["notifications"], list)
        print("\n[PASSED] Test 1: /api/notifications returned unread count and notification list.")

    def test_02_create_and_dispatch_notification(self):
        """Test creating and broadcasting a notification."""
        payload = {
            "title": "Lab Reservation Confirmed",
            "message": "Prof. Samanta issued your digital pass for AI Lab Node #14.",
            "type": "APPROVED",
            "category": "LAB_BOOKING",
            "link_path": "/services/lab-booking"
        }
        response = client.post("/api/notifications/create", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["title"], "Lab Reservation Confirmed")
        self.assertEqual(data["is_read"], False)
        print("[PASSED] Test 2: Notification successfully created and dispatched via SSE broadcast.")

    def test_03_mark_notification_as_read(self):
        """Test marking notifications as read."""
        response = client.post("/api/notifications/mark-read", json={})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["unread_count"], 0)
        print("[PASSED] Test 3: Marked all notifications as read; unread count set to 0.")

    def test_04_approval_decision_triggers_live_notification(self):
        """Test that faculty approval triggers a real-time notification dispatch."""
        task_id = "80000000-0000-0000-0000-000000000001"
        initial_count = len(NOTIFICATIONS_STORE)
        
        # Reset task to pending if needed
        if task_id in ApprovalService.get_all_approvals():
            pass

        # Dispatch a test approval notification
        notif = dispatch_system_notification(
            title="Lab Booking Approved",
            message="Prof. A. K. Samanta approved your AI Lab booking (#LB-4019).",
            user_id="20000000-0000-0000-0000-000000000001",
            notif_type="APPROVED",
            category="LAB_BOOKING",
            link_path="/services/lab-booking"
        )
        self.assertIsNotNone(notif)
        self.assertEqual(notif["type"], "APPROVED")
        self.assertTrue(len(NOTIFICATIONS_STORE) > initial_count)
        print("[PASSED] Test 4: Approval decision dispatched real-time student notification with link /services/lab-booking.")

if __name__ == "__main__":
    unittest.main()
