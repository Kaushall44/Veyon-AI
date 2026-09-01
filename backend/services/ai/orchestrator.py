import os
import json
import logging
from typing import Dict, Any, Optional
import requests

try:
    from backend.core.config import settings
    from backend.services.ai.prompts import REACT_ORCHESTRATOR_SYSTEM_PROMPT
    from backend.services.ai.intent_classifier import classify_intent
    from backend.services.ai.entity_extractor import extract_entities_from_prompt
    from backend.services.ai.agent_planner import generate_action_plan
    from backend.services.ai.safety_guardrails import sanitize_prompt, check_role_authorization
    from backend.services.ai.multilingual_engine import translate_to_canonical_english, translate_response_to_native
except ImportError:
    from core.config import settings
    from services.ai.prompts import REACT_ORCHESTRATOR_SYSTEM_PROMPT
    from services.ai.intent_classifier import classify_intent
    from services.ai.entity_extractor import extract_entities_from_prompt
    from services.ai.agent_planner import generate_action_plan
    from services.ai.safety_guardrails import sanitize_prompt, check_role_authorization
    from services.ai.multilingual_engine import translate_to_canonical_english, translate_response_to_native

logger = logging.getLogger("soa_nexus_orchestrator")

GREETING_RESPONSES = {
    "en": "Hello! I am SOA Nexus, your Institutional AI Service Assistant. How can I help you today? You can ask about academic policies, reserve lab slots, apply for bonafide certificates, report maintenance issues, or file confidential grievances.",
    "hi": "नमस्ते! मैं SOA Nexus हूँ, आपका संस्थागत AI सेवा सहायक। मैं आज आपकी क्या सहायता कर सकता हूँ? आप अकादमिक नियमों, लैब बुकिंग, प्रमाण पत्र, मेंटेनेंस या गोपनीय शिकायतों के बारे में पूछ सकते हैं।",
    "or": "ନମସ୍କାର! ମୁଁ SOA Nexus, ଆପଣଙ୍କର ଅନୁଷ୍ଠାନିକ AI ସେବା ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି? ଆପଣ ନିୟମାବଳୀ, ଲ୍ୟାବ ବୁକିଂ, ପ୍ରମାଣପତ୍ର କିମ୍ବା ଅଭିଯୋଗ ବିଷୟରେ ପଚାରିପାରିବେ।"
}

