import re

def clean_text(text: str) -> str:
    if not text:
        return ""

    # Remove control characters but keep newlines and tabs
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    # Normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Collapse runs of blank lines to a single blank line
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Collapse spaces within each line
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]

    return '\n'.join(lines).strip()

def extract_sections(text: str) -> dict:
    from utils.constants import SECTION_KEYWORDS

    sections = {}
    lines = text.split('\n')
    current_section = 'general'
    current_content = []

    for line in lines:
        line_lower = line.lower().strip()
        found_section = None

        for section_name, keywords in SECTION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in line_lower and len(line.strip()) < 50:
                    found_section = section_name
                    break
            if found_section:
                break

        if found_section:
            if current_content:
                sections[current_section] = ' '.join(current_content)
            current_section = found_section
            current_content = []
        else:
            current_content.append(line)

    if current_content:
        sections[current_section] = ' '.join(current_content)

    return sections

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
