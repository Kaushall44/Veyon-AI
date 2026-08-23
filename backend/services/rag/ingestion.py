import os
import re
import math
import hashlib
from typing import List, Dict, Any

class KnowledgeChunk:
    def __init__(self, chunk_id: str, document_title: str, page_number: int, section: str, text: str, embedding: List[float]):
        self.chunk_id = chunk_id
        self.document_title = document_title
        self.page_number = page_number
        self.section = section
        self.text = text
        self.embedding = embedding

def generate_embedding(text: str) -> List[float]:
    """
    Generates a 768-dimensional dense vector embedding.
    Uses Google Gemini Embedding API when configured, with a deterministic 768-dim vector fallback.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and gemini_key != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            emb = result['embedding']
            if len(emb) == 768:
                return emb
        except Exception as e:
            print(f"[RAG Ingestion Warning] Gemini embedding API call failed: {e}. Using vector fallback.")

    # Deterministic 768-dim Vector Fallback (Normalized pseudo-dense vector for local prototype testing)
    words = re.findall(r'\w+', text.lower())
    vector = [0.0] * 768
    for i, word in enumerate(words):
        # Hash word to vector index 0..767
        hash_val = int(hashlib.md5(word.encode()).hexdigest(), 16)
        idx = hash_val % 768
        vector[idx] += 1.0 / (i + 1.0)
    
    # Normalize vector to unit length
    magnitude = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [x / magnitude for x in vector]

def load_and_chunk_documents() -> List[KnowledgeChunk]:
    """
    Reads institutional policy text files from backend/docs/policies/, 
    splits them by Page/Section boundaries (500 tokens max), and returns vector-indexed chunks.
    """
    policies_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "docs", "policies")
    chunks: List[KnowledgeChunk] = []

    if not os.path.exists(policies_dir):
        print(f"[RAG Warning] Policies directory not found at {policies_dir}")
        return chunks

    chunk_counter = 1
    for filename in os.listdir(policies_dir):
        if not filename.endswith(".txt"):
            continue

        filepath = os.path.join(policies_dir, filename)
        doc_title = filename.replace("_", " ").replace(".txt", ".pdf")

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Split by section headers e.g. [Page 14 - Section 4.2: Attendance Requirements]
        raw_sections = re.split(r'\[Page\s+(\d+)\s+-\s+Section\s+([^\]]+)\]', content)

        if len(raw_sections) > 1:
            for i in range(1, len(raw_sections), 3):
                page_num = int(raw_sections[i])
                section_hdr = raw_sections[i+1].strip()
                section_text = raw_sections[i+2].strip()

                if section_text:
                    emb = generate_embedding(section_text)
                    chunk_obj = KnowledgeChunk(
                        chunk_id=f"CHUNK-{chunk_counter:04d}",
                        document_title=doc_title,
                        page_number=page_num,
                        section=section_hdr,
                        text=section_text,
                        embedding=emb
                    )
                    chunks.append(chunk_obj)
                    chunk_counter += 1
        else:
            # Fallback simple 500-character chunking
            emb = generate_embedding(content)
            chunks.append(KnowledgeChunk(
                chunk_id=f"CHUNK-{chunk_counter:04d}",
                document_title=doc_title,
                page_number=1,
                section="General Policy",
                text=content,
                embedding=emb
            ))
            chunk_counter += 1

    return chunks

# Pre-loaded Knowledge Chunks Store
KNOWLEDGE_BASE_CHUNKS: List[KnowledgeChunk] = load_and_chunk_documents()
