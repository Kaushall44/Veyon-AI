import uuid
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

# Initial Seeded Audit Records Data Store (50+ structured JSON provenance logs)
AUDIT_LOGS: List[Dict[str, Any]] = [
    {
        "audit_id": "AUD-88391",
        "timestamp": "2026-08-23 14:00:15",
        "actor_id": "Kaushal Raj Gupta (2023-CSE-042)",
        "actor_role": "Student",
        "event_type": "TOOL_EXECUTED",
        "request_id": "50000000-0000-0000-0000-000000000001",
        "action_summary": "Executed commit_lab_booking() tool for Advanced AI Lab C-204",
        "provenance_json": {
            "audit_id": "AUD-88391",
            "request_id": "50000000-0000-0000-0000-000000000001",
            "timestamp": "2026-08-23T14:00:15Z",
            "raw_user_prompt": "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.",
            "nlu_pipeline": {
                "detected_intent": "LAB_BOOKING",
                "confidence_score": 0.98,
                "extracted_entities": {
                    "lab_id": "LAB-AI-101",
                    "lab_name": "Advanced AI & GPU Computing Lab",
                    "room_no": "C-204",
                    "date": "2026-08-24",
                    "start_time": "14:00",
                    "end_time": "16:00"
                }
            },
            "rag_provenance": {
                "queried_policy": "SOA_Lab_Guidelines_2025.txt",
                "retrieved_chunk_id": "CHUNK-LAB-012",
                "vector_similarity_score": 0.92,
                "bm25_relevance_score": 0.88,
                "hybrid_score": 0.908
            },
            "react_plan": {
                "risk_level": "HIGH",
                "requires_approval": True,
                "assigned_approver_role": "Lab_In_Charge",
                "steps_passed": [
                    "Check Student Course Prerequisites (CS301 Passed)",
                    "Verify Lab Slot Availability (25/30 Free Seats)"
                ]
            },
            "hitl_governance": {
                "approval_id": "80000000-0000-0000-0000-000000000001",
                "approver": "Prof. A. K. Samanta (Lab In-Charge)",
                "decision": "APPROVED",
                "approved_at": "2026-08-23T14:02:10Z"
            },
            "tool_execution": {
                "tool_name": "commit_lab_booking",
                "arguments": {
                    "lab_id": "LAB-AI-101",
                    "date": "2026-08-24",
                    "start_time": "14:00",
                    "end_time": "16:00"
                },
                "result": {
                    "booking_id": "BK-60001",
                    "access_pass_code": "PASS-LAB-AI-88192",
                    "qr_payload": "SOA-NEXUS-PASS|PASS-LAB-AI-88192|LAB-AI-101|2026-08-24|14:00-16:00|Rahul Sharma"
                }
            }
        }
    }
]

# Generate Seed Benchmark Audit Logs to populate 50 test records
def _seed_audit_logs():
    event_types = ["CHAT_PROMPT", "INTENT_DETECTED", "RAG_RETRIEVAL", "PLAN_GENERATED", "HITL_APPROVAL_GRANTED", "TOOL_EXECUTED"]
    intents = ["LAB_BOOKING", "CERTIFICATE", "MAINTENANCE", "GRIEVANCE", "FAQ"]

    for i in range(2, 51):
        evt = event_types[i % len(event_types)]
        intent = intents[i % len(intents)]
        audit_code = f"AUD-88{390 + i}"
        req_id = f"50000000-0000-0000-0000-{i:012d}"
        now_str = f"2026-08-23 13:{(i % 55):02d}:10"

        record = {
            "audit_id": audit_code,
            "timestamp": now_str,
            "actor_id": "Rahul Sharma (2023-CSE-042)",
            "actor_role": "Student",
            "event_type": evt,
            "request_id": req_id,
            "action_summary": f"Audit log record #{i} for workflow event '{evt}' [{intent}]",
            "provenance_json": {
                "audit_id": audit_code,
                "request_id": req_id,
                "timestamp": now_str,
                "event_type": evt,
                "nlu_pipeline": {
                    "intent": intent,
                    "confidence": 0.95
                },
                "system_provenance": {
                    "node": "SOA-Nexus-AI-Core-01",
                    "integrity_hash": f"SHA256-{uuid.uuid4().hex[:12]}"
                }
            }
        }
        AUDIT_LOGS.append(record)

_seed_audit_logs()

def log_audit_event(
    event_type: str,
    action_summary: str,
    provenance_payload: Dict[str, Any],
    actor_id: str = "Rahul Sharma (2023-CSE-042)",
    actor_role: str = "Student",
    request_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Logs an immutable audit trail entry with full AI provenance metadata.
    """
    audit_id = f"AUD-{uuid.uuid4().hex[:5].upper()}"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    req_id = request_id or str(uuid.uuid4())

    provenance_payload["audit_id"] = audit_id
    provenance_payload["timestamp"] = timestamp
    provenance_payload["event_type"] = event_type

    record = {
        "audit_id": audit_id,
        "timestamp": timestamp,
        "actor_id": actor_id,
        "actor_role": actor_role,
        "event_type": event_type,
        "request_id": req_id,
        "action_summary": action_summary,
        "provenance_json": provenance_payload
    }

    AUDIT_LOGS.insert(0, record)
    return record

def get_audit_logs(
    event_type: Optional[str] = None,
    search_query: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Returns filtered audit trail logs."""
    result = list(AUDIT_LOGS)
    if event_type and event_type != "ALL":
        result = [r for r in result if r["event_type"] == event_type]
    if search_query:
        q = search_query.lower()
        result = [
            r for r in result
            if q in r["audit_id"].lower() or q in r["action_summary"].lower() or q in r["event_type"].lower()
        ]
    return result
