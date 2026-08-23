import uuid
from typing import Dict, Any, List

# Maintenance Categories
CATEGORIES = {
    "HVAC": "Heating, Ventilation & Air Conditioning",
    "ELECTRICAL": "Electrical & Lighting",
    "PLUMBING": "Plumbing & Sanitation",
    "FURNITURE": "Classroom Furniture & Carpentry",
    "IT_INFRA": "Network & Audio/Visual Equipment"
}

# Initial In-Memory Maintenance Tickets Data Store
MAINTENANCE_TICKETS: List[Dict[str, Any]] = [
    {
        "ticket_id": "MT-8842",
        "request_id": "50000000-0000-0000-0000-000000000003",
        "location": "C-Block Room 302",
        "category": "HVAC",
        "issue_description": "The AC in C-Block Room 302 is leaking water and making noise.",
        "priority": "Medium",
        "status": "New",  # New -> In_Progress -> Resolved
        "assigned_team": "Estates Team - HVAC Wing",
        "assigned_technician": "Rajesh Kumar (HVAC Lead)",
        "reporter_name": "Rahul Sharma (2023-CSE-042)",
        "created_at": "2026-08-23 14:00",
        "resolution_notes": None,
        "resolved_at": None,
        "simulated_photo_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop"
    }
]

def classify_priority(location: str, issue_description: str, category: str) -> str:
    """
    Automatic priority classification matrix:
    - Server room / Main electrical board / Fire hazard -> Urgent
    - Lab / Classroom AC leak / Power trip -> High / Medium
    - Minor furniture / Light bulb -> Low
    """
    desc_lower = issue_description.lower()
    loc_lower = location.lower()

    if "server room" in loc_lower or "short circuit" in desc_lower or "fire" in desc_lower or "substation" in loc_lower:
        return "Urgent"
    elif "leaking" in desc_lower or "ac" in desc_lower or "power trip" in desc_lower or "water leak" in desc_lower:
        return "Medium"
    elif "broken chair" in desc_lower or "bulb" in desc_lower or "fan noise" in desc_lower:
        return "Low"
    return "Medium"

def create_maintenance_ticket(
    location: str,
    category: str,
    issue_description: str,
    reporter_name: str = "Rahul Sharma",
    photo_url: str = None
) -> Dict[str, Any]:
    """Creates a new maintenance ticket and auto-assigns technician and priority."""
    priority = classify_priority(location, issue_description, category)
    ticket_code = f"MT-{uuid.uuid4().hex[:4].upper()}"

    ticket = {
        "ticket_id": ticket_code,
        "request_id": str(uuid.uuid4()),
        "location": location,
        "category": category,
        "issue_description": issue_description,
        "priority": priority,
        "status": "New",
        "assigned_team": "Estates Team - Mechanical & HVAC",
        "assigned_technician": "Rajesh Kumar (HVAC Lead)",
        "reporter_name": reporter_name,
        "created_at": "2026-08-23 14:05",
        "resolution_notes": None,
        "resolved_at": None,
        "simulated_photo_url": photo_url or "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop"
    }

    MAINTENANCE_TICKETS.append(ticket)
    return ticket

def update_ticket_status(
    ticket_id: str,
    new_status: str,
    resolution_notes: str = None,
    technician_name: str = "Rajesh Kumar"
) -> Dict[str, Any]:
    """Updates status transitions: New -> In_Progress -> Resolved with resolution notes."""
    ticket = next((t for t in MAINTENANCE_TICKETS if t["ticket_id"] == ticket_id), None)
    if not ticket:
        raise ValueError(f"Ticket ID '{ticket_id}' not found.")

    ticket["status"] = new_status
    if technician_name:
        ticket["assigned_technician"] = technician_name
    if resolution_notes:
        ticket["resolution_notes"] = resolution_notes
    if new_status == "Resolved":
        ticket["resolved_at"] = "2026-08-23 14:30"

    return ticket
