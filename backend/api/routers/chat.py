from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from schemas.chat_schemas import ChatRequest, ChatResponse, ExtractedEntities, IntentResult
from services.ai.intent_classifier import classify_intent
from services.ai.entity_extractor import extract_entities_from_prompt as extract_entities
from services.ai.agent_planner import generate_action_plan
from services.ai.safety_guardrails import sanitize_prompt, check_role_authorization
from services.ai.multilingual_engine import (
    detect_language,
    translate_to_canonical_english,
    translate_response_to_native
)

router = APIRouter(prefix="/chat", tags=["AI Chat & NLU Pipeline"])

@router.post("", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Main AI endpoint handling Multilingual translation, NLU intent detection, prompt sanitization, policy RAG, and ReAct plan generation.
    """
    user_prompt = request.prompt.strip()
    if not user_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty."
        )

    # 1. Multilingual Translation Pipeline to Canonical English
    trans_res = translate_to_canonical_english(user_prompt)
    canonical_prompt = trans_res["canonical_text"]
    detected_lang = trans_res["source_language"]

    # 2. Prompt Injection Sanitization Guardrail
    sanitization = sanitize_prompt(canonical_prompt)
    if not sanitization["is_safe"]:
        return ChatResponse(
            detected_intent=IntentResult(
                intent="UNKNOWN",
                confidence=0.0,
                reasoning=sanitization["refusal_message"]
            ),
            extracted_entities=ExtractedEntities(),
            suggested_action=f"BLOCKED: {sanitization['violation_type']}",
            response_text=sanitization["refusal_message"]
        )

    # 3. Intent Classification (Executed on Canonical English)
    intent_name, confidence = classify_intent(canonical_prompt)
    intent_result = IntentResult(intent=intent_name, confidence=confidence, reasoning="NLU Classifier")

    # 4. Role Pre-Check Authorization Guardrail
    auth_check = check_role_authorization(request.user_role or "Student", intent_result.intent)
    if not auth_check["is_authorized"]:
        return ChatResponse(
            detected_intent=intent_result,
            extracted_entities=ExtractedEntities(),
            suggested_action="UNAUTHORIZED_ROLE",
            response_text=f"Access Denied: {auth_check['reason']}"
        )

    # 5. Entity Extraction
    entities = extract_entities(canonical_prompt, intent_result.intent)

    # 6. ReAct Action Plan Generation
    action_plan = generate_action_plan(intent_result.intent, entities.model_dump())

    english_response = f"Parsed intent '{intent_result.intent}' ({intent_result.confidence*100:.0f}% confidence)."

    # 7. Translate Response back to Native Script (Odia / Hindi / English)
    native_response = translate_response_to_native(english_response, intent_result.intent, detected_lang)

    return ChatResponse(
        detected_intent=intent_result,
        extracted_entities=entities,
        suggested_action=action_plan.summary if action_plan else None,
        response_text=native_response
    )
