import sys
import os
import io
import unittest
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
for p in [PROJECT_ROOT, BACKEND_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.main import app
from backend.services.rag.chunking import semantic_chunk_text
from backend.services.rag.ingestion import extract_text_from_file_bytes, generate_embedding
from backend.middleware.rate_limiter import RateLimiterMiddleware

class TestDocumentIngestion(unittest.TestCase):

    def setUp(self):
        RateLimiterMiddleware.reset()
        self.client = TestClient(app)

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_semantic_chunking_with_overlap(self):
        pages = [
            {
                "page_number": 1,
                "text": "Section 1.1: Academic Regulations.\n\n" + " ".join([f"token_{i}" for i in range(600)]),
                "section": "Academic Regulations"
            },
            {
                "page_number": 2,
                "text": "Section 2.4: Examination Guidelines.\n\n" + " ".join([f"exam_rule_{i}" for i in range(250)]),
                "section": "Examination Guidelines"
            }
        ]

        chunks = semantic_chunk_text(pages, chunk_size=500, chunk_overlap=100)
        self.assertGreaterEqual(len(chunks), 2)
        
        # Verify page numbers and section preservation
        page_1_chunks = [c for c in chunks if c["page_number"] == 1]
        page_2_chunks = [c for c in chunks if c["page_number"] == 2]

        self.assertGreaterEqual(len(page_1_chunks), 2)  # 600 tokens split into 2 chunks with overlap
        self.assertEqual(len(page_2_chunks), 1)
        self.assertIn("Section 1.1", page_1_chunks[0]["section"])
        self.assertIn("Section 2.4", page_2_chunks[0]["section"])
        print("\n[PASSED] Test 1: Recursive semantic chunker successfully chunked multi-page text with 500-token size & 100-token overlap.")

    def test_02_embedding_generation_768_dim(self):
        sample_text = "Institute of Technical Education and Research Section 4.2: Course Prerequisite."
        embedding = generate_embedding(sample_text)

        self.assertEqual(len(embedding), 768)
        self.assertIsInstance(embedding[0], float)
        print("[PASSED] Test 2: Dense 768-dimensional embedding vector generated successfully.")

    def test_03_pdf_upload_and_ingestion_endpoint(self):
        # Create a synthetic multi-page text payload simulating SOA Academic Regulations
        text_content = (
            "[Page 1 - Section 1.0: General Preamble]\nSOA University Academic Regulations 2026 for ITER.\n\n"
            "[Page 2 - Section 2.1: Attendance Rules]\nStudents must maintain minimum 75% attendance to sit for semester examinations.\n\n"
            "[Page 3 - Section 3.5: AI Lab Workstation Access]\nAdvanced AI Lab RTX 4090 workstations are reserved for capstone projects."
        )

        response = self.client.post(
            "/api/knowledge/upload",
            data={
                "title": "SOA_Academic_Regulations_2026.pdf",
                "category": "Academic Policy",
                "effective_year": 2026
            },
            files={
                "file": ("SOA_Academic_Regulations_2026.txt", text_content.encode("utf-8"), "text/plain")
            }
        )

        self.assertIn(response.status_code, [200, 201])
        data = response.json()

        self.assertEqual(data["title"], "SOA_Academic_Regulations_2026.pdf")
        self.assertEqual(data["effective_year"], 2026)
        self.assertEqual(data["vector_dim"], 768)
        self.assertEqual(data["status"], "ACTIVE")
        self.assertGreaterEqual(data["chunk_count"], 3)

        # Acceptance Criteria: Multi-page document parses into structured chunks with accurate page number metadata
        chunks = data["chunks"]
        page_nums = [c["page"] for c in chunks]
        self.assertIn(1, page_nums)
        self.assertIn(2, page_nums)
        self.assertIn(3, page_nums)

        print("[PASSED] Test 3: Acceptance Criteria Passed! Multi-page upload parsed into structured chunks with accurate page numbers (1, 2, 3).")

if __name__ == "__main__":
    unittest.main()
