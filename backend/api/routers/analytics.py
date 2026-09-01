from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

try:
    from backend.database.session import get_sync_db
    from backend.services.analytics_service import AnalyticsService
    from backend.middleware.rbac import get_current_user_from_token
except ImportError:
    from database.session import get_sync_db
    from services.analytics_service import AnalyticsService
    from middleware.rbac import get_current_user_from_token

router = APIRouter(tags=["Analytics & Operational Telemetry"])

@router.get("/analytics/overview")
async def get_analytics_overview_endpoint(
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves real-time SQL-aggregated analytics metrics:
    - Active and total request volume
    - Average approval turnaround time (hours)
    - SLA compliance percentage
    - Vector knowledge base chunks
    - Intent and category distribution matrix
    """
    return AnalyticsService.get_analytics_overview(db=db)

@router.get("/analytics/sla-breakdown")
async def get_sla_breakdown_endpoint(
    db: Session = Depends(get_sync_db)
):
    """
    Returns granular category-level SLA breakdown:
    - Target SLA vs actual average turnaround time
    - Met SLA count vs breached SLA count
    - SLA compliance percentage per service type
    """
    return AnalyticsService.get_sla_breakdown(db=db)

@router.get("/admin/analytics")
async def get_admin_analytics_alias(
    db: Session = Depends(get_sync_db)
):
    """
    Backward-compatible alias for admin console analytics overview.
    """
    return AnalyticsService.get_analytics_overview(db=db)
