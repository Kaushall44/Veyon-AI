from typing import Dict, Any, List

def resolve_policy_conflicts(policy_passages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compares circular effective dates when policy documents conflict.
    Applies Lex Posterior rule (newer effective circular takes precedence).
    """
    if not policy_passages:
        return {"has_conflict": False, "winning_policy": None, "resolved_by": "NO_PASSAGES"}

    if len(policy_passages) == 1:
        return {"has_conflict": False, "winning_policy": policy_passages[0], "resolved_by": "SINGLE_SOURCE"}

    # Sort passages by effective_year descending
    sorted_passages = sorted(
        policy_passages,
        key=lambda p: p.get("effective_year", 2024),
        reverse=True
    )

    newest = sorted_passages[0]
    older = sorted_passages[1]

    has_conflict = (newest.get("effective_year", 2025) != older.get("effective_year", 2024))

    return {
        "has_conflict": has_conflict,
        "winning_policy": newest,
        "superseded_policy": older,
        "conflict_reason": f"Policy '{newest.get('doc_title')}' (Year {newest.get('effective_year')}) supersedes older document '{older.get('doc_title')}' (Year {older.get('effective_year')}).",
        "resolved_by": "LEX_POSTERIOR_PRECEDENCE"
    }
