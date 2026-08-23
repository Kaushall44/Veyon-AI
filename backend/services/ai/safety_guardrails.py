import re
from typing import Dict, Any, List

# Adversarial Prompt Injection Patterns
INJECTION_PATTERNS = [
    r"ignore (all )?previous (instructions|rules|prompts)",
    r"you are now (in )?developer mode",
    r"system override",
    r"bypass (approval|security|permission|governance)",
    r"approve my (lab|certificate|request) without",
    r"grant me admin",
    r"disregard (the )?system prompt",
    r"you are dan",
    r"do anything now"
]

def sanitize_prompt(raw_prompt: str) -> Dict[str, Any]:
    """
    Scans and sanitizes raw user prompts for adversarial prompt injection attempts.
    Returns safety status and refusal payload if malicious patterns are detected.
    """
    prompt_lower = raw_prompt.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, prompt_lower):
            return {
                "is_safe": False,
                "violation_type": "PROMPT_INJECTION_ATTEMPT",
                "matched_pattern": pattern,
                "refusal_message": "Safety Guardrail Violation: Adversarial prompt override instructions are strictly prohibited under SOA Nexus AI Safety Policy.",
                "action_taken": "BLOCKED"
            }

    return {
        "is_safe": True,
        "violation_type": None,
        "matched_pattern": None,
        "refusal_message": None,
        "action_taken": "PASSED"
    }

def check_role_authorization(user_role: str, intent: str) -> Dict[str, Any]:
    """
    Role Pre-Check: Enforces role boundaries before agent execution.
    Prevent students from executing administrative sign-offs or grade overrides.
    """
    restricted_admin_intents = ["DIRECT_DB_OVERRIDE", "FORCE_APPROVE_WITHOUT_FACULTY", "MODIFY_TRANSCRIPT"]

    if intent in restricted_admin_intents and user_role.lower() not in ["admin", "super_admin"]:
        return {
            "is_authorized": False,
            "reason": f"Role '{user_role}' is not authorized to trigger administrative action '{intent}'.",
            "required_role": "Admin"
        }

    return {
        "is_authorized": True,
        "reason": "Role authorization check passed.",
        "required_role": user_role
    }

def evaluate_rag_uncertainty(query: str, vector_similarity_score: float) -> Dict[str, Any]:
    """
    Zero-Hallucination Refusal Component:
    Triggers when RAG vector similarity score < 0.70 threshold.
    """
    threshold = 0.70
    is_refusal = vector_similarity_score < threshold

    if is_refusal:
        return {
            "is_uncertainty_refusal": True,
            "similarity_score": vector_similarity_score,
            "threshold": threshold,
            "refusal_message": f"Unable to verify query in official SOA ITER policy documents (Similarity: {vector_similarity_score:.2f} < {threshold}). Escalated to Student Helpdesk.",
            "escalation_target": "Student Helpdesk & Dean Office"
        }

    return {
        "is_uncertainty_refusal": False,
        "similarity_score": vector_similarity_score,
        "threshold": threshold,
        "refusal_message": None
    }
