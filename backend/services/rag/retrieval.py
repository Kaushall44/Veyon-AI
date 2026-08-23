import math
from typing import List, Tuple
from services.rag.ingestion import KnowledgeChunk, KNOWLEDGE_BASE_CHUNKS, generate_embedding

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

def search_hybrid_knowledge_base(query: str, top_k: int = 3) -> List[Tuple[KnowledgeChunk, float]]:
    """
    Hybrid Search over Knowledge Base:
    Score = 0.7 * VectorSimilarity + 0.3 * BM25Score
    """
    if not KNOWLEDGE_BASE_CHUNKS:
        return []

    query_embedding = generate_embedding(query)
    scored_chunks: List[Tuple[KnowledgeChunk, float]] = []

    for chunk in KNOWLEDGE_BASE_CHUNKS:
        vec_sim = calculate_cosine_similarity(query_embedding, chunk.embedding)
        bm25_score = calculate_bm25_keyword_score(query, chunk.text)

        # Keyword match boost for specific institutional policy terms
        query_lower = query.lower()
        chunk_lower = chunk.text.lower()
        
        if "attendance" in query_lower and "attendance" in chunk_lower:
            bm25_score = max(bm25_score, 0.95)
            vec_sim = max(vec_sim, 0.92)
        elif "ai lab" in query_lower and "ai lab" in chunk_lower:
            bm25_score = max(bm25_score, 0.95)
            vec_sim = max(vec_sim, 0.92)
        elif ("weekend" in query_lower or "curfew" in query_lower or "night" in query_lower or "hostel" in query_lower or "gate" in query_lower) and ("weekend" in chunk_lower or "curfew" in chunk_lower or "safety" in chunk_lower or "hostel" in chunk_lower or "gate" in chunk_lower):
            bm25_score = max(bm25_score, 0.95)
            vec_sim = max(vec_sim, 0.90)
        elif ("credit" in query_lower or "grading" in query_lower or "b.tech" in query_lower) and ("credit" in chunk_lower or "grade" in chunk_lower or "degree" in chunk_lower):
            bm25_score = max(bm25_score, 0.95)
            vec_sim = max(vec_sim, 0.90)

        hybrid_score = (0.7 * vec_sim) + (0.3 * bm25_score)
        scored_chunks.append((chunk, round(hybrid_score, 4)))

    # Sort descending by hybrid score
    scored_chunks.sort(key=lambda x: x[1], reverse=True)
    return scored_chunks[:top_k]
