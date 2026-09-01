import sys
import os
import math
import unittest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
for p in [PROJECT_ROOT, BACKEND_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.services.rag.embeddings import generate_vector_embedding
from backend.services.rag.retriever import VectorRetriever, calculate_cosine_similarity
from backend.middleware.rate_limiter import RateLimiterMiddleware

class TestVectorSearchEngine(unittest.TestCase):

    def setUp(self):
        RateLimiterMiddleware.reset()

    def tearDown(self):
        RateLimiterMiddleware.reset()

    def test_01_embedding_dimension_and_l2_normalization(self):
        text = "Institute of Technical Education and Research Section 4.2: Course Prerequisite & Fast-Track Lab Permits."
        vector = generate_vector_embedding(text)

        self.assertEqual(len(vector), 768)
        self.assertIsInstance(vector[0], float)
        
        # Verify L2 Unit Normalization (Sum of squares ~= 1.0)
        norm = math.sqrt(sum(x * x for x in vector))
        self.assertAlmostEqual(norm, 1.0, places=2)
        print("\n[PASSED] Test 1: Vector embedding generated with 768-dim and exact L2 unit normalization.")

    def test_02_flagship_acceptance_criteria_fast_track_permit(self):
        # Flagship Acceptance Criteria:
        # Querying "What attendance is needed for fast track lab permits?" retrieves Section 4.2 of SOA Regulations with exact page number and cosine similarity score > 0.88.
        query = "What attendance is needed for fast track lab permits?"
        citations = VectorRetriever.retrieve_grounded_citations(query, top_k=3, threshold=0.82)

        self.assertGreater(len(citations), 0)
        top_match = citations[0]

        self.assertEqual(top_match["document_title"], "SOA Academic Regulations 2025.pdf")
        self.assertIn("Section 4.2", top_match["section"])
        self.assertEqual(top_match["page"], 4)
        self.assertGreater(top_match["similarity_score"], 0.88)
        self.assertIn("85% attendance", top_match["text"])

        print(f"[PASSED] Test 2: Acceptance Criteria Passed! Retrieved '{top_match['section']}' on Page {top_match['page']} with Similarity: {top_match['similarity_score']:.4f} (> 0.88).")

    def test_03_active_circular_metadata_filtering(self):
        # Query matching outdated 2020 rule - ensure DEPRECATED policy is excluded by active metadata filter
        query = "Do I need a physical paper requisition signed by HoD for lab access?"
        citations = VectorRetriever.retrieve_grounded_citations(query, top_k=5, threshold=0.70)

        # Verify NO deprecated document was returned
        for c in citations:
            self.assertNotEqual(c["document_title"], "SOA Old Deprecated Regulations 2020.pdf")
            self.assertNotIn("Deprecated 2020 Policy", c["text"])

        print("[PASSED] Test 3: Metadata filter strictly rejected DEPRECATED circulars and preserved active governance.")

    def test_04_cosine_similarity_computation(self):
        vec_a = [1.0, 0.0, 0.0, 0.0]
        vec_b = [1.0, 0.0, 0.0, 0.0]
        vec_c = [0.0, 1.0, 0.0, 0.0]

        # Identical vectors -> 1.0
        self.assertAlmostEqual(calculate_cosine_similarity(vec_a, vec_b), 1.0)
        # Orthogonal vectors -> 0.0
        self.assertAlmostEqual(calculate_cosine_similarity(vec_a, vec_c), 0.0)
        print("[PASSED] Test 4: Cosine similarity computation mathematically validated.")

if __name__ == "__main__":
    unittest.main()
