import uuid
import json
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Set
from fastapi import APIRouter, HTTPException, status, Request, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

try:
    from backend.database.session import get_sync_db
    from backend.database.models import Notification, User
    from backend.database.supabase_client import supabase_insert, supabase_select, supabase_update
except ImportError:
    from database.session import get_sync_db
    from database.models import Notification, User
    from database.supabase_client import supabase_insert, supabase_select, supabase_update

logger = logging.getLogger("soa_nexus_notifications")

router = APIRouter(prefix="/notifications", tags=["Database-Backed Real-Time Notification & SSE Engine"])

# Live SSE Connection Listeners
NOTIFICATION_LISTENERS: Set[asyncio.Queue] = set()

# Persistent In-Memory Cache & Fallback Store
NOTIFICATIONS_STORE: List[Dict[str, Any]] = [
    {
        "id": "NOTIF-101",
        "user_id": "20000000-0000-0000-0000-000000000001",
        "title": "Lab Booking Approved",
        "message": "Prof. A. K. Samanta approved your AI Lab booking (#LB-4019) for tomorrow 14:00-16:00. Digital Access Pass issued.",
        "type": "APPROVED",
        "category": "LAB_BOOKING",
        "is_read": False,
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M"),
        "link_path": "/services/lab-booking"
    },
    {
        "id": "NOTIF-102",
        "user_id": "20000000-0000-0000-0000-000000000001",
        "title": "Bonafide Certificate Signed",
        "message": "Admin Officer Patnaik signed your Bonafide Certificate request (#CERT-881). Ready for PDF download.",
        "type": "APPROVED",
        "category": "CERTIFICATE",
        "is_read": False,
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M"),
        "link_path": "/services/certificate"
    },
    {
        "id": "NOTIF-103",
        "user_id": "20000000-0000-0000-0000-000000000001",
        "title": "Maintenance Ticket Dispatched",
        "message": "Rajesh Kumar (HVAC Lead) accepted ticket #MT-8842 for C-Block Room 302.",
        "type": "IN_PROGRESS",
        "category": "MAINTENANCE",
        "is_read": True,
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M"),
        "link_path": "/services/maintenance"
    }
]

class CreateNotifPayload(BaseModel):
    user_id: Optional[str] = Field("20000000-0000-0000-0000-000000000001")
    title: str = Field(..., example="Lab Booking Approved")
    message: str = Field(..., example="Your AI Lab booking #LB-4019 is approved.")
    type: str = Field("APPROVED", example="APPROVED")
    category: str = Field("SYSTEM", example="LAB_BOOKING")
    link_path: Optional[str] = Field("/requests", example="/services/lab-booking")

class MarkReadPayload(BaseModel):
    notification_ids: Optional[List[str]] = Field(None)

def broadcast_notification_sync(notif: Dict[str, Any]):
    """
    Thread-safe synchronous helper to push real-time notifications to all SSE subscribers.
    """
    for queue in list(NOTIFICATION_LISTENERS):
        try:
            queue.put_nowait(notif)
        except Exception:
            pass

async def broadcast_notification_async(notif: Dict[str, Any]):
    """
    Asynchronously broadcasts a notification to all active SSE client queues.
    """
    for queue in list(NOTIFICATION_LISTENERS):
        try:
            await queue.put(notif)
        except Exception:
            pass

