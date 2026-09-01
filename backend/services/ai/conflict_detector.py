from typing import Dict, Any, List

class ConflictDetector:
    """
    Multi-Document Contradiction and Lex Posterior Conflict Resolution Engine.
    Compares circular effective dates and directives when multiple policy passages are retrieved.
    """

    @classmethod
    def analyze_document_conflicts(cls, policy_passages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes retrieved passages for chronological contradictions or version divergence.
        Newer circulars (higher effective_year) supersede older ones via Lex Posterior.
        """
        if not policy_passages:
            return {
                "has_conflict": False,
                "winning_policy": None,
                "superseded_policy": None,
                "resolution_notes": "No policy passages provided.",
                "resolved_by": "NO_PASSAGES"
            }

        if len(policy_passages) == 1:
            return {
                "has_conflict": False,
                "winning_policy": policy_passages[0],
                "superseded_policy": None,
                "resolution_notes": "Single unambiguous policy source.",
                "resolved_by": "SINGLE_SOURCE"
            }

        # Sort passages by effective_year descending
        sorted_passages = sorted(
            policy_passages,
            key=lambda p: p.get("effective_year", 2024),
            reverse=True
        )

        newest = sorted_passages[0]
        older = sorted_passages[1]

        has_year_conflict = newest.get("effective_year", 2025) != older.get("effective_year", 2024)

        if has_year_conflict:
            return {
                "has_conflict": True,
                "winning_policy": newest,
                "superseded_policy": older,
                "resolution_notes": (
                    f"Policy '{newest.get('document_title', newest.get('doc_title', 'Latest Policy'))}' "
                    f"(Effective Year {newest.get('effective_year')}) supersedes older document "
                    f"'{older.get('document_title', older.get('doc_title', 'Older Policy'))}' "
                    f"(Effective Year {older.get('effective_year')}) via Lex Posterior rule."
                ),
                "resolved_by": "LEX_POSTERIOR_PRECEDENCE"
            }

        return {
            "has_conflict": False,
            "winning_policy": newest,
            "superseded_policy": None,
            "resolution_notes": "All retrieved passages belong to the same regulatory cycle.",
            "resolved_by": "UNIFIED_REGULATORY_CYCLE"
        }

# Backward compatibility alias
resolve_policy_conflicts = ConflictDetector.analyze_document_conflicts
