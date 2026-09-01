import os
import re
import math
import hashlib
import io
import logging
from typing import List, Dict, Any, Optional

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        PdfReader = None

logger = logging.getLogger("soa_nexus_ingestion")

class KnowledgeChunkRecord:
    def __init__(self, chunk_id: str, document_title: str, page_number: int, section: str, text: str, embedding: List[float]):
        self.chunk_id = chunk_id
        self.document_title = document_title
        self.page_number = page_number
        self.section = section
        self.text = text
        self.embedding = embedding

# Backward compatibility alias for retrieval & evaluation services
KnowledgeChunk = KnowledgeChunkRecord

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
            logger.warning(f"Gemini embedding API call failed: {e}. Using vector fallback.")

    # Deterministic 768-dim Vector Fallback (Normalized pseudo-dense vector for local prototype testing)
    words = re.findall(r'\w+', text.lower())
    vector = [0.0] * 768
    for i, word in enumerate(words):
        hash_val = int(hashlib.md5(word.encode()).hexdigest(), 16)
        idx = hash_val % 768
        vector[idx] += 1.0 / (i + 1.0)
    
    # Normalize vector to unit length
    magnitude = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [x / magnitude for x in vector]

def extract_text_from_file_bytes(file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from PDF, DOCX, or TXT file bytes.
    Applies OCR fallback if PDF pages contain scanned images or empty text.
    """
    pages: List[Dict[str, Any]] = []
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        if PdfReader is not None:
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                for page_idx, page in enumerate(reader.pages):
                    extracted = page.extract_text() or ""
                    
                    # OCR Fallback for scanned images / empty text
                    if not extracted.strip():
                        try:
                            import pytesseract
                            from PIL import Image
                            for img_obj in page.images:
                                img = Image.open(io.BytesIO(img_obj.data))
                                extracted += pytesseract.image_to_string(img) + "\n"
                        except Exception:
                            pass

                    pages.append({
                        "page_number": page_idx + 1,
                        "text": extracted.strip() or f"Page {page_idx + 1} content from {filename}",
                        "section": f"Page {page_idx + 1}"
                    })
            except Exception as e:
                logger.error(f"Error parsing PDF '{filename}': {e}")
                pages.append({"page_number": 1, "text": f"Parsed content from {filename}", "section": "General"})
        else:
            pages.append({"page_number": 1, "text": f"Parsed content from {filename}", "section": "General"})

    elif filename_lower.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            pages.append({
                "page_number": 1,
                "text": full_text or f"DOCX Document {filename}",
                "section": "Document Body"
            })
        except Exception as e:
            logger.warning(f"Error extracting DOCX '{filename}': {e}")
            pages.append({"page_number": 1, "text": f"DOCX Document content from {filename}", "section": "General"})

    else:
        # Default plaintext reader
        try:
            content = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            content = str(file_bytes)

        # Check if structured with [Page X - Section Y] headers
        raw_sections = re.split(r'\[Page\s+(\d+)\s+-\s+Section\s+([^\]]+)\]', content)
        if len(raw_sections) > 1:
            for i in range(1, len(raw_sections), 3):
                page_num = int(raw_sections[i])
                sec_hdr = raw_sections[i+1].strip()
                sec_txt = raw_sections[i+2].strip()
                pages.append({"page_number": page_num, "text": sec_txt, "section": sec_hdr})
        else:
            pages.append({"page_number": 1, "text": content, "section": "General Policy"})

    return pages

def load_and_chunk_documents() -> List[KnowledgeChunkRecord]:
    """
    Reads institutional policy text files from backend/docs/policies/
    and returns initial vector-indexed chunks.
    """
    policies_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "docs", "policies")
    chunks: List[KnowledgeChunkRecord] = []

    if not os.path.exists(policies_dir):
        return chunks

    chunk_counter = 1
    for filename in os.listdir(policies_dir):
        if not filename.endswith(".txt"):
            continue

        filepath = os.path.join(policies_dir, filename)
        doc_title = filename.replace("_", " ").replace(".txt", ".pdf")

        with open(filepath, "rb") as f:
            file_bytes = f.read()

        pages = extract_text_from_file_bytes(file_bytes, filename)
        for p in pages:
            emb = generate_embedding(p["text"])
            chunk_obj = KnowledgeChunkRecord(
                chunk_id=f"CHUNK-{chunk_counter:04d}",
                document_title=doc_title,
                page_number=p["page_number"],
                section=p.get("section", "General"),
                text=p["text"],
                embedding=emb
            )
            chunks.append(chunk_obj)
            chunk_counter += 1

    return chunks

# Pre-loaded Knowledge Chunks Store
KNOWLEDGE_BASE_CHUNKS: List[KnowledgeChunkRecord] = load_and_chunk_documents()
