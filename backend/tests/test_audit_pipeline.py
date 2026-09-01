import unittest
import sys
import os
import json

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app
from services.audit_service import AuditService
from core.security import create_access_token

client = TestClient(app)

# Helper tokens
admin_token = create_access_token(data={"sub": "admin-001", "role": "Admin", "email": "admin@soa.ac.in"})
admin_headers = {"Authorization": f"Bearer {admin_token}"}
student_token = create_access_token(data={"sub": "student-001", "role": "Student", "email": "student@soa.ac.in"})
student_headers = {"Authorization": f"Bearer {student_token}"}

class TestImmutableAuditPipeline(unittest.TestCase):

    def test_01_record_structured_audit_event(self):
        """Test recording structured JSON telemetry across RAG, NLU, and ReAct plan."""
        event = AuditService.record_event(
            action_type="PLAN_GENERATED",
            actor_id="Rahul Sharma (2023-CSE-042)",
            actor_role="Student",
            request_id="50000000-0000-0000-0000-000000000001",
            ip_address="192.168.1.45",
            details={
                "action_summary": "Generated 4-step ReAct action plan for GPU Workstation Allocation",
                "raw_user_prompt": "Book AI lab for tomorrow 2-4 PM for capstone project",
                "nlu_pipeline": {
                    "detected_intent": "LAB_BOOKING",
                    "confidence_score": 0.98
                },
                "rag_provenance": {
                    "queried_policy": "SOA_Lab_Guidelines_2025.txt",
                    "vector_similarity_score": 0.941
                },
                "react_plan": {
                    "risk_level": "HIGH",
                    "requires_approval": True,
                    "steps": ["Prerequisites Check", "Workstation Selection", "HITL Review", "Pass Generation"]
                }
            }
        )
        self.assertIsNotNone(event)
        self.assertIn("audit_id", event)
        self.assertEqual(event["action_type"], "PLAN_GENERATED")
        print("\n[PASSED] Test 1: Structured AI provenance telemetry recorded in AuditService.")

    def test_02_admin_retrieves_audit_logs(self):
        """Test admin querying audit logs with search and filters."""
        response = client.get("/api/audit/logs?event_type=ALL&q=GPU", headers=admin_headers)
        self.assertEqual(response.status_code, 200)
        logs = response.json()
        self.assertIsInstance(logs, list)
        self.assertTrue(len(logs) > 0)
        print("[PASSED] Test 2: Admin successfully retrieved filtered audit logs with full-text search.")

    def test_03_student_forbidden_from_audit_console(self):
        """Test RBAC guardrail: Student token rejected with HTTP 403."""
        response = client.get("/api/audit/logs", headers=student_headers)
        self.assertEqual(response.status_code, 403)
        print("[PASSED] Test 3: Student token correctly rejected with HTTP 403 on /api/audit/logs.")

    def test_04_immutability_prohibits_delete_and_update(self):
        """Test immutable audit constraint: DELETE and PUT return HTTP 403 Forbidden."""
        # 1. Attempt DELETE
        del_resp = client.delete("/api/audit/logs/AUD-88391", headers=admin_headers)
        self.assertEqual(del_resp.status_code, 403)
        self.assertIn("strictly prohibited", del_resp.json()["detail"])

        # 2. Attempt PUT
        put_resp = client.put("/api/audit/logs/AUD-88391", json={"tampered": True}, headers=admin_headers)
        self.assertEqual(put_resp.status_code, 403)
        self.assertIn("strictly prohibited", put_resp.json()["detail"])
        print("[PASSED] Test 4: Immutability invariant enforced! UPDATE and DELETE strictly rejected with HTTP 403.")

    def test_05_export_audit_logs_json_and_csv(self):
        """Test exporting audit logs in CSV and JSON formats."""
        # 1. Export JSON
        json_resp = client.get("/api/audit/export?format=json", headers=admin_headers)
        self.assertEqual(json_resp.status_code, 200)
        self.assertEqual(json_resp.headers["content-type"], "application/json")

        # 2. Export CSV
        csv_resp = client.get("/api/audit/export?format=csv", headers=admin_headers)
        self.assertEqual(csv_resp.status_code, 200)
        self.assertIn("text/csv", csv_resp.headers["content-type"])
        print("[PASSED] Test 5: Exported audit logs in compliant JSON and CSV formats.")

if __name__ == "__main__":
    unittest.main()
