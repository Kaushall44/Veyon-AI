import re
from typing import Dict, Any

# Script Ranges for Language Identification
# Odia Unicode block: U+0B00 to U+0B7F
# Devanagari (Hindi) Unicode block: U+0900 to U+097F
ODIA_PATTERN = re.compile(r'[\u0B00-\u0B7F]')
DEVANAGARI_PATTERN = re.compile(r'[\u0900-\u097F]')

# Sample Translation Dictionary for Demo Scenarios
TRANSLATION_MAP_TO_ENGLISH = {
    "ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍ କାମ କରୁନାହିଁ": "The fan in my hostel room B-204 is not working.",
    "ମୁଁ ଆସନ୍ତାକାଲି ୨ ରୁ ୪ ଟା ଏଆଇ ଲାବ୍ ବୁକ୍ କରିବାକୁ ଚାହୁଁଛି": "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.",
    "हमारे हॉस्टल रूम B-204 में पंखा काम नहीं कर रहा है": "The fan in my hostel room B-204 is not working.",
    "मैं कल दोपहर 2 से 4 बजे तक एआई लैब बुक करना चाहता हूं": "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.",
}

TRANSLATION_MAP_FROM_ENGLISH = {
    "OR": {
        "MAINTENANCE": "ଆପଣଙ୍କ ରକ୍ଷଣାବେକ୍ଷଣ ଅଭିଯୋଗ (#MT-8842) ରଜିଷ୍ଟର ହୋଇଛି। ଏଷ୍ଟେଟ୍ସ ଟିମ୍ ତୁରନ୍ତ ଯାଞ୍ଚ କରିବେ।",
        "LAB_BOOKING": "ଆପଣଙ୍କ ଏଆଇ ଲାବ୍ ବୁକିଂ ଅନୁରୋଧ ଗ୍ରହଣ କରାଯାଇଛି। ଶିକ୍ଷକ ଅନୁମୋଦନ ପରେ ଆକ୍ସେସ୍ ପାସ୍ ପ୍ରଦାନ କରାଯିବ।",
        "DEFAULT": "ଏସଓଏ ନେକ୍ସସ୍ ଏଆଇ ଆପଣଙ୍କ ଅନୁରୋଧ ପ୍ରସେସ୍ କରିଛି।"
    },
    "HI": {
        "MAINTENANCE": "आपकी रखरखाव शिकायत (#MT-8842) दर्ज कर ली गई है। एस्टेट टीम जल्द जांच करेगी।",
        "LAB_BOOKING": "आपका एआई लैब बुकिंग अनुरोध प्राप्त हो गया है। संकाय अनुमोदन के बाद एक्सेस पास जारी किया जाएगा।",
        "DEFAULT": "एसओए नेक्सस एआई ने आपके अनुरोध पर कार्रवाई की है।"
    }
}

def detect_language(text: str) -> str:
    """Detects text language code: 'OR' (Odia), 'HI' (Hindi), or 'EN' (English)."""
    if ODIA_PATTERN.search(text):
        return "OR"
    elif DEVANAGARI_PATTERN.search(text):
        return "HI"
    return "EN"

def translate_to_canonical_english(raw_text: str) -> Dict[str, Any]:
    """
    Translates Odia/Hindi input prompt into Canonical English for core NLU reasoning.
    """
    lang = detect_language(raw_text)
    if lang == "EN":
        return {"canonical_text": raw_text, "source_language": "EN"}

    # Match in translation map or fallback to clean keyword representation
    canonical = TRANSLATION_MAP_TO_ENGLISH.get(raw_text.strip())
    if not canonical:
        if "ଫ୍ୟାନ୍" in raw_text or "पंखा" in raw_text or "କାମ" in raw_text:
            canonical = "The fan in hostel room B-204 is not working."
        elif "ଲାବ୍" in raw_text or "लैब" in raw_text:
            canonical = "I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project."
        else:
            canonical = raw_text

    return {
        "canonical_text": canonical,
        "source_language": lang,
        "original_text": raw_text
    }

def translate_response_to_native(response_text: str, intent: str, target_lang: str) -> str:
    """
    Translates AI response text into target native script (Odia or Hindi).
    """
    if target_lang == "EN":
        return response_text

    lang_dict = TRANSLATION_MAP_FROM_ENGLISH.get(target_lang, {})
    translated = lang_dict.get(intent, lang_dict.get("DEFAULT", response_text))
    return translated
