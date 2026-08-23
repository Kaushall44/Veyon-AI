import json
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query, Response
from services.audit.audit_logger import get_audit_logs, AUDIT_LOGS

router = APIRouter(prefix="/audit", tags=["Immutable Audit Trail Service"])

@router.get("/logs")
async def fetch_audit_logs(
    event_type: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    """Returns list of immutable audit trail entries."""
    return get_audit_logs(event_type=event_type, search_query=q)

@router.get("/logs/{audit_id}")
async def get_audit_detail(audit_id: str):
    """Returns complete AI provenance JSON payload for audit inspection."""
    matched = next((a for a in AUDIT_LOGS if a["audit_id"] == audit_id), None)
    if not matched:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Audit record '{audit_id}' not found.")
    return matched

@router.get("/export")
async def export_audit_logs(format: str = Query("json", example="json")):
    """Exports full audit trail logs in JSON or CSV format."""
    logs = get_audit_logs()
    if format.lower() == "csv":
        csv_rows = ["audit_id,timestamp,actor_id,actor_role,event_type,request_id,action_summary"]
        for l in logs:
            summary = l['action_summary'].replace(',', ';')
            csv_rows.append(f"{l['audit_id']},{l['timestamp']},{l['actor_id']},{l['actor_role']},{l['event_type']},{l['request_id']},{summary}")
        content = "\n".join(csv_rows)
        return Response(content=content, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=soa_nexus_audit_trail.csv"})
    else:
        content = json.dumps(logs, indent=2)
        return Response(content=content, media_type="application/json", headers={"Content-Disposition": "attachment; filename=soa_nexus_audit_trail.json"})
