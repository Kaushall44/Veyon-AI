import os
import requests
from typing import Tuple
from schemas.chat_schemas import IntentResult, ExtractedEntities
from services.ai.entity_extractor import extract_entities_from_prompt
from core.config import settings

VALID_INTENTS = {"FAQ", "CERTIFICATE", "LAB_BOOKING", "MAINTENANCE", "GRIEVANCE", "UNKNOWN"}

def classify_intent(prompt: str) -> Tuple[str, float]:
    """
    Classifies raw user prompt into canonical institutional intent types.
    Supports OpenRouter LLM API & Google Gemini when configured, with robust NLU pattern fallback.
    """
    prompt_lower = prompt.lower().strip()

    # 1. Check OpenRouter API Key
    openrouter_key = os.getenv("OPENROUTER_API_KEY") or settings.OPENROUTER_API_KEY
    if openrouter_key and openrouter_key.startswith("sk-or-v1-"):
        try:
            model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openrouter_key}",
                    "HTTP-Referer": "https://soa-nexus.edu",
                    "X-Title": "SOA Nexus AI Platform",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are an NLU intent classifier for SOA University service delivery system. "
                                "Classify the input prompt into EXACTLY ONE of these categories: "
                                "[FAQ, CERTIFICATE, LAB_BOOKING, MAINTENANCE, GRIEVANCE, UNKNOWN]. "
                                "Return ONLY the single category name in uppercase, nothing else."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.1
                },
                timeout=5
            )
            if response.status_code == 200:
                result_json = response.json()
                predicted = result_json["choices"][0]["message"]["content"].strip().upper()
                for intent in VALID_INTENTS:
                    if intent in predicted:
                        print(f"[OpenRouter NLU] LLM Model '{model}' classified intent: {intent}")
                        return intent, 0.98
        except Exception as e:
            print(f"[NLU Warning] OpenRouter API call skipped/failed: {e}. Falling back to rule-based NLU.")

    # 2. Check Gemini API if API key is present
    gemini_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    if gemini_key and gemini_key != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            system_prompt = (
                "You are an NLU intent classifier for SOA University service delivery system. "
                "Classify the input prompt into EXACTLY ONE of these categories: "
                "[FAQ, CERTIFICATE, LAB_BOOKING, MAINTENANCE, GRIEVANCE, UNKNOWN]. "
                "Return ONLY the category name."
            )
            response = model.generate_content(f"{system_prompt}\nUser Input: {prompt}")
            predicted = response.text.strip().upper()
            if predicted in VALID_INTENTS:
                return predicted, 0.98
        except Exception as e:
            print(f"[NLU Warning] Gemini API call skipped/failed: {e}. Falling back to rule-based NLU.")

    # 3. Rule-Based NLU Pattern Matcher (Zero-latency fallback)
    if any(k in prompt_lower for k in ["book", "reserve", "slot", "ai lab", "microelectronics", "lab booking", "cad kiosk"]):
        return "LAB_BOOKING", 0.98

    if any(k in prompt_lower for k in ["certificate", "bonafide", "transcript", "conduct cert"]):
        return "CERTIFICATE", 0.96

    if any(k in prompt_lower for k in ["ac ", "ac in", "air conditioning", "leak", "fan", "light", "socket", "plumbing", "broken", "not working", "repair"]):
        return "MAINTENANCE", 0.95

    if any(k in prompt_lower for k in ["grievance", "complain", "harassment", "ragging", "formal complaint"]):
        return "GRIEVANCE", 0.95

    if any(k in prompt_lower for k in ["attendance", "cutoff", "policy", "regulation", "rule", "exam fee", "hostel rules", "procedure", "what is"]):
        return "FAQ", 0.92

    return "UNKNOWN", 0.60

def process_nlu_pipeline(prompt: str) -> IntentResult:
    """
    Full NLU Pipeline processing raw text prompt -> intent + confidence + extracted entities.
    """
    intent, confidence = classify_intent(prompt)
    entities = extract_entities_from_prompt(prompt, intent)
    
    return IntentResult(
        detected_intent=intent,
        intent_confidence=confidence,
        extracted_entities=entities
    )
