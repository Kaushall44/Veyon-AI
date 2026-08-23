from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from tools.maintenance_tools import (
    MAINTENANCE_TICKETS,
    create_maintenance_ticket,
    update_ticket_status,
    classify_priority
)

router = APIRouter(prefix="/maintenance", tags=["Maintenance Ticketing Service"])

class CreateTicketPayload(BaseModel):
    location: str = Field("C-Block Room 302", example="C-Block Room 302")
    category: str = Field("HVAC", example="HVAC")
    issue_description: str = Field("The AC in C-Block Room 302 is leaking water and making noise.", example="AC leaking water")
    reporter_name: Optional[str] = Field("Rahul Sharma")
    photo_url: Optional[str] = Field(None)

class UpdateStatusPayload(BaseModel):
    ticket_id: str = Field("MT-8842", example="MT-8842")
    new_status: str = Field("In_Progress", example="In_Progress")  # New -> In_Progress -> Resolved
    resolution_notes: Optional[str] = Field("Replaced AC drain pipe gasket and verified cooling cycle.", example="Replaced drain pipe")
    technician_name: Optional[str] = Field("Rajesh Kumar (HVAC Lead)")

@router.get("/tickets")
async def get_tickets():
    """Returns queue of campus infrastructure maintenance tickets."""
    return MAINTENANCE_TICKETS

@router.post("/create")
async def create_ticket(payload: CreateTicketPayload):
    """
    Submits maintenance issue, auto-classifies priority, and assigns Estates technician.
    """
    return create_maintenance_ticket(
        location=payload.location,
        category=payload.category,
        issue_description=payload.issue_description,
        reporter_name=payload.reporter_name or "Rahul Sharma",
        photo_url=payload.photo_url
    )

@router.post("/update-status")
async def update_status(payload: UpdateStatusPayload):
    """
    Updates maintenance ticket status transition (New -> In_Progress -> Resolved) with proof notes.
    """
    try:
        return update_ticket_status(
            ticket_id=payload.ticket_id,
            new_status=payload.new_status,
            resolution_notes=payload.resolution_notes,
            technician_name=payload.technician_name or "Rajesh Kumar"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
