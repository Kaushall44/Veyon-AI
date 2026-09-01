import re
from typing import List, Dict, Any

def semantic_chunk_text(
    pages: List[Dict[str, Any]],
    chunk_size: int = 500,
    chunk_overlap: int = 100
) -> List[Dict[str, Any]]:
    """
    Recursive semantic chunker preserving document structure, section titles, and page numbers.
    Groups text into target chunk size (~500 tokens) with overlap (~100 tokens).
    """
    chunks = []
    chunk_idx = 1

    for page_data in pages:
        page_num = page_data.get("page_number", 1)
        raw_text = page_data.get("text", "").strip()
        if not raw_text:
            continue

        default_sec = page_data.get("section", f"Page {page_num}")
        # Detect section header in text if present
        sec_match = re.search(r'(Section\s+[\d\.]+|Chapter\s+[\d\.]+|Article\s+[\d\.]+[:\s][^\n\.]+)', raw_text, re.IGNORECASE)
        page_section = sec_match.group(1).strip() if sec_match else default_sec

        words = raw_text.split()
        if len(words) <= chunk_size:
            chunks.append({
                "chunk_id_suffix": f"{page_num}-{chunk_idx}",
                "page_number": page_num,
                "section": page_section,
                "text": raw_text,
                "word_count": len(words)
            })
            chunk_idx += 1
        else:
            # Sliding window chunking with overlap
            start = 0
            while start < len(words):
                end = min(start + chunk_size, len(words))
                chunk_words = words[start:end]
                chunk_text = " ".join(chunk_words)

                chunks.append({
                    "chunk_id_suffix": f"{page_num}-{chunk_idx}",
                    "page_number": page_num,
                    "section": page_section,
                    "text": chunk_text,
                    "word_count": len(chunk_words)
                })
                chunk_idx += 1
                
                if end == len(words):
                    break
                start += (chunk_size - chunk_overlap)

    return chunks
