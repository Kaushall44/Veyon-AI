import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app
from services.rag.retrieval import search_hybrid_knowledge_base
from api.routers.knowledge import KNOWLEDGE_DOCUMENTS

client = TestClient(app)

class TestKnowledgeBaseAdministration(unittest.TestCase):

    def test_01_get_knowledge_documents(self):
        """Test retrieving full knowledge base document catalog."""
        response = client.get("/api/knowledge/documents")
        self.assertEqual(response.status_code, 200)
        docs = response.json()
        self.assertIsInstance(docs, list)
        self.assertTrue(len(docs) >= 5)
        print("\n[PASSED] Test 1: /api/knowledge/documents returned indexed policy catalog.")

    def test_02_toggle_document_status(self):
        """Test toggling status between ACTIVE and DEPRECATED."""
        # Toggle to DEPRECATED
        response = client.post("/api/knowledge/documents/DOC-ITER-1001/toggle-status")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["new_status"], "DEPRECATED")

        # Toggle back to ACTIVE
        response_back = client.post("/api/knowledge/documents/DOC-ITER-1001/toggle-status")
        self.assertEqual(response_back.status_code, 200)
        self.assertEqual(response_back.json()["new_status"], "ACTIVE")
        print("[PASSED] Test 2: /api/knowledge/documents/{id}/toggle-status successfully toggled document lifecycle.")

    def test_03_get_document_chunks_inspector(self):
        """Test inspecting vector chunks for a specific policy document."""
        response = client.get("/api/knowledge/documents/DOC-ITER-1004/chunks")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("doc_title", data)
        self.assertIn("chunks", data)
        self.assertTrue(len(data["chunks"]) > 0)
        first_chunk = data["chunks"][0]
        self.assertIn("vector_sample", first_chunk)
        self.assertIn("similarity_weight", first_chunk)
        print("[PASSED] Test 3: /api/knowledge/documents/{id}/chunks returned chunk text & 768-dim embeddings.")

    def test_04_deprecated_document_excluded_from_rag(self):
        """Acceptance Criteria: Deprecating an outdated circular immediately excludes its chunks from future AI RAG retrievals."""
        # Toggle regulations document to DEPRECATED via API
        res = client.post("/api/knowledge/documents/DOC-ITER-1004/toggle-status")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["new_status"], "DEPRECATED")

        results = search_hybrid_knowledge_base("Section 4.2 fast track lab permit attendance requirements", top_k=5)
        for chunk, score in results:
            self.assertNotIn("regulations", chunk.document_title.lower())

        # Toggle back to ACTIVE
        res_back = client.post("/api/knowledge/documents/DOC-ITER-1004/toggle-status")
        self.assertEqual(res_back.status_code, 200)
        self.assertEqual(res_back.json()["new_status"], "ACTIVE")

        print("[PASSED] Test 4: Acceptance Criteria Passed! Deprecating circular strictly excluded its chunks from RAG retrievals.")

    def test_05_upload_new_knowledge_document(self):
        """Test uploading a new policy document with text extraction and 768-dim embedding."""
        form_data = {
            "title": "SOA_Student_Sports_Policy_2026.pdf",
            "category": "Student Affairs",
            "effective_year": 2026
        }
        response = client.post("/api/knowledge/upload", data=form_data)
        self.assertEqual(response.status_code, 201)
        doc = response.json()
        self.assertEqual(doc["title"], "SOA_Student_Sports_Policy_2026.pdf")
        self.assertEqual(doc["status"], "ACTIVE")
        self.assertEqual(doc["vector_dim"], 768)
        print("[PASSED] Test 5: /api/knowledge/upload created document with semantic chunking & 768-dim vector embeddings.")

if __name__ == "__main__":
    unittest.main()
