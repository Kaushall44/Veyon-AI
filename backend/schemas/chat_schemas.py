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
    user_role: Optional[str] = Field("Student", example="Student")

class IntentResult(BaseModel):
    intent: Optional[str] = Field(None, example="LAB_BOOKING")
    confidence: Optional[float] = Field(None, example=0.98)
    reasoning: Optional[str] = Field(None, example="NLU Classifier")
    detected_intent: Optional[str] = Field(None, example="LAB_BOOKING")
    intent_confidence: Optional[float] = Field(None, example=0.98)
    extracted_entities: Optional[ExtractedEntities] = None

class ChatResponse(BaseModel):
    response_type: Optional[str] = Field("INTENT_CLASSIFIED", example="INTENT_CLASSIFIED")
    message: Optional[str] = Field(None, example="Intent classified as LAB_BOOKING")
    intent: Optional[str] = Field(None, example="LAB_BOOKING")
    intent_confidence: Optional[float] = Field(None, example=0.98)
    entities: Optional[Dict[str, Any]] = None
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    action_plan: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None
    
    # Supporting fields
    detected_intent: Optional[IntentResult] = None
    extracted_entities: Optional[ExtractedEntities] = None
    suggested_action: Optional[str] = None
    response_text: Optional[str] = None
    thought: Optional[str] = None
    risk_level: Optional[str] = None
    requires_approval: Optional[bool] = None
    is_uncertainty_refusal: Optional[bool] = Field(False, description="Flag indicating retrieval confidence was below 0.82 threshold")
    refusal_reason: Optional[str] = None
    department_contact: Optional[Dict[str, Any]] = None
