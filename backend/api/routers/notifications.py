import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/notifications", tags=["In-App Notification Service"])

# In-Memory Notification Store
NOTIFICATIONS_STORE: List[Dict[str, Any]] = [
    {
        "id": "NOTIF-101",
        "recipient_id": "u1000000-0000-0000-0000-000000000001",
        "title": "Lab Booking Approved",
        "message": "Prof. A. K. Samanta approved your AI Lab booking (#LB-4019) for tomorrow 14:00-16:00. Digital Access Pass issued.",
        "type": "APPROVED",
        "is_read": False,
        "created_at": "2026-08-23 14:02",
        "target_url": "/services/lab-booking"
    },
    {
        "id": "NOTIF-102",
        "recipient_id": "u1000000-0000-0000-0000-000000000001",
        "title": "Bonafide Certificate Signed",
        "message": "Admin Officer Patnaik signed your Bonafide Certificate request (#CERT-881). Ready for PDF download.",
        "type": "APPROVED",
        "is_read": False,
        "created_at": "2026-08-23 13:45",
        "target_url": "/services/certificate"
    },
    {
        "id": "NOTIF-103",
        "recipient_id": "u1000000-0000-0000-0000-000000000001",
        "title": "Maintenance Ticket Dispatched",
        "message": "Rajesh Kumar (HVAC Lead) accepted ticket #MT-8842 for C-Block Room 302.",
        "type": "IN_PROGRESS",
        "is_read": True,
        "created_at": "2026-08-23 12:10",
        "target_url": "/services/maintenance"
    }
]

class CreateNotifPayload(BaseModel):
    recipient_id: Optional[str] = Field("u1000000-0000-0000-0000-000000000001")
    title: str = Field("Request Approved", example="Request Approved")
    message: str = Field("Your service request has been approved.", example="Request approved")
    type: str = Field("APPROVED", example="APPROVED")  # PENDING_APPROVAL, APPROVED, REJECTED, RESOLVED
    target_url: Optional[str] = Field("/requests")

class MarkReadPayload(BaseModel):
    notification_ids: Optional[List[str]] = Field(None)

@router.get("")
async def get_notifications():
    """Returns list of notifications and unread badge count."""
    unread_count = sum(1 for n in NOTIFICATIONS_STORE if not n["is_read"])
    return {
        "unread_count": unread_count,
        "notifications": NOTIFICATIONS_STORE
    }

@router.post("/create")
async def create_notification(payload: CreateNotifPayload):
    """Dispatches a new notification upon workflow state changes."""
    notif_id = f"NOTIF-{uuid.uuid4().hex[:4].upper()}"
    new_notif = {
        "id": notif_id,
        "recipient_id": payload.recipient_id or "u1000000-0000-0000-0000-000000000001",
        "title": payload.title,
        "message": payload.message,
        "type": payload.type,
        "is_read": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "target_url": payload.target_url or "/requests"
    }
    NOTIFICATIONS_STORE.insert(0, new_notif)
    return new_notif

@router.post("/mark-read")
async def mark_notifications_read(payload: MarkReadPayload):
    """Marks specified or all notifications as read."""
    if payload.notification_ids:
        for n in NOTIFICATIONS_STORE:
            if n["id"] in payload.notification_ids:
                n["is_read"] = True
    else:
        for n in NOTIFICATIONS_STORE:
            n["is_read"] = True

    unread_count = sum(1 for n in NOTIFICATIONS_STORE if not n["is_read"])
    return {"status": "success", "unread_count": unread_count}
