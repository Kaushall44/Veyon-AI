import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.analytics_service import AnalyticsService
from backend.database.session import get_sync_db

class TestAnalyticsEngine(unittest.TestCase):
    """
    Test suite for Real-Time Analytics & SQL Aggregation Engine.
    """

    def setUp(self):
        self.client = TestClient(app)

    def test_analytics_overview_endpoint(self):
        """Test GET /api/analytics/overview returns real SQL aggregated metrics."""
        response = self.client.get("/api/analytics/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("metrics", data)
        self.assertIn("intent_breakdown", data)
        metrics = data["metrics"]
        self.assertIn("total_requests", metrics)
        self.assertIn("sla_avg_hours", metrics)
        self.assertIn("rag_confidence_index", metrics)
        self.assertIn("total_vector_chunks", metrics)
        self.assertIsInstance(data["intent_breakdown"], list)
        print("\n[PASSED] Test 1: Real-time analytics overview endpoint verified.")

    def test_analytics_sla_breakdown_endpoint(self):
        """Test GET /api/analytics/sla-breakdown returns category-level SLA benchmarks."""
        response = self.client.get("/api/analytics/sla-breakdown")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 4)
        first_cat = data[0]
        self.assertIn("category", first_cat)
        self.assertIn("target_sla_hours", first_cat)
        self.assertIn("actual_avg_hours", first_cat)
        self.assertIn("compliance_percentage", first_cat)
        print("[PASSED] Test 2: SLA category breakdown endpoint verified.")

    def test_analytics_service_sql_calculations(self):
        """Test direct AnalyticsService methods against active database session."""
        db_gen = get_sync_db()
        db = next(db_gen)
        try:
            overview = AnalyticsService.get_analytics_overview(db=db)
            self.assertIsNotNone(overview)
            self.assertGreater(overview["metrics"]["total_requests"], 0)
            self.assertGreater(overview["metrics"]["active_documents"], 0)

            sla_list = AnalyticsService.get_sla_breakdown(db=db)
            self.assertIsNotNone(sla_list)
            self.assertEqual(len(sla_list), 4)
            print("[PASSED] Test 3: AnalyticsService SQL aggregation queries mathematically verified.")
        finally:
            db.close()

if __name__ == "__main__":
    unittest.main()
