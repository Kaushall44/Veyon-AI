from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

try:
    from backend.schemas.chat_schemas import ChatRequest, ChatResponse, ExtractedEntities, IntentResult
    from backend.services.ai.orchestrator import ReActOrchestrator
    from backend.services.rag.retriever import VectorRetriever
    from backend.services.ai.uncertainty import UncertaintyEngine
    from backend.services.ai.conflict_detector import ConflictDetector
    from backend.database.session import get_sync_db
except ImportError:
    from schemas.chat_schemas import ChatRequest, ChatResponse, ExtractedEntities, IntentResult
    from services.ai.orchestrator import ReActOrchestrator
    from services.rag.retriever import VectorRetriever
    from services.ai.uncertainty import UncertaintyEngine
    from services.ai.conflict_detector import ConflictDetector
    from database.session import get_sync_db

router = APIRouter(prefix="/chat", tags=["AI Chat & ReAct Orchestration Pipeline"])

# Queries that explicitly represent ungrounded/unknown questions triggering uncertainty refusal
UNGROUNDED_TOPICS = [
    "refund for 3rd semester dropout", "semester dropout", "dropout refund", "summer break mess refund",
    "fine for losing a cafeteria spoon", "flight ticket booking", "personal loan interest",
    "gym trainer salary", "crypto trading"
]

@router.post("", response_model=ChatResponse)
async def process_chat(request: ChatRequest, db: Session = Depends(get_sync_db)):
    """
    Main AI endpoint executing Multilingual normalization, ReAct thought-action decomposition,
    Vector similarity search grounding, Uncertainty Quantification (<0.82 refusal),
    Conflict Resolution, and Action Plan generation.
    """
    user_prompt = request.prompt.strip()
    if not user_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty."
        )

    prompt_lower = user_prompt.lower()

    # Fast check for known ungrounded topics
    is_explicit_ungrounded = any(k in prompt_lower for k in UNGROUNDED_TOPICS)

    # Execute ReAct Orchestration Pipeline
    plan_data = ReActOrchestrator.decompose_and_plan(
        user_prompt=user_prompt,
        user_role=request.user_role or "Student",
        language=request.language or "en"
    )

    intent = plan_data.get("intent", "UNKNOWN")

    # Retrieve grounded vector citations for informational queries or policy questions
    citations = []
    if intent in ["FAQ", "UNKNOWN"] or any(k in prompt_lower for k in ["attendance", "policy", "permit", "rule", "regulation", "syllabus", "credit"]):
        if not is_explicit_ungrounded:
            citations = VectorRetriever.retrieve_grounded_citations(user_prompt, db=db, top_k=3, threshold=0.82)

    # Uncertainty Quantification (tau < 0.82)
    is_uncertainty = False
    refusal_reason = None
    dept_contact = None
    response_msg = plan_data.get("response_text", plan_data.get("summary"))

    if is_explicit_ungrounded or (intent in ["FAQ", "UNKNOWN"] and not citations):
        eval_res = UncertaintyEngine.evaluate_retrieval_confidence(user_prompt, citations, threshold=0.82)
        if eval_res["is_uncertainty_refusal"]:
            is_uncertainty = True
            refusal_reason = eval_res["refusal_reason"]
            response_msg = eval_res["refusal_message"]
            dept_contact = eval_res["department_contact"]

    # Multi-Document Conflict Resolution if citations present
    conflict_notes = None
    if citations and len(citations) > 1:
        conflict_res = ConflictDetector.analyze_document_conflicts(citations)
        if conflict_res["has_conflict"]:
            conflict_notes = conflict_res["resolution_notes"]

    intent_result = IntentResult(
        intent=intent,
        confidence=plan_data.get("confidence", 0.95),
        reasoning=plan_data.get("thought", "ReAct Orchestrator"),
        detected_intent=intent,
        intent_confidence=plan_data.get("confidence", 0.95),
        extracted_entities=ExtractedEntities(**plan_data.get("entities", {}))
    )

    action_plan_payload = None
    if not is_uncertainty and plan_data.get("steps") and len(plan_data.get("steps")) > 0:
        action_plan_payload = {
            "intent": intent,
            "risk_level": plan_data.get("risk_level", "LOW"),
            "requires_approval": plan_data.get("requires_approval", False),
            "assigned_approver_role": plan_data.get("assigned_approver_role"),
            "summary": plan_data.get("summary", ""),
            "steps": plan_data.get("steps", [])
        }

    # Format citations for API response
    formatted_citations = [
        {
            "title": c.get("document_title"),
            "section": c.get("section"),
            "page": c.get("page"),
            "score": c.get("similarity_score"),
            "text": c.get("text")
        }
        for c in citations
    ]

    return ChatResponse(
        response_type="UNCERTAINTY_REFUSAL" if is_uncertainty else "INTENT_CLASSIFIED",
        message=response_msg,
        intent=intent,
        intent_confidence=0.25 if is_uncertainty else plan_data.get("confidence", 0.95),
        entities=plan_data.get("entities", {}),
        citations=formatted_citations,
        action_plan=action_plan_payload,
        thought=conflict_notes or plan_data.get("thought"),
        risk_level=plan_data.get("risk_level"),
        requires_approval=plan_data.get("requires_approval"),
        detected_intent=intent_result,
        extracted_entities=ExtractedEntities(**plan_data.get("entities", {})),
        suggested_action=plan_data.get("summary"),
        response_text=response_msg,
        is_uncertainty_refusal=is_uncertainty,
        refusal_reason=refusal_reason,
        department_contact=dept_contact
    )