class ReActOrchestrator:
    """
    Enterprise ReAct (Reasoning + Acting) AI Orchestrator.
    Decomposes natural language student inquiries into structured thought-action plans,
    evaluates institutional risk levels, and determines human-in-the-loop approval gating.
    
    AI INVARIANT:
    The LLM outputs proposed plan parameters only. The backend validates and executes tools.
    """

    @classmethod
    def decompose_and_plan(
        cls,
        user_prompt: str,
        user_role: str = "Student",
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Main pipeline executing:
        1. Multilingual Normalization
        2. Prompt Injection Guardrails
        3. LLM / NLU Intent & Entity Decomposition
        4. Institutional Risk Assessment & Human-in-the-Loop Gating
        5. Action Plan Generation (only for actionable requests)
        """
        # Step 1: Multilingual Normalization
        trans_res = translate_to_canonical_english(user_prompt)
        canonical_prompt = trans_res.get("canonical_text", user_prompt)
        source_lang = trans_res.get("source_language", language)

        # Step 2: Safety & Injection Sanitization
        sanitization = sanitize_prompt(canonical_prompt)
        if not sanitization["is_safe"]:
            return {
                "thought": "Prompt injection or unsafe content detected. Request blocked.",
                "intent": "UNKNOWN",
                "confidence": 0.0,
                "entities": {},
                "risk_level": "HIGH",
                "requires_approval": False,
                "assigned_approver_role": None,
                "summary": f"BLOCKED: {sanitization['violation_type']}",
                "steps": [],
                "response_text": sanitization["refusal_message"],
                "source_language": source_lang
            }

        # Step 3: Handle Conversational Greetings immediately without LLM overhead or dummy plans
        intent, confidence = classify_intent(canonical_prompt)
        if intent == "GREETING":
            resp = GREETING_RESPONSES.get(source_lang.lower(), GREETING_RESPONSES["en"])
            return {
                "thought": "User offered a conversational greeting. Returning friendly institutional introduction.",
                "intent": "GREETING",
                "confidence": confidence,
                "entities": {},
                "risk_level": "LOW",
                "requires_approval": False,
                "assigned_approver_role": None,
                "summary": "Conversational Greeting",
                "steps": [],
                "response_text": resp,
                "source_language": source_lang
            }

        # Step 4: Attempt OpenRouter LLM with Structured Output if API key available
        plan_data = cls._query_llm_orchestrator(canonical_prompt)

        # Step 5: Deterministic Fallback if LLM unavailable or offline
        if not plan_data:
            plan_data = cls._deterministic_decompose(canonical_prompt, user_role)

        # Step 6: Role Authorization Pre-Check
        auth_check = check_role_authorization(user_role, plan_data["intent"])
        if not auth_check["is_authorized"]:
            return {
                "thought": f"User role '{user_role}' is not authorized to execute intent '{plan_data['intent']}'.",
                "intent": plan_data["intent"],
                "confidence": plan_data.get("confidence", 0.95),
                "entities": plan_data.get("entities", {}),
                "risk_level": "HIGH",
                "requires_approval": False,
                "assigned_approver_role": None,
                "summary": "UNAUTHORIZED_ROLE",
                "steps": [],
                "response_text": f"Access Denied: {auth_check['reason']}",
                "source_language": source_lang
            }

        # Step 7: Native Language Translation for Final Student Response
        raw_msg = plan_data.get("summary", f"Parsed {plan_data['intent']} request.")
        native_response = translate_response_to_native(raw_msg, plan_data["intent"], source_lang)
        plan_data["response_text"] = native_response
        plan_data["source_language"] = source_lang

        return plan_data

    @classmethod
    def _query_llm_orchestrator(cls, prompt: str) -> Optional[Dict[str, Any]]:
        """Queries OpenRouter / LLM with structured JSON output enforcement."""
        api_key = settings.OPENROUTER_API_KEY
        if not api_key or "sk-or-" not in api_key:
            return None

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://soa.ac.in",
            "X-Title": "SOA Nexus Orchestrator"
        }

        payload = {
            "model": settings.OPENROUTER_MODEL or "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": REACT_ORCHESTRATOR_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
            "max_tokens": 800
        }

        try:
            res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=8)
            if res.status_code == 200:
                content = res.json()["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                if "intent" in parsed and "steps" in parsed:
                    return parsed
        except Exception as e:
            logger.warning(f"OpenRouter LLM call skipped/failed: {e}. Utilizing deterministic fallback.")

        return None

    @classmethod
    def _deterministic_decompose(cls, prompt: str, user_role: str) -> Dict[str, Any]:
        """High-precision deterministic rule-based ReAct planner fallback."""
        intent, confidence = classify_intent(prompt)
        extracted = extract_entities_from_prompt(prompt, intent)
        entities_dict = extracted.model_dump()

        action_plan = generate_action_plan(intent, entities_dict)

        if action_plan:
            return {
                "thought": f"Classified intent as '{intent}' with confidence {confidence:.2f}. Identified {len([v for v in entities_dict.values() if v])} relevant entities.",
                "intent": intent,
                "confidence": confidence,
                "entities": entities_dict,
                "risk_level": action_plan.risk_level,
                "requires_approval": action_plan.requires_approval,
                "assigned_approver_role": action_plan.assigned_approver_role,
                "summary": action_plan.summary,
                "steps": [s.model_dump() for s in action_plan.steps]
            }
        else:
            return {
                "thought": f"Classified intent as '{intent}' with confidence {confidence:.2f}. General query without multi-step action plan.",
                "intent": intent,
                "confidence": confidence,
                "entities": entities_dict,
                "risk_level": "LOW",
                "requires_approval": False,
                "assigned_approver_role": None,
                "summary": "Knowledge Retrieval & Informational Query",
                "steps": []
            }
