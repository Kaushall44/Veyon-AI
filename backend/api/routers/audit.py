import json
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Query, Response, Depends
from sqlalchemy.orm import Session

try:
    from backend.services.audit_service import AuditService
    from backend.middleware.rbac import require_roles
    from backend.database.session import get_sync_db
except ImportError:
    from services.audit_service import AuditService
    from middleware.rbac import require_roles
    from database.session import get_sync_db

router = APIRouter(prefix="/audit", tags=["Immutable Audit Trail & Telemetry Pipeline"])

@router.get("/logs")
async def fetch_audit_logs(
    event_type: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    current_user = Depends(require_roles(["Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Returns list of immutable structured audit trail records (Admin Only).
    Supports full-text search across prompts, actions, and actors.
    """
    return AuditService.get_logs(event_type=event_type, search_query=q, limit=limit, db=db)

@router.get("/logs/{audit_id}")
async def get_audit_detail(
    audit_id: str,
    current_user = Depends(require_roles(["Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Returns complete structured AI provenance JSON telemetry for deep inspection.
    """
    logs = AuditService.get_logs(limit=500, db=db)
    matched = next((a for a in logs if a["audit_id"] == audit_id or a.get("id") == audit_id), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Audit record '{audit_id}' not found."
        )
    return matched

@router.delete("/logs/{audit_id}")
async def delete_audit_log_prohibited(
    audit_id: str,
    current_user = Depends(require_roles(["Admin", "Super_Admin"]))
):
    """
    Strict immutability enforcement: Prohibits DELETE operations on audit logs.
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Immutable Audit Trail: DELETE operations are strictly prohibited on audit_logs by institutional governance policy."
    )

@router.put("/logs/{audit_id}")
async def update_audit_log_prohibited(
    audit_id: str,
    payload: Dict[str, Any],
    current_user = Depends(require_roles(["Admin", "Super_Admin"]))
):
    """
    Strict immutability enforcement: Prohibits UPDATE operations on audit logs.
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Immutable Audit Trail: UPDATE operations are strictly prohibited on audit_logs by institutional governance policy."
    )

@router.get("/export")
async def export_audit_logs(
    format: str = Query("json", examples=["json", "csv"]),
    current_user = Depends(require_roles(["Admin", "Super_Admin"])),
    db: Session = Depends(get_sync_db)
):
    """
    Exports full immutable audit trail in JSON or CSV format.
    """
    logs = AuditService.get_logs(limit=500, db=db)
    if format.lower() == "csv":
        csv_rows = ["audit_id,timestamp,actor_id,actor_role,event_type,request_id,action_summary"]
        for l in logs:
            summary = (l.get('action_summary') or '').replace(',', ';')
            csv_rows.append(f"{l.get('audit_id')},{l.get('timestamp')},{l.get('actor_id')},{l.get('actor_role')},{l.get('event_type')},{l.get('request_id')},{summary}")
        content = "\n".join(csv_rows)
        return Response(
            content=content, 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=soa_nexus_audit_trail.csv"}
        )
    else:
        content = json.dumps(logs, indent=2)
        return Response(
            content=content, 
            media_type="application/json", 
            headers={"Content-Disposition": "attachment; filename=soa_nexus_audit_trail.json"}
        )
