from typing import Dict, Any
from services.rag.retrieval import search_hybrid_knowledge_base

UNCERTAINTY_REFUSAL_MESSAGE = (
    "I am unable to verify this institutional policy in the official SOA document repository. "
    "To prevent providing inaccurate information, I cannot generate an answer. "
    "Please consult your department office or submit an inquiry to the Warden/Academic Desk."
)

def evaluate_rag_response(query: str, threshold: float = 0.70) -> Dict[str, Any]:
    """
    Evaluates top RAG similarity score against confidence threshold (0.70).
    Enforces the Zero-Hallucination policy: if similarity < 0.70, output Uncertainty Refusal.
    """
    results = search_hybrid_knowledge_base(query, top_k=3)

    if not results:
        return {
            "is_grounded": False,
            "confidence_score": 0.0,
            "uncertainty_refusal": True,
            "answer": UNCERTAINTY_REFUSAL_MESSAGE,
            "citations": []
        }

    top_chunk, top_score = results[0]

    if top_score < threshold:
        return {
            "is_grounded": False,
            "confidence_score": top_score,
            "uncertainty_refusal": True,
            "answer": UNCERTAINTY_REFUSAL_MESSAGE,
            "citations": [],
            "attempted_sources": [
                {
                    "document_title": chunk.document_title,
                    "page": chunk.page_number,
                    "score": score
                }
                for chunk, score in results
            ]
        }

    # Grounded Answer Generation
    answer_text = f"According to {top_chunk.section} of {top_chunk.document_title}: {top_chunk.text}"
    citation_payload = {
        "document_title": top_chunk.document_title,
        "page": top_chunk.page_number,
        "section": top_chunk.section,
        "similarity_score": top_score
    }

    return {
        "is_grounded": True,
        "confidence_score": top_score,
        "uncertainty_refusal": False,
        "answer": answer_text,
        "citations": [citation_payload]
    }
