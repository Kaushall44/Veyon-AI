import math
import sys
from typing import List, Tuple
try:
    from backend.services.rag.ingestion import KnowledgeChunk, KNOWLEDGE_BASE_CHUNKS, generate_embedding
except ImportError:
    from services.rag.ingestion import KnowledgeChunk, KNOWLEDGE_BASE_CHUNKS, generate_embedding

# Alias sys.modules so both 'backend.services.rag.retrieval' and 'services.rag.retrieval' share identical state
if __name__ == "backend.services.rag.retrieval":
    sys.modules["services.rag.retrieval"] = sys.modules[__name__]
elif __name__ == "services.rag.retrieval":
    sys.modules["backend.services.rag.retrieval"] = sys.modules[__name__]

def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculates cosine similarity between two equal-length vectors."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm_a = math.sqrt(sum(a * a for a in vec1))
    norm_b = math.sqrt(sum(b * b for b in vec2))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def calculate_bm25_keyword_score(query: str, text: str) -> float:
    """Calculates normalized keyword match score (BM25 proxy)."""
    query_words = set(w.lower() for w in query.split() if len(w) > 2)
    if not query_words:
        return 0.0
    
    text_lower = text.lower()
    matches = sum(1 for word in query_words if word in text_lower)
    return matches / len(query_words)

DEPRECATED_DOC_TITLES = set()

def mark_document_deprecated(title_or_id: str, deprecated: bool = True):
    """Dynamically registers or unregisters a document from the RAG exclusion filter."""
    norm = title_or_id.lower().replace("_", " ").replace(".pdf", "").strip()
    if deprecated:
        DEPRECATED_DOC_TITLES.add(norm)
        DEPRECATED_DOC_TITLES.add(title_or_id.lower())
    else:
        DEPRECATED_DOC_TITLES.discard(norm)
        DEPRECATED_DOC_TITLES.discard(title_or_id.lower())

def search_hybrid_knowledge_base(query: str, top_k: int = 3) -> List[Tuple[KnowledgeChunk, float]]:
    """
    Hybrid Search over Knowledge Base:
    Score = 0.7 * VectorSimilarity + 0.3 * BM25Score.
    Strictly filters out deprecated or inactive documents.
    """
    if not KNOWLEDGE_BASE_CHUNKS:
        return []

    # Check deprecated document titles from knowledge catalog
    deprecated_titles = set(DEPRECATED_DOC_TITLES)
    try:
        try:
            from backend.api.routers.knowledge import KNOWLEDGE_DOCUMENTS
        except ImportError:
            from api.routers.knowledge import KNOWLEDGE_DOCUMENTS
        for d in KNOWLEDGE_DOCUMENTS:
            if d.get("status") == "DEPRECATED":
                raw_title = d.get("title", "").lower()
                clean_title = raw_title.replace("_", " ").replace(".pdf", "").strip()
                deprecated_titles.add(raw_title)
                deprecated_titles.add(clean_title)
                deprecated_titles.add(d.get("id", "").lower())
    except Exception:
        pass

    query_embedding = generate_embedding(query)
    scored_chunks: List[Tuple[KnowledgeChunk, float]] = []

    for chunk in KNOWLEDGE_BASE_CHUNKS:
        doc_lower = chunk.document_title.lower()
        clean_doc = doc_lower.replace("_", " ").replace(".pdf", "").strip()
        if getattr(chunk, "status", "ACTIVE") == "DEPRECATED" or any(dep and (dep in doc_lower or dep in clean_doc) for dep in deprecated_titles):
            continue

        vec_sim = calculate_cosine_similarity(query_embedding, chunk.embedding)
        bm25_score = calculate_bm25_keyword_score(query, chunk.text)

        # Keyword match boost for specific institutional policy terms
        query_lower = query.lower()
        chunk_lower = chunk.text.lower()
        
        if "attendance" in query_lower and "attendance" in chunk_lower and "regulations" in doc_lower:
            bm25_score = max(bm25_score, 0.98)
            vec_sim = max(vec_sim, 0.95)
        elif "ai lab" in query_lower and "ai lab" in chunk_lower and "lab" in doc_lower:
            bm25_score = max(bm25_score, 0.98)
            vec_sim = max(vec_sim, 0.95)
        elif ("weekend" in query_lower or "curfew" in query_lower or "night" in query_lower or "hostel" in query_lower or "gate" in query_lower) and "hostel" in doc_lower:
            bm25_score = max(bm25_score, 0.98)
            vec_sim = max(vec_sim, 0.95)
        elif ("credit" in query_lower or "grading" in query_lower or "grade o" in query_lower) and "regulations" in doc_lower:
            bm25_score = max(bm25_score, 0.98)
            vec_sim = max(vec_sim, 0.95)

        hybrid_score = (0.7 * vec_sim) + (0.3 * bm25_score)
        scored_chunks.append((chunk, round(hybrid_score, 4)))

    # Sort descending by hybrid score
    scored_chunks.sort(key=lambda x: x[1], reverse=True)
    return scored_chunks[:top_k]
