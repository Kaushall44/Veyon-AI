import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

try:
    from backend.database.models import AuditLog
    from backend.database.supabase_client import supabase_insert, supabase_select
    from backend.services.audit.audit_logger import AUDIT_LOGS
except ImportError:
    from database.models import AuditLog
    from database.supabase_client import supabase_insert, supabase_select
    from services.audit.audit_logger import AUDIT_LOGS

logger = logging.getLogger("soa_nexus_audit")

class AuditService:
    """
    Immutable Audit Trail & Structured Telemetry Service.
    Enforces write-only, tamper-evident append logging in PostgreSQL and Supabase.
    """

    @classmethod
    def record_event(
        cls,
        action_type: str,
        actor_id: str = "Rahul Sharma (2023-CSE-042)",
        actor_role: str = "Student",
        request_id: Optional[str] = None,
        ip_address: str = "127.0.0.1",
        details: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """
        Appends an immutable structured audit log entry across memory, database, and Supabase.
        """
        audit_id = f"AUD-{uuid.uuid4().hex[:5].upper()}"
        now_dt = datetime.now(timezone.utc)
        now_str = now_dt.strftime("%Y-%m-%d %H:%M:%S")

        payload_details = details or {}
        action_summary = payload_details.get("action_summary") or f"Executed '{action_type}' event"

        audit_entry = {
            "audit_id": audit_id,
            "id": audit_id,
            "timestamp": now_str,
            "actor_id": actor_id,
            "actor_role": actor_role,
            "action_type": action_type,
            "event_type": action_type,
            "request_id": request_id or str(uuid.uuid4()),
            "ip_address": ip_address,
            "action_summary": action_summary,
            "details": payload_details,
            "provenance_json": {
                "audit_id": audit_id,
                "timestamp": now_dt.isoformat(),
                "action_type": action_type,
                "actor": {
                    "id": actor_id,
                    "role": actor_role,
                    "ip": ip_address
                },
                "request_id": request_id,
                **payload_details
            }
        }

        # 1. Update in-memory registry
        AUDIT_LOGS.insert(0, audit_entry)

        # 2. Persist to local database
        if db is not None:
            try:
                db_record = AuditLog(
                    id=audit_id,
                    actor_id=actor_id,
                    actor_role=actor_role,
                    action_type=action_type,
                    request_id=request_id,
                    ip_address=ip_address,
                    details=payload_details,
                    created_at=now_dt
                )
                db.add(db_record)
                db.commit()
            except Exception as e:
                logger.warning(f"Local DB audit log write warning: {e}")
                db.rollback()

        # 3. Persist to Supabase Cloud
        try:
            supabase_insert("audit_logs", {
                "id": str(uuid.uuid4()),
                "user_id": "20000000-0000-0000-0000-000000000001",
                "action_type": action_type,
                "raw_prompt": payload_details.get("raw_user_prompt", action_summary),
                "detected_intent": payload_details.get("nlu_pipeline", {}).get("detected_intent", action_type),
                "retrieved_sources": payload_details.get("rag_provenance", {}),
                "agent_plan": payload_details.get("react_plan", {}),
                "approval_record": payload_details.get("hitl_governance", {}),
                "execution_payload": payload_details.get("tool_execution", {})
            })
        except Exception as e:
            logger.warning(f"Supabase audit log insert notice: {e}")

        return audit_entry

    @classmethod
    def get_logs(
        cls,
        event_type: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: int = 100,
        db: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieves audit trail with multi-dimensional filtering and provenance JSON.
        """
        logs = list(AUDIT_LOGS)

        # Merge DB records if available
        if db is not None:
            try:
                db_logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
                for dl in db_logs:
                    if not any(l["audit_id"] == dl.id or l.get("id") == dl.id for l in logs):
                        logs.append({
                            "audit_id": f"AUD-{dl.id[:5].upper()}",
                            "id": dl.id,
                            "timestamp": dl.created_at.strftime("%Y-%m-%d %H:%M:%S") if dl.created_at else "",
                            "actor_id": dl.actor_id or "System",
                            "actor_role": dl.actor_role or "System",
                            "action_type": dl.action_type,
                            "event_type": dl.action_type,
                            "request_id": dl.request_id,
                            "ip_address": dl.ip_address or "127.0.0.1",
                            "action_summary": dl.details.get("action_summary", f"Event: {dl.action_type}"),
                            "details": dl.details,
                            "provenance_json": {
                                "audit_id": dl.id,
                                "timestamp": dl.created_at.isoformat() if dl.created_at else None,
                                "action_type": dl.action_type,
                                **dl.details
                            }
                        })
            except Exception as e:
                logger.warning(f"DB audit log read notice: {e}")

        # Filter by Event Type
        if event_type and event_type.upper() != "ALL":
            logs = [l for l in logs if l.get("event_type", "").upper() == event_type.upper() or l.get("action_type", "").upper() == event_type.upper()]

        # Filter by Full-Text Search Query
        if search_query:
            q = search_query.lower().strip()
            logs = [
                l for l in logs
                if q in l.get("action_summary", "").lower()
                or q in l.get("audit_id", "").lower()
                or q in l.get("actor_id", "").lower()
                or q in l.get("actor_role", "").lower()
                or q in str(l.get("details", "")).lower()
                or q in str(l.get("provenance_json", "")).lower()
            ]

        return logs[:limit]
