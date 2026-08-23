import sys
import os
import unittest
import asyncio

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.routers.knowledge import (
    KNOWLEDGE_DOCUMENTS,
    get_knowledge_documents,
    upload_knowledge_document,
    toggle_document_status,
    get_document_chunks,
    get_admin_analytics
)

class TestKnowledgeManager(unittest.TestCase):

    def test_knowledge_base_pipeline(self):
        # 1. Test Admin Analytics Overview
        analytics = asyncio.run(get_admin_analytics())
        self.assertIn("metrics", analytics)
        self.assertEqual(analytics["metrics"]["rag_confidence_index"], 96.4)
        print("\n[PASSED] Test 1: Admin analytics overview verified.")

        # 2. Test Document Catalog Retrieval
        docs = asyncio.run(get_knowledge_documents())
        self.assertGreaterEqual(len(docs), 3)
        print("[PASSED] Test 2: Knowledge documents catalog retrieved successfully.")

        # 3. Test PDF Upload & Vector Chunking Simulation
        new_doc = asyncio.run(upload_knowledge_document(
            title="SOA_Examination_Regulations_2026.pdf",
            category="Academic Policy",
            effective_year=2026
        ))
        self.assertEqual(new_doc["title"], "SOA_Examination_Regulations_2026.pdf")
        self.assertEqual(new_doc["vector_dim"], 768)
        self.assertEqual(new_doc["status"], "ACTIVE")
        print(f"[PASSED] Test 3: PDF Document indexed into Vector DB with 768-dim embeddings: '{new_doc['id']}'")

        # 4. Test Document Status Toggle (ACTIVE -> DEPRECATED -> ACTIVE)
        doc_id = new_doc["id"]
        res1 = asyncio.run(toggle_document_status(doc_id))
        self.assertEqual(res1["new_status"], "DEPRECATED")

        res2 = asyncio.run(toggle_document_status(doc_id))
        self.assertEqual(res2["new_status"], "ACTIVE")
        print("[PASSED] Test 4: Document deprecation status toggle verified.")

        # 5. Test Chunk Inspector Metadata Retrieval
        chunks_res = asyncio.run(get_document_chunks(doc_id))
        self.assertEqual(chunks_res["doc_title"], "SOA_Examination_Regulations_2026.pdf")
        self.assertGreaterEqual(len(chunks_res["chunks"]), 1)
        print("[PASSED] Test 5: Vector Chunk Inspector metadata validated.")

if __name__ == "__main__":
    unittest.main()