def dispatch_system_notification(
    title: str,
    message: str,
    user_id: str = "20000000-0000-0000-0000-000000000001",
    notif_type: str = "APPROVED",
    category: str = "SYSTEM",
    link_path: str = "/requests",
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Creates, persists (Supabase + Local DB), and broadcasts a real-time notification.
    """
    notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")

    new_notif = {
        "id": notif_id,
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": notif_type,
        "category": category,
        "is_read": False,
        "created_at": now_str,
        "link_path": link_path
    }

    # 1. Update in-memory store
    NOTIFICATIONS_STORE.insert(0, new_notif)

    # 2. Persist in local database if session provided
    if db is not None:
        try:
            db_notif = Notification(
                id=notif_id,
                user_id=user_id,
                title=title,
                message=message,
                category=category,
                is_read=False,
                link_path=link_path
            )
            db.add(db_notif)
            db.commit()
        except Exception as e:
            logger.warning(f"Local DB notification write notice: {e}")

    # 3. Persist in Supabase PostgreSQL Cloud
    try:
        supabase_insert("notifications", {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "message": message,
            "type": notif_type,
            "is_read": False,
            "link_path": link_path
        })
    except Exception as e:
        logger.warning(f"Supabase notification insert notice: {e}")

    # 4. Broadcast to active SSE listeners
    broadcast_notification_sync(new_notif)
    return new_notif

# =========================================================================
# SSE Streaming Endpoint
# =========================================================================

@router.get("/stream")
async def sse_notifications_stream(request: Request):
    """
    Server-Sent Events (SSE) Real-Time Notification Stream.
    Pushes instantaneous institutional alerts when approvals or state changes occur.
    """
    queue = asyncio.Queue()
    NOTIFICATION_LISTENERS.add(queue)

    async def event_generator():
        try:
            # 1. Initial Connection Ping
            initial_event = {
                "type": "CONNECTION_ESTABLISHED",
                "message": "Connected to SOA Nexus Real-Time Notification Engine (SSE)",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            yield f"event: ping\ndata: {json.dumps(initial_event)}\n\n"

            # 2. Continuous event stream
            while True:
                if await request.is_disconnected():
                    break
                try:
                    # Wait for next notification (15s timeout for heartbeats)
                    notif = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"event: notification\ndata: {json.dumps(notif)}\n\n"
                except asyncio.TimeoutError:
                    heartbeat = {
                        "type": "HEARTBEAT",
                        "status": "online",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                    yield f"event: heartbeat\ndata: {json.dumps(heartbeat)}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            NOTIFICATION_LISTENERS.discard(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# =========================================================================
# REST Endpoints
# =========================================================================

@router.get("")
async def get_notifications(user_id: Optional[str] = None):
    """
    Fetches persistent notifications with unread badge count.
    Queries Supabase cloud database with local fallback.
    """
    notifications = list(NOTIFICATIONS_STORE)
    
    # Check Supabase for recent notifications
    try:
        supa_records = supabase_select("notifications", limit=20)
        if supa_records:
            for s in supa_records:
                if not any(n["id"] == s.get("id") for n in notifications):
                    notifications.append({
                        "id": s.get("id"),
                        "user_id": s.get("user_id"),
                        "title": s.get("title", "Notification"),
                        "message": s.get("message", ""),
                        "type": s.get("type", "APPROVED"),
                        "category": "SYSTEM",
                        "is_read": s.get("is_read", False),
                        "created_at": str(s.get("created_at", ""))[:16].replace("T", " "),
                        "link_path": s.get("link_path", "/requests")
                    })
    except Exception:
        pass

    unread_count = sum(1 for n in notifications if not n.get("is_read", False))
    return {
        "unread_count": unread_count,
        "notifications": notifications
    }

@router.post("/create")
async def create_notification_endpoint(payload: CreateNotifPayload):
    """
    Dispatches a new notification and broadcasts it across live SSE streams.
    """
    return dispatch_system_notification(
        title=payload.title,
        message=payload.message,
        user_id=payload.user_id or "20000000-0000-0000-0000-000000000001",
        notif_type=payload.type,
        category=payload.category,
        link_path=payload.link_path or "/requests"
    )

@router.post("/mark-read")
async def mark_notifications_read_endpoint(payload: MarkReadPayload):
    """
    Marks selected or all notifications as read in both local and Supabase stores.
    """
    if payload.notification_ids:
        for n in NOTIFICATIONS_STORE:
            if n["id"] in payload.notification_ids:
                n["is_read"] = True
    else:
        for n in NOTIFICATIONS_STORE:
            n["is_read"] = True

    try:
        if payload.notification_ids:
            for nid in payload.notification_ids:
                supabase_update("notifications", {"id": nid}, {"is_read": True})
        else:
            supabase_update("notifications", {"is_read": False}, {"is_read": True})
    except Exception:
        pass

    unread_count = sum(1 for n in NOTIFICATIONS_STORE if not n.get("is_read", False))
    return {"status": "success", "unread_count": unread_count}

@router.post("/clear-all")
async def clear_all_notifications_endpoint():
    """
    Clears notifications list.
    """
    global NOTIFICATIONS_STORE
    NOTIFICATIONS_STORE = []
    return {"status": "success", "message": "All notifications cleared.", "unread_count": 0}

# Backward compatibility aliases
create_notification = create_notification_endpoint
mark_notifications_read = mark_notifications_read_endpoint
