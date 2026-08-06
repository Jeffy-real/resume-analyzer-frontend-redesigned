import re
from utils.constants import CONTACT_PATTERNS

def extract_email(text: str) -> str:
    match = re.search(CONTACT_PATTERNS['email'], text)
    return match.group(0) if match else ''

def extract_phone(text: str) -> str:
    match = re.search(CONTACT_PATTERNS['phone'], text)
    return match.group(0) if match else ''

def extract_linkedin(text: str) -> str:
    match = re.search(CONTACT_PATTERNS['linkedin'], text, re.IGNORECASE)
    return match.group(0) if match else ''

def extract_github(text: str) -> str:
    match = re.search(CONTACT_PATTERNS['github'], text, re.IGNORECASE)
    return match.group(0) if match else ''

def extract_contact_info(text: str) -> dict:
    return {
        'email': extract_email(text),
        'phone': extract_phone(text),
        'linkedin': extract_linkedin(text),
        'github': extract_github(text)
    }

def count_words(text: str) -> int:
    return len(text.split()) if text else 0

def truncate_text(text: str, max_length: int = 500) -> str:
    if not text:
        return ""
    return text[:max_length] + "..." if len(text) > max_length else text
