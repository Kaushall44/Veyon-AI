import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

try:
    from backend.database.supabase_client import supabase_insert, supabase_update
except ImportError:
    try:
        from database.supabase_client import supabase_insert, supabase_update
    except ImportError:
        supabase_insert = None
        supabase_update = None

# Category Definitions
CATEGORIES = {
    "HVAC": "HVAC & Air Conditioning",
    "ELECTRICAL": "Electrical & Power Distribution",
    "PLUMBING": "Plumbing & Sanitation",
    "IT_INFRA": "Network & Audio-Visual Support",
    "FURNITURE": "Classroom & Civil Furniture"
}

# Maintenance Category Definitions & On-Duty Technician Rosters
MAINTENANCE_TEAMS = {
    "HVAC": {
        "name": "Estates Team - HVAC & Thermal Management",
        "lead": "Rajesh Kumar",
        "role": "HVAC Lead Technician",
        "contact": "+91 98610 23451",
        "backup": "Manoj Pattnaik (Senior Chiller Specialist)"
    },
    "ELECTRICAL": {
        "name": "Estates Team - Electrical & Power Distribution",
        "lead": "Suresh Jena",
        "role": "Senior Electrical Engineer",
        "contact": "+91 98610 34562",
        "backup": "Bikram Swain (Substation In-Charge)"
    },
    "PLUMBING": {
        "name": "Estates Team - Water Supply & Sanitation",
        "lead": "Pradeep Mohanty",
        "role": "Master Plumber & Pipefitter",
        "contact": "+91 98610 45673",
        "backup": "Gopal Charan Sahoo"
    },
    "IT_INFRA": {
        "name": "Network & Audio-Visual Support",
        "lead": "Alok Das",
        "role": "Systems & Network Specialist",
        "contact": "+91 98610 56784",
        "backup": "Smruti Ranjan Nayak"
    },
    "FURNITURE": {
        "name": "Estates Team - Civil, Carpentry & Infrastructure",
        "lead": "Kanhu Sahoo",
        "role": "Carpentry & Civil Supervisor",
        "contact": "+91 98610 67895",
        "backup": "Dillip Sethi"
    }
}

# In-Memory Maintenance Tickets Data Store
MAINTENANCE_TICKETS: List[Dict[str, Any]] = [
    {
        "ticket_id": "MT-8842",
        "request_id": "50000000-0000-0000-0000-000000000003",
        "location": "C-Block Room 302",
        "category": "HVAC",
        "issue_description": "The AC in C-Block Room 302 is leaking water and making noise.",
        "priority": "MEDIUM",
        "status": "IN_PROGRESS",  # NEW -> IN_PROGRESS -> RESOLVED
        "assigned_team": "Estates Team - HVAC & Thermal Management",
        "assigned_technician": "Rajesh Kumar (HVAC Lead Technician)",
        "technician_contact": "+91 98610 23451",
        "reporter_name": "Rahul Sharma (2023-CSE-042)",
        "created_at": "2026-08-24 09:00",
        "sla_hours": 8,
        "resolution_notes": None,
        "resolved_at": None,
        "simulated_photo_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop"
    }
]

def classify_priority(location: str, issue_description: str, category: str = "HVAC") -> Dict[str, Any]:
    """
    Automated Priority Matrix Classifier assigning URGENT, HIGH, MEDIUM, or LOW:
    
    1. URGENT (SLA <= 1 hour):
       - Server Room, Data Center, Substation, Transformer, UPS Room, HPC Cluster, Panel Board
       - Short circuit, fire hazard, sparking, smoke, gas leak, total electrical blackout, server overheating
    2. HIGH (SLA <= 4 hours):
       - Examination Hall, Central Library, GPU Lab C-204, Auditorium during live event
       - Major pipe burst, water flooding, lift/elevator malfunction, main power line trip
    3. MEDIUM (SLA <= 8 hours):
       - Regular classrooms (C-Block, D-Block, E-Block, Faculty Cabins)
       - AC water dripping/noise, classroom fan stopped/wobbling, washroom flush jammed, corridor light flickering
    4. LOW (SLA <= 24 hours):
       - Minor cosmetic or non-blocking issues: broken desk armrest, paint touchup, single bulb flickering, loose screw
    """
    loc = location.lower()
    desc = issue_description.lower()
    cat = category.upper()

    # Rule 1: Urgent Critical Facilities & Hazards
    urgent_locations = ["server room", "data center", "substation", "transformer", "ups room", "main panel", "hpc cluster"]
    urgent_keywords = ["short circuit", "spark", "sparking", "fire", "smoke", "gas leak", "blackout", "overheating", "explosion", "burnt", "server room ac", "ac failure in server room"]

    if any(ul in loc for ul in urgent_locations) or any(uk in desc for uk in urgent_keywords) or ("server room" in desc and "ac" in desc):
        return {
            "priority": "URGENT",
            "sla_hours": 1,
            "rationale": "High-risk critical facility (Server Room/Data Center/Substation) or acute safety hazard detected."
        }

    # Rule 2: High Priority Academic/Operational Disruption
    high_locations = ["exam hall", "examination", "gpu lab", "lab c-204", "auditorium", "central library", "hostel mess"]
    high_keywords = ["water burst", "flooding", "lift stuck", "elevator trapped", "pipe burst", "no power in whole floor", "projector dead before exam", "projector dead"]

    if any(hl in loc for hl in high_locations) or any(hk in desc for hk in high_keywords):
        return {
            "priority": "HIGH",
            "sla_hours": 4,
            "rationale": "High-impact academic or student facility disruption (High Priority Tier)."
        }

    # Rule 3: Low Priority Minor/Cosmetic
    low_keywords = ["broken chair", "desk armrest", "paint", "notice board", "bulb flickering", "loose screw", "door stopper", "minor scratch", "broken chair desk"]
    if any(lk in desc for lk in low_keywords) and not ("ac" in desc or "leak" in desc or "power" in desc or "fan" in desc):
        return {
            "priority": "LOW",
            "sla_hours": 24,
            "rationale": "Non-blocking aesthetic or minor furniture maintenance (Standard 24-hr SLA)."
        }

    # Rule 4: Default Medium (Classrooms, AC leaks, ceiling fan wobbles, etc.)
    return {
        "priority": "MEDIUM",
        "sla_hours": 8,
        "rationale": "Standard classroom or departmental utility maintenance (8-hr SLA)."
    }

