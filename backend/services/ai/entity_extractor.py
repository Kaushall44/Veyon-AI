import re
from datetime import datetime, timedelta
from typing import Dict, Any
from schemas.chat_schemas import ExtractedEntities

def extract_entities_from_prompt(prompt: str, intent: str) -> ExtractedEntities:
    """
    Extracts structured entities (dates, times, lab IDs, locations, categories) 
    from user prompt using pattern extraction and date normalization.
    """
    prompt_lower = prompt.lower()
    entities = ExtractedEntities()

    # 1. Date Extraction & Normalization
    now = datetime.now()
    if "tomorrow" in prompt_lower:
        entities.date = (now + timedelta(days=1)).strftime("%Y-%m-%d")
    elif "today" in prompt_lower:
        entities.date = now.strftime("%Y-%m-%d")
    else:
        # Check ISO date format YYYY-MM-DD
        iso_match = re.search(r'\b\d{4}-\d{2}-\d{2}\b', prompt)
        if iso_match:
            entities.date = iso_match.group(0)
        else:
            # Fallback default date: tomorrow
            entities.date = (now + timedelta(days=1)).strftime("%Y-%m-%d")

    # 2. Time Range Extraction (e.g. "2 PM to 4 PM", "14:00 to 16:00", "2 to 4 PM")
    time_range_match = re.search(r'(\d{1,2})\s*(?:am|pm)?\s*(?:to|-|until)\s*(\d{1,2})\s*(am|pm)', prompt_lower)
    if time_range_match:
        start_h = int(time_range_match.group(1))
        end_h = int(time_range_match.group(2))
        meridiem = time_range_match.group(3)

        if meridiem == 'pm':
            if start_h < 12:
                start_h += 12
            if end_h < 12:
                end_h += 12

        entities.start_time = f"{start_h:02d}:00"
        entities.end_time = f"{end_h:02d}:00"
    else:
        # Defaults if unspecified
        entities.start_time = "14:00"
        entities.end_time = "16:00"

    # 3. Lab Mapping
    if "ai lab" in prompt_lower or "artificial intelligence lab" in prompt_lower:
        entities.lab_name = "Advanced AI Lab"
        entities.lab_id = "LAB-AI-101"
    elif "microelectronics" in prompt_lower:
        entities.lab_name = "Microelectronics Lab"
        entities.lab_id = "LAB-MICRO-202"
    elif "cad" in prompt_lower:
        entities.lab_name = "Mechanical CAD Kiosk"
        entities.lab_id = "LAB-CAD-103"
    else:
        if intent == "LAB_BOOKING":
            entities.lab_name = "Advanced AI Lab"
            entities.lab_id = "LAB-AI-101"

    # 4. Certificate Type
    if "bonafide" in prompt_lower:
        entities.certificate_type = "BONAFIDE"
    elif "conduct" in prompt_lower:
        entities.certificate_type = "CONDUCT"
    elif intent == "CERTIFICATE":
        entities.certificate_type = "BONAFIDE"

    # 5. Maintenance Location & Category
    if "c-block" in prompt_lower or "room 302" in prompt_lower or "lab 3" in prompt_lower:
        entities.location = "C-Block Room 302"
    elif intent == "MAINTENANCE":
        entities.location = "Academic Block C, Room 302"

    if "ac" in prompt_lower or "air conditioning" in prompt_lower or "hvac" in prompt_lower:
        entities.category = "HVAC"
        entities.priority = "HIGH" if "leak" in prompt_lower else "MEDIUM"
    elif "light" in prompt_lower or "fan" in prompt_lower or "socket" in prompt_lower:
        entities.category = "ELECTRICAL"
        entities.priority = "MEDIUM"
    elif "water" in prompt_lower or "pipe" in prompt_lower:
        entities.category = "PLUMBING"
        entities.priority = "HIGH"

    # 6. Purpose Extraction
    if "passport" in prompt_lower:
        entities.purpose = "Passport Application"
    elif "loan" in prompt_lower or "bank" in prompt_lower:
        entities.purpose = "Bank Education Loan Application"
    elif "project" in prompt_lower:
        entities.purpose = "B.Tech Capstone Project Work"
    else:
        entities.purpose = "Institutional Purpose"

    return entities
