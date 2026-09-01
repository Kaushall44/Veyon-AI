from typing import Dict, Any, List, Optional

UNCERTAINTY_THRESHOLD = 0.82

DEPARTMENT_CONTACTS = {
    "Academic": {
        "office": "Dean of Academics Office",
        "campus": "ITER Campus, Jagamara, Khandagiri, Bhubaneswar",
        "email": "academic.dean@soa.ac.in",
        "phone": "+91-674-2350181",
        "timings": "Mon - Fri, 09:30 AM - 05:00 PM"
    },
    "Estates": {
        "office": "Chief Warden & Estates Office",
        "campus": "SOA Central Campus",
        "email": "estates.helpdesk@soa.ac.in",
        "phone": "+91-674-2350555",
        "timings": "Mon - Sat, 08:00 AM - 08:00 PM"
    },
    "General": {
        "office": "Student Affairs & Registrar Office",
        "campus": "SOA University Administrative Block",
        "email": "registrar@soa.ac.in",
        "phone": "+91-674-2350180",
        "timings": "Mon - Fri, 09:00 AM - 05:30 PM"
    }
}

class UncertaintyEngine:
    """
    Confidence-Based Uncertainty Detection Engine.
    Enforces the Zero-Hallucination Policy: when retrieval confidence is below threshold (tau < 0.82),
    the system refuses to guess, halts inference, and provides official department contact details.
    """

    @classmethod
    def evaluate_retrieval_confidence(
        cls,
        query: str,
        citations: List[Dict[str, Any]],
        threshold: float = UNCERTAINTY_THRESHOLD
    ) -> Dict[str, Any]:
        """
        Evaluates whether the retrieved citations provide sufficient grounding.
        """
        if not citations:
            return {
                "is_uncertainty_refusal": True,
                "confidence_score": 0.25,
                "refusal_reason": f"No grounded policy passage located above {int(threshold * 100)}% similarity threshold.",
                "refusal_message": (
                    "Zero-Hallucination Refusal: Our search across official SOA University Academic Regulations "
                    "did not locate an authoritative policy passage to answer this inquiry. "
                    "Under the Zero-Hallucination Mandate, the AI will not fabricate ungrounded institutional rules. "
                    "Please contact the Dean of Academics Office directly at academic.dean@soa.ac.in or +91-674-2350181."
                ),
                "department_contact": DEPARTMENT_CONTACTS["Academic"]
            }

        max_score = max(c.get("similarity_score", c.get("score", 0.0)) for c in citations)

        if max_score < threshold:
            return {
                "is_uncertainty_refusal": True,
                "confidence_score": round(max_score, 4),
                "refusal_reason": f"Maximum retrieval similarity score ({max_score:.2f}) is below confidence threshold ({threshold:.2f}).",
                "refusal_message": (
                    "Zero-Hallucination Refusal: The highest policy match confidence is below the required 82% threshold. "
                    "To prevent misinformation, please consult the Dean of Academics Office directly."
                ),
                "department_contact": DEPARTMENT_CONTACTS["Academic"]
            }

        return {
            "is_uncertainty_refusal": False,
            "confidence_score": round(max_score, 4),
            "refusal_reason": None,
            "refusal_message": None,
            "department_contact": None
        }
