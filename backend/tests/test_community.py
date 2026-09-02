import unittest
import json
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User, CommunityPost, CommunityComment, CommunityVote
from backend.core.security import create_access_token

class TestCommunityAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        
        # Setup test tokens
        cls.student_token = create_access_token({
            "sub": "u1000000-0000-0000-0000-000000000001",
            "role": "Student",
            "reg_number": "2023-CSE-042"
        })
        cls.faculty_token = create_access_token({
            "sub": "u2000000-0000-0000-0000-000000000002",
            "role": "Faculty",
            "reg_number": "FAC-CSE-012"
        })

    def test_01_list_community_posts(self):
        """Test listing community posts with default and sorted parameters."""
        response = self.client.get("/api/community/posts?sort_by=hot")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("posts", data)
        self.assertIn("total", data)
        self.assertGreaterEqual(len(data["posts"]), 1)
        print("\n[PASSED] Test 1: Listed community forum posts successfully.")

    def test_02_create_community_post(self):
        """Test creating a new question with verified student badge."""
        headers = {"Authorization": f"Bearer {self.student_token}"}
        payload = {
            "title": "Which LLM model is best for local code synthesis?",
            "content": "Looking for recommendations between DeepSeek-Coder 6.7B vs Qwen 2.5 Coder for edge devices.",
            "category": "RESEARCH",
            "tags": ["LLM", "DeepSeek", "EdgeAI"]
        }
        response = self.client.post("/api/community/posts", json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["title"], payload["title"])
        self.assertIn("Student", data["author_badge"])
        self.__class__.created_post_id = data["id"]
        print("[PASSED] Test 2: Created new community post with verified badge.")

    def test_03_get_post_detail_and_add_comment(self):
        """Test getting post detail and posting a reply/answer."""
        post_id = getattr(self.__class__, "created_post_id", None)
        self.assertIsNotNone(post_id)

        # Get post detail
        res_get = self.client.get(f"/api/community/posts/{post_id}")
        self.assertEqual(res_get.status_code, 200)
        detail = res_get.json()
        self.assertEqual(detail["post"]["id"], post_id)

        # Faculty replies to question
        headers = {"Authorization": f"Bearer {self.faculty_token}"}
        comment_payload = {
            "content": "Qwen 2.5 Coder 7B achieves 88.4 on HumanEval and fits nicely in 6GB VRAM using Q4_K_M quantization!"
        }
        res_comment = self.client.post(
            f"/api/community/posts/{post_id}/comments",
            json=comment_payload,
            headers=headers
        )
        self.assertEqual(res_comment.status_code, 201)
        c_data = res_comment.json()
        self.assertIn("Faculty", c_data["author_badge"])
        self.__class__.created_comment_id = c_data["id"]
        print("[PASSED] Test 3: Faculty replied to question with verified badge.")

    def test_04_vote_post_and_comment(self):
        """Test upvoting post and comment."""
        post_id = getattr(self.__class__, "created_post_id", None)
        comment_id = getattr(self.__class__, "created_comment_id", None)

        headers = {"Authorization": f"Bearer {self.faculty_token}"}
        
        # Upvote post
        res_post_vote = self.client.post(
            f"/api/community/posts/{post_id}/vote",
            json={"vote_value": 1},
            headers=headers
        )
        self.assertEqual(res_post_vote.status_code, 200)
        self.assertEqual(res_post_vote.json()["user_vote"], 1)

        # Upvote comment
        headers_student = {"Authorization": f"Bearer {self.student_token}"}
        res_comment_vote = self.client.post(
            f"/api/community/comments/{comment_id}/vote",
            json={"vote_value": 1},
            headers=headers_student
        )
        self.assertEqual(res_comment_vote.status_code, 200)
        self.assertEqual(res_comment_vote.json()["user_vote"], 1)
        print("[PASSED] Test 4: Upvoted post and comment with atomic tallying.")

    def test_05_accept_answer(self):
        """Test post author marking a reply as the accepted answer."""
        comment_id = getattr(self.__class__, "created_comment_id", None)
        headers = {"Authorization": f"Bearer {self.student_token}"}
        
        response = self.client.post(
            f"/api/community/comments/{comment_id}/accept",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["accepted_comment_id"], comment_id)
        print("[PASSED] Test 5: Post author marked reply as Accepted / Helpful Answer.")

if __name__ == "__main__":
    unittest.main()