def assign_technician(category: str, priority: str) -> Dict[str, str]:
    """Assigns specific on-duty technician based on trade category and priority urgency."""
    cat_key = category.upper()
    team = MAINTENANCE_TEAMS.get(cat_key, MAINTENANCE_TEAMS["HVAC"])

    tech_name = team["lead"]
    role = team["role"]

    if priority == "URGENT":
        return {
            "team": team["name"],
            "technician": f"{tech_name} ({role} - URGENT DISPATCH)",
            "contact": team["contact"]
        }
    
    return {
        "team": team["name"],
        "technician": f"{tech_name} ({role})",
        "contact": team["contact"]
    }

def create_maintenance_ticket(
    location: str,
    category: str,
    issue_description: str,
    reporter_name: str = "Rahul Sharma (2023-CSE-042)",
    photo_url: Optional[str] = None
) -> Dict[str, Any]:
    """Creates a new maintenance ticket, applies priority matrix, and dispatches estates lead."""
    classification = classify_priority(location, issue_description, category)
    assignment = assign_technician(category, classification["priority"])
    ticket_id = f"MT-{uuid.uuid4().hex[:4].upper()}"

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    ticket = {
        "ticket_id": ticket_id,
        "request_id": str(uuid.uuid4()),
        "location": location,
        "category": category.upper(),
        "issue_description": issue_description,
        "priority": classification["priority"],
        "sla_hours": classification["sla_hours"],
        "priority_rationale": classification["rationale"],
        "status": "NEW",
        "assigned_team": assignment["team"],
        "assigned_technician": assignment["technician"],
        "technician_contact": assignment["contact"],
        "reporter_name": reporter_name,
        "created_at": now_str,
        "resolution_notes": None,
        "resolved_at": None,
        "simulated_photo_url": photo_url or "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop"
    }

    MAINTENANCE_TICKETS.insert(0, ticket)

    # Sync to Supabase Cloud Table
    if supabase_insert:
        try:
            req_id = ticket["request_id"]
            # Map category to allowed enum: ELECTRICAL, HVAC, PLUMBING, CIVIL, IT
            db_cat = category.upper()
            if db_cat not in ["ELECTRICAL", "HVAC", "PLUMBING", "CIVIL", "IT"]:
                db_cat = "HVAC" if "HVAC" in db_cat else "IT" if "IT" in db_cat else "CIVIL"

            supabase_insert("service_requests", {
                "id": req_id,
                "user_id": "20000000-0000-0000-0000-000000000001",
                "service_type": "MAINTENANCE",
                "status": "PENDING_APPROVAL",
                "current_step": 1,
                "ai_plan": ticket
            })
            supabase_insert("maintenance_tickets", {
                "id": str(uuid.uuid4()),
                "request_id": req_id,
                "location": location,
                "category": db_cat,
                "priority": classification["priority"],
                "resolution_notes": None
            })
        except Exception:
            pass

    return ticket

def update_ticket_status(
    ticket_id: str,
    new_status: str,
    resolution_notes: Optional[str] = None,
    technician_name: Optional[str] = None
) -> Dict[str, Any]:
    """Updates status transitions: NEW -> IN_PROGRESS -> RESOLVED with proof notes."""
    ticket = next((t for t in MAINTENANCE_TICKETS if t["ticket_id"].upper() == ticket_id.upper()), None)
    if not ticket:
        # Fallback create or update first
        if len(MAINTENANCE_TICKETS) > 0:
            ticket = MAINTENANCE_TICKETS[0]
        else:
            raise ValueError(f"Ticket ID '{ticket_id}' not found in active maintenance queue.")

    normalized_status = new_status.upper()
    ticket["status"] = normalized_status
    
    if technician_name:
        ticket["assigned_technician"] = technician_name
    if resolution_notes:
        ticket["resolution_notes"] = resolution_notes
    if normalized_status == "RESOLVED":
        ticket["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    return ticket
