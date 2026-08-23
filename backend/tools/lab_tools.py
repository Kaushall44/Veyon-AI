import uuid
from typing import Dict, Any, List

# Lab Catalog Data Store
LAB_CATALOG: Dict[str, Dict[str, Any]] = {
    "LAB-AI-101": {
        "lab_id": "LAB-AI-101",
        "name": "Advanced AI & GPU Computing Lab",
        "room_no": "C-204",
        "building": "C-Block 2nd Floor",
        "total_workstations": 30,
        "gpu_nodes": "NVIDIA A100 / RTX 4090",
        "prerequisites": ["CS301 Machine Learning"],
        "max_booking_hours": 3,
        "is_active": True,
    },
    "LAB-MICRO-202": {
        "lab_id": "LAB-MICRO-202",
        "name": "Microelectronics & VLSI Design Lab",
        "room_no": "C-202",
        "building": "C-Block 2nd Floor",
        "total_workstations": 25,
        "equipment": "Cadence / Xilinx FPGA Kits",
        "prerequisites": ["EC202 VLSI Design"],
        "max_booking_hours": 3,
        "is_active": True,
    },
    "LAB-CAD-103": {
        "lab_id": "LAB-CAD-103",
        "name": "Mechanical CAD & 3D Modeling Kiosk",
        "room_no": "C-103",
        "building": "C-Block 1st Floor",
        "total_workstations": 20,
        "equipment": "SolidWorks / ANSYS Workstations",
        "prerequisites": ["ME101 Engineering Graphics"],
        "max_booking_hours": 2,
        "is_active": True,
    },
}

# Bookings Storage Engine
EXISTING_BOOKINGS: List[Dict[str, Any]] = [
    {
        "booking_id": "BK-60001",
        "lab_id": "LAB-AI-101",
        "student_id": "u1000000-0000-0000-0000-000000000001",
        "student_name": "Kaushal Raj Gupta",
        "date": "2026-08-24",
        "start_time": "14:00",
        "end_time": "16:00",
        "purpose": "B.Tech Capstone Project Work",
        "status": "APPROVED",
        "access_pass_code": "PASS-LAB-AI-88192"
    }
]

def get_lab_catalog() -> List[Dict[str, Any]]:
    return list(LAB_CATALOG.values())

def check_lab_availability(lab_id: str, date: str, start_time: str, end_time: str) -> Dict[str, Any]:
    """
    Checks slot availability for a given lab, date, and time range.
    Validates capacity (30 max) and double-booking prevention rules.
    """
    if lab_id not in LAB_CATALOG:
        return {
            "available": False,
            "error": f"Lab ID '{lab_id}' not found in catalog.",
            "free_seats": 0
        }

    lab = LAB_CATALOG[lab_id]
    
    # Count overlapping bookings for the exact slot
    overlapping_count = 0
    for bk in EXISTING_BOOKINGS:
        if bk["lab_id"] == lab_id and bk["date"] == date and bk["status"] == "APPROVED":
            # Check time overlap
            if not (end_time <= bk["start_time"] or start_time >= bk["end_time"]):
                overlapping_count += 1

    free_seats = lab["total_workstations"] - overlapping_count
    available = free_seats > 0

    return {
        "available": available,
        "lab_id": lab_id,
        "lab_name": lab["name"],
        "room_no": lab["room_no"],
        "date": date,
        "start_time": start_time,
        "end_time": end_time,
        "total_seats": lab["total_workstations"],
        "booked_seats": overlapping_count,
        "free_seats": free_seats,
        "prerequisites": lab["prerequisites"]
    }

def commit_lab_booking(request_id: str, student_name: str, lab_id: str, date: str, start_time: str, end_time: str, purpose: str, approver_name: str = "Prof. A. K. Samanta") -> Dict[str, Any]:
    """
    Tool execution called upon Faculty Approval.
    Commits slot to database and returns generated Digital Access Permit.
    """
    avail = check_lab_availability(lab_id, date, start_time, end_time)
    if not avail["available"]:
        raise ValueError(f"Cannot commit booking: {avail['lab_name']} is fully booked for this slot.")

    access_pass_code = f"PASS-LAB-AI-{uuid.uuid4().hex[:6].upper()}"
    qr_payload = f"SOA-NEXUS-PASS|{access_pass_code}|{lab_id}|{date}|{start_time}-{end_time}|{student_name}"

    booking_record = {
        "booking_id": f"BK-{uuid.uuid4().hex[:5].upper()}",
        "request_id": request_id,
        "lab_id": lab_id,
        "lab_name": avail["lab_name"],
        "room_no": avail["room_no"],
        "student_name": student_name,
        "date": date,
        "start_time": start_time,
        "end_time": end_time,
        "purpose": purpose,
        "status": "APPROVED",
        "approver_name": approver_name,
        "access_pass_code": access_pass_code,
        "qr_payload": qr_payload,
        "usage_guidelines": [
            "Mandatory: Carry physical SOA Student ID card.",
            "Permit auto-terminates strictly at end of slot time.",
            "Food and beverages strictly prohibited inside GPU computing lab."
        ]
    }

    EXISTING_BOOKINGS.append(booking_record)
    return booking_record
