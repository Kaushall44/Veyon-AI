import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import get_sync_db, init_db
from backend.database.models import User, CommunityPost, CommunityComment, MarketplaceItem

class TestCommunityMarketplace(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        
        db = next(get_sync_db())
        cls.student = db.query(User).filter(User.role == "Student").first()
        cls.auth_headers = {"Authorization": f"Bearer jwt_session_{cls.student.id}"}

    def test_01_community_lifecycle(self):
        """Test creating post, upvoting, adding comments, and accepting answer."""
        # 1. Create Post (starts with 1 initial author upvote)
        post_data = {
            "title": "Comprehensive Guide to NVIDIA CUDA Lab",
            "content": "Here is how to set up CUDA 12.2 on university GPU nodes...",
            "category": "RESEARCH",
            "tags": ["CUDA", "PyTorchLab", "GPU"]
        }
        res = self.client.post("/api/community/posts", json=post_data, headers=self.auth_headers)
        self.assertEqual(res.status_code, 201)
        post = res.json()
        post_id = post["id"]
        self.assertEqual(post["title"], post_data["title"])
        self.assertEqual(post["category"], "RESEARCH")
        self.assertEqual(post["upvotes"], 1)
        self.assertIn("Student", post["author_badge"])

        # 2. Vote toggle on Post (clicking upvote again toggles off to 0)
        vote_res = self.client.post(f"/api/community/posts/{post_id}/vote", json={"vote": 1}, headers=self.auth_headers)
        self.assertEqual(vote_res.status_code, 200)
        self.assertEqual(vote_res.json()["upvotes"], 0)

        # Re-upvote to 1
        vote_res2 = self.client.post(f"/api/community/posts/{post_id}/vote", json={"vote": 1}, headers=self.auth_headers)
        self.assertEqual(vote_res2.status_code, 200)
        self.assertEqual(vote_res2.json()["upvotes"], 1)

        # 3. Add Comment
        comment_res = self.client.post(
            f"/api/community/posts/{post_id}/comments",
            json={"content": "Make sure you export PATH=/usr/local/cuda/bin in .bashrc"},
            headers=self.auth_headers
        )
        self.assertEqual(comment_res.status_code, 201)
        comment = comment_res.json()
        comment_id = comment["id"]
        self.assertEqual(comment["post_id"], post_id)

        # 4. Accept Comment as Solution
        accept_res = self.client.post(f"/api/community/comments/{comment_id}/accept", headers=self.auth_headers)
        self.assertEqual(accept_res.status_code, 200)
        self.assertTrue(accept_res.json()["is_accepted"])

        # 5. Fetch Post Detail and Verify Accepted Answer Pin
        detail_res = self.client.get(f"/api/community/posts/{post_id}")
        self.assertEqual(detail_res.status_code, 200)
        detail = detail_res.json()
        self.assertEqual(detail["post"]["accepted_comment_id"], comment_id)
        self.assertEqual(len(detail["comments"]), 1)
        self.assertTrue(detail["comments"][0]["is_accepted"])

    def test_02_marketplace_lifecycle(self):
        """Test listing item, filtering by category, and updating status to SOLD."""
        # 1. Create Marketplace Listing
        item_data = {
            "title": "TI-84 Plus CE Graphing Calculator",
            "description": "Used for Math 201. Full battery and charging cable included.",
            "price": 1400.0,
            "category": "ELECTRONICS",
            "condition": "LIKE_NEW",
            "images": ["https://images.unsplash.com/photo-calculator.jpg"],
            "seller_phone": "+919876543210",
            "seller_location": "Hostel 3, Room 104"
        }
        res = self.client.post("/api/marketplace/items", json=item_data, headers=self.auth_headers)
        self.assertEqual(res.status_code, 201)
        item = res.json()
        item_id = item["id"]
        self.assertEqual(item["title"], item_data["title"])
        self.assertEqual(item["status"], "ACTIVE")
        self.assertEqual(item["price"], 1400.0)

        # 2. Filter Items by Category
        filter_res = self.client.get("/api/marketplace/items?category=ELECTRONICS")
        self.assertEqual(filter_res.status_code, 200)
        items_list = filter_res.json()["items"]
        found = any(i["id"] == item_id for i in items_list)
        self.assertTrue(found)

        # 3. Fetch Item Detail
        detail_res = self.client.get(f"/api/marketplace/items/{item_id}")
        self.assertEqual(detail_res.status_code, 200)
        detail = detail_res.json()
        self.assertIn("contact_links", detail)
        self.assertIn("whatsapp", detail["contact_links"])

        # 4. Mark Item as SOLD
        status_res = self.client.put(
            f"/api/marketplace/items/{item_id}/status",
            json={"status": "SOLD"},
            headers=self.auth_headers
        )
        self.assertEqual(status_res.status_code, 200)
        self.assertEqual(status_res.json()["status"], "SOLD")

        # 5. Verify Item is Marked SOLD in DB
        db = next(get_sync_db())
        updated_item = db.query(MarketplaceItem).filter(MarketplaceItem.id == item_id).first()
        self.assertEqual(updated_item.status, "SOLD")

if __name__ == "__main__":
    unittest.main()
