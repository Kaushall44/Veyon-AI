import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db
from backend.core.security import create_access_token

class TestMarketplaceAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        
        # Setup student test token
        cls.student_token = create_access_token({
            "sub": "u1000000-0000-0000-0000-000000000001",
            "role": "Student",
            "reg_number": "2023-CSE-042"
        })

    def test_01_list_marketplace_items(self):
        """Test listing marketplace items with categories and price sort."""
        response = self.client.get("/api/marketplace/items?category=ALL&sort_by=newest")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("items", data)
        self.assertIn("total", data)
        print("\n[PASSED] Test 1: Listed campus marketplace items endpoint successfully.")

    def test_02_create_marketplace_listing(self):
        """Test creating a new second-hand listing with verified seller reg-no."""
        headers = {"Authorization": f"Bearer {self.student_token}"}
        payload = {
            "title": "TI-84 Plus CE Graphing Calculator (Color Screen)",
            "description": "Used for Numerical Methods lab. Comes with USB charging cable and slide case.",
            "price": 2200.0,
            "category": "ELECTRONICS",
            "condition": "LIKE_NEW",
            "images": ["https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&q=80"],
            "seller_phone": "+919876543210",
            "seller_location": "Hostel 4, Room 210"
        }
        response = self.client.post("/api/marketplace/items", json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["title"], payload["title"])
        self.assertEqual(data["seller_reg_no"], "2023-CSE-042")
        self.assertEqual(data["status"], "ACTIVE")
        self.__class__.created_item_id = data["id"]
        print("[PASSED] Test 2: Created new marketplace listing with verified seller credentials.")

    def test_03_get_item_detail_and_contact_links(self):
        """Test getting item detail, trust score, and pre-filled contact links."""
        item_id = getattr(self.__class__, "created_item_id", None)
        self.assertIsNotNone(item_id)

        response = self.client.get(f"/api/marketplace/items/{item_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], item_id)
        self.assertIn("seller_profile", data)
        self.assertTrue(data["seller_profile"]["is_verified"])
        self.assertIn("contact_links", data)
        self.assertIn("wa.me", data["contact_links"]["whatsapp"])
        print("[PASSED] Test 3: Verified seller trust profile and pre-filled WhatsApp/Email contact links.")

    def test_04_update_item_status_to_sold(self):
        """Test seller toggling status to SOLD."""
        item_id = getattr(self.__class__, "created_item_id", None)
        headers = {"Authorization": f"Bearer {self.student_token}"}
        
        response = self.client.put(
            f"/api/marketplace/items/{item_id}/status",
            json={"status": "SOLD"},
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SOLD")
        print("[PASSED] Test 4: Seller marked listing status as SOLD.")

    def test_05_report_item(self):
        """Test reporting an item listing for community safety moderation."""
        item_id = getattr(self.__class__, "created_item_id", None)
        headers = {"Authorization": f"Bearer {self.student_token}"}
        
        response = self.client.post(
            f"/api/marketplace/items/{item_id}/report",
            json={"reason": "Suspected duplicate listing or incorrect item price."},
            headers=headers
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["status"], "success")
        print("[PASSED] Test 5: Submitted campus safety moderation report.")

if __name__ == "__main__":
    unittest.main()
