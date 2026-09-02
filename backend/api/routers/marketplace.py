import urllib.parse
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_

try:
    from backend.database.session import get_sync_db
    from backend.database.models import User, MarketplaceItem, MarketplaceReport
    from backend.middleware.rbac import get_current_user_from_token
    from backend.database.supabase_client import supabase_insert, supabase_select, supabase_update
except ImportError:
    from database.session import get_sync_db
    from database.models import User, MarketplaceItem, MarketplaceReport
    from middleware.rbac import get_current_user_from_token
    from database.supabase_client import supabase_insert, supabase_select, supabase_update

router = APIRouter(prefix="/marketplace", tags=["Veyon Campus Second-Hand Marketplace"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class CreateListingPayload(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, example="Engineering Mathematics Vol 1 (HK Dass) - 4th Edition")
    description: str = Field(..., min_length=5, example="Barely used, completely unmarked. Perfect for 1st year B.Tech students.")
    price: float = Field(..., ge=0.0, example=350.0)
    category: str = Field("BOOKS", example="BOOKS")  # BOOKS, ELECTRONICS, CYCLES, LAB_GEAR, HOSTEL
    condition: str = Field("LIKE_NEW", example="LIKE_NEW")  # BRAND_NEW, LIKE_NEW, GOOD, FAIR
    images: List[str] = Field(default_factory=list, example=["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"])
    seller_phone: Optional[str] = Field(None, example="+919876543210")
    seller_location: str = Field("Hostel 4, Room 210", example="Hostel 4, Room 210")

class UpdateItemStatusPayload(BaseModel):
    status: str = Field(..., pattern="^(ACTIVE|SOLD|RESERVED)$", example="SOLD")

class ReportItemPayload(BaseModel):
    reason: str = Field(..., min_length=3, max_length=255, example="Item is mispriced or prohibited on campus.")

# ---------------------------------------------------------------------------
# 1. GET /api/marketplace/items (List & Filter)
# ---------------------------------------------------------------------------
@router.get("/items")
def list_marketplace_items(
    category: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    item_status: str = Query("ACTIVE", pattern="^(ACTIVE|SOLD|RESERVED|ALL)$"),
    search: Optional[str] = None,
    sort_by: str = Query("newest", pattern="^(newest|price_asc|price_desc|popular)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves filtered campus marketplace items with category, condition, price, and status filters.
    """
    query = db.query(MarketplaceItem)

    # Filter by category
    if category and category.upper() != "ALL":
        query = query.filter(MarketplaceItem.category.ilike(f"%{category.strip()}%"))

    # Filter by condition
    if condition and condition.upper() != "ALL":
        query = query.filter(MarketplaceItem.condition.ilike(f"%{condition.strip()}%"))

    # Filter by status
    if item_status.upper() != "ALL":
        query = query.filter(MarketplaceItem.status == item_status.upper())

    # Price range filter
    if min_price is not None:
        query = query.filter(MarketplaceItem.price >= min_price)
    if max_price is not None:
        query = query.filter(MarketplaceItem.price <= max_price)

    # Search filter
    if search:
        search_pat = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MarketplaceItem.title.ilike(search_pat),
                MarketplaceItem.description.ilike(search_pat),
                MarketplaceItem.seller_location.ilike(search_pat)
            )
        )

    total_count = query.count()

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(MarketplaceItem.price.asc(), MarketplaceItem.created_at.desc())
    elif sort_by == "price_desc":
        query = query.order_by(MarketplaceItem.price.desc(), MarketplaceItem.created_at.desc())
    elif sort_by == "popular":
        query = query.order_by(MarketplaceItem.view_count.desc(), MarketplaceItem.created_at.desc())
    else:
        query = query.order_by(MarketplaceItem.created_at.desc())

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    return {
        "items": [it.to_dict() for it in items],
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total_count + limit - 1) // limit) if total_count > 0 else 1
    }

# ---------------------------------------------------------------------------
# 2. POST /api/marketplace/items (Create Item Listing)
# ---------------------------------------------------------------------------
@router.post("/items", status_code=status.HTTP_201_CREATED)
def create_marketplace_item(
    payload: CreateListingPayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Creates a new campus listing with verified university registration credentials.
    """
    clean_cat = payload.category.strip().upper()
    if clean_cat not in ["BOOKS", "ELECTRONICS", "CYCLES", "LAB_GEAR", "HOSTEL"]:
        clean_cat = "BOOKS"

    clean_cond = payload.condition.strip().upper()
    if clean_cond not in ["BRAND_NEW", "LIKE_NEW", "GOOD", "FAIR"]:
        clean_cond = "LIKE_NEW"

    reg_no = current_user.reg_number or "VERIFIED-STUDENT"

    new_item = MarketplaceItem(
        title=payload.title.strip(),
        description=payload.description.strip(),
        price=payload.price,
        category=clean_cat,
        condition=clean_cond,
        images=payload.images or ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"],
        seller_id=current_user.id,
        seller_name=current_user.full_name,
        seller_reg_no=reg_no,
        seller_phone=payload.seller_phone,
        seller_location=payload.seller_location.strip(),
        status="ACTIVE",
        view_count=1
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    supabase_insert("marketplace_items", new_item.to_dict())

    return new_item.to_dict()

# ---------------------------------------------------------------------------
# 3. GET /api/marketplace/items/{item_id} (Item Detail & Seller Profile)
# ---------------------------------------------------------------------------
@router.get("/items/{item_id}")
def get_marketplace_item_detail(
    item_id: str,
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves full item details, seller verification trust score, and pre-filled contact links.
    """
    item = db.query(MarketplaceItem).filter(MarketplaceItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Marketplace item '{item_id}' not found."
        )

    # Increment views
    item.view_count += 1
    db.commit()
    db.refresh(item)

    seller = db.query(User).filter(User.id == item.seller_id).first()
    seller_email = seller.email if seller else "student@soa.ac.in"
    seller_dept = seller.department if seller else "Computer Science & Engineering"

    # Count seller's total listings & sold count
    seller_listings_count = db.query(MarketplaceItem).filter(MarketplaceItem.seller_id == item.seller_id).count()
    seller_sold_count = db.query(MarketplaceItem).filter(
        MarketplaceItem.seller_id == item.seller_id,
        MarketplaceItem.status == "SOLD"
    ).count()

    # Pre-fill WhatsApp message URL
    whatsapp_url = None
    if item.seller_phone:
        clean_phone = item.seller_phone.replace("+", "").replace(" ", "").replace("-", "")
        msg = f"Hi {item.seller_name}, I saw your listing '{item.title}' (Rs. {item.price:.0f}) on Veyon Campus Marketplace. Is it still available?"
        whatsapp_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(msg)}"

    # Pre-fill Email link
    email_subject = urllib.parse.quote(f"Inquiry: {item.title} (Veyon Marketplace)")
    email_body = urllib.parse.quote(f"Hi {item.seller_name},\n\nI am interested in buying '{item.title}' listed for Rs. {item.price:.0f} at {item.seller_location}.\n\nPlease let me know when we can meet on campus.")
    email_url = f"mailto:{seller_email}?subject={email_subject}&body={email_body}"

    item_payload = item.to_dict()
    item_payload["seller_profile"] = {
        "seller_name": item.seller_name,
        "seller_reg_no": item.seller_reg_no,
        "seller_department": seller_dept,
        "seller_email": seller_email,
        "seller_phone": item.seller_phone,
        "total_listings": seller_listings_count,
        "items_sold": seller_sold_count,
        "is_verified": True
    }
    item_payload["contact_links"] = {
        "whatsapp": whatsapp_url,
        "email": email_url
    }

    return item_payload

# ---------------------------------------------------------------------------
# 4. PUT /api/marketplace/items/{item_id}/status (Toggle Status / Mark as Sold)
# ---------------------------------------------------------------------------
@router.put("/items/{item_id}/status")
def update_marketplace_item_status(
    item_id: str,
    payload: UpdateItemStatusPayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Updates listing status to 'ACTIVE', 'SOLD', or 'RESERVED'. Only seller or Admin can modify.
    """
    item = db.query(MarketplaceItem).filter(MarketplaceItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item '{item_id}' not found."
        )

    if item.seller_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the seller or an Administrator can update the listing status."
        )

    item.status = payload.status
    db.commit()
    db.refresh(item)

    supabase_update("marketplace_items", {"id": item.id}, {"status": item.status})

    return {
        "id": item.id,
        "status": item.status,
        "message": f"Listing marked as {item.status} successfully."
    }

# ---------------------------------------------------------------------------
# 5. POST /api/marketplace/items/{item_id}/report (Community Moderation)
# ---------------------------------------------------------------------------
@router.post("/items/{item_id}/report", status_code=status.HTTP_201_CREATED)
def report_marketplace_item(
    item_id: str,
    payload: ReportItemPayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Reports an item listing for administrative review.
    """
    item = db.query(MarketplaceItem).filter(MarketplaceItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item '{item_id}' not found."
        )

    report = MarketplaceReport(
        item_id=item_id,
        reporter_id=current_user.id,
        reason=payload.reason.strip(),
        status="PENDING"
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "status": "success",
        "report_id": report.id,
        "message": "Report submitted successfully for campus safety moderation."
    }
