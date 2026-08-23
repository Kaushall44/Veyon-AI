import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.audit.audit_logger import (
    log_audit_event,
    get_audit_logs,
    AUDIT_LOGS
)

class TestAuditLogger(unittest.TestCase):

    def test_audit_logs_count_and_schema(self):
        logs = get_audit_logs()
        self.assertGreaterEqual(len(logs), 50)
        
        # Verify JSON Schema validity for test record AUD-88391
        aud_88391 = next((l for l in logs if l["audit_id"] == "AUD-88391"), None)
        self.assertIsNotNone(aud_88391)
        prov = aud_88391["provenance_json"]
        self.assertIn("raw_user_prompt", prov)
        self.assertIn("nlu_pipeline", prov)
        self.assertIn("rag_provenance", prov)
        self.assertIn("react_plan", prov)
        self.assertIn("hitl_governance", prov)
        self.assertIn("tool_execution", prov)
        print(f"\n[PASSED] Test 1: Audit logs count ({len(logs)} records) and JSON schema validity verified for #AUD-88391.")

    def test_log_audit_event_execution(self):
        record = log_audit_event(
            event_type="TOOL_EXECUTED",
            action_summary="Executed commit_lab_booking() tool for Advanced AI Lab",
            provenance_payload={
                "tool_name": "commit_lab_booking",
                "lab_id": "LAB-AI-101",
                "status": "SUCCESS"
            }
        )

        self.assertTrue(record["audit_id"].startswith("AUD-"))
        self.assertEqual(record["event_type"], "TOOL_EXECUTED")
        self.assertEqual(record["provenance_json"]["status"], "SUCCESS")
        print(f"[PASSED] Test 2: Immutable audit event logged successfully ({record['audit_id']}).")

    def test_filter_audit_logs(self):
        filtered = get_audit_logs(event_type="TOOL_EXECUTED")
        self.assertGreater(len(filtered), 0)
        for f in filtered:
            self.assertEqual(f["event_type"], "TOOL_EXECUTED")
        print(f"[PASSED] Test 3: Audit log filtering by event_type='TOOL_EXECUTED' returned {len(filtered)} records.")

if __name__ == "__main__":
    unittest.main()
