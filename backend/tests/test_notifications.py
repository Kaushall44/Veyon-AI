import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.routers.notifications import (
    NOTIFICATIONS_STORE,
    get_notifications,
    create_notification,
    mark_notifications_read,
    CreateNotifPayload,
    MarkReadPayload
)

class TestNotificationsService(unittest.TestCase):

    def test_notification_lifecycle(self):
        # 1. Fetch initial notifications
        initial_store_len = len(NOTIFICATIONS_STORE)
        unread_initial = sum(1 for n in NOTIFICATIONS_STORE if not n["is_read"])
        
        # 2. Dispatch a new approval notification
        payload = CreateNotifPayload(
            title="Lab Slot Confirmed",
            message="Your AI Lab slot has been approved by Prof. Samanta.",
            type="APPROVED",
            target_url="/services/lab-booking"
        )
        import asyncio
        new_notif = asyncio.run(create_notification(payload))
        
        self.assertEqual(new_notif["title"], "Lab Slot Confirmed")
        self.assertFalse(new_notif["is_read"])
        self.assertEqual(len(NOTIFICATIONS_STORE), initial_store_len + 1)
        print("\n[PASSED] Test 1: Real-time notification dispatched and stored in queue.")

        # 3. Mark all as read
        mark_res = asyncio.run(mark_notifications_read(MarkReadPayload()))
        self.assertEqual(mark_res["unread_count"], 0)
        print("[PASSED] Test 2: Mark-all-read endpoint updated unread count to 0.")

if __name__ == "__main__":
    unittest.main()
