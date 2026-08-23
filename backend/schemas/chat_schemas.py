from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ExtractedEntities(BaseModel):
    lab_id: Optional[str] = Field(None, description="Mapped Laboratory ID e.g. LAB-AI-101")
    lab_name: Optional[str] = Field(None, description="Natural lab name e.g. AI Lab")
    date: Optional[str] = Field(None, description="Target ISO date YYYY-MM-DD")
    start_time: Optional[str] = Field(None, description="Start time HH:MM (24h format)")
    end_time: Optional[str] = Field(None, description="End time HH:MM (24h format)")
    purpose: Optional[str] = Field(None, description="Stated purpose of request")
    certificate_type: Optional[str] = Field(None, description="BONAFIDE, CONDUCT, etc.")
    location: Optional[str] = Field(None, description="Physical room/block location")
    category: Optional[str] = Field(None, description="ELECTRICAL, HVAC, PLUMBING, etc.")
    priority: Optional[str] = Field(None, description="LOW, MEDIUM, HIGH, URGENT")
    grievance_category: Optional[str] = Field(None, description="Academic, Infrastructure, etc.")
    is_anonymous: Optional[bool] = Field(False, description="Anonymous flag for grievance")

class ChatRequest(BaseModel):
    prompt: str = Field(..., example="I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.")
    session_id: Optional[str] = Field("SES-DEFAULT", example="SES-88192")
    language: Optional[str] = Field("en", example="en")

class IntentResult(BaseModel):
    detected_intent: str = Field(..., example="LAB_BOOKING")
    intent_confidence: float = Field(..., example=0.98)
    extracted_entities: ExtractedEntities

class ChatResponse(BaseModel):
    response_type: str = Field(..., example="INTENT_CLASSIFIED")
    message: str = Field(..., example="Intent classified as LAB_BOOKING")
    intent: str = Field(..., example="LAB_BOOKING")
    intent_confidence: float = Field(..., example=0.98)
    entities: Dict[str, Any]
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    action_plan: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None
