import os
from models.schemas import ParsedResume
from utils.pdf_parser import parse_pdf
from utils.docx_parser import parse_docx
from utils.text_cleaner import extract_sections, clean_text
from utils.helpers import extract_contact_info
from services.keyword_engine import KeywordExtractor

class ResumeParser:
    def __init__(self):
        self.keyword_extractor = KeywordExtractor()

    def parse(self, file_path: str, original_filename: str) -> ParsedResume:
        ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''

        if ext == 'pdf':
            text = parse_pdf(file_path)
        elif ext == 'docx':
            text = parse_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")

        text = clean_text(text)
        sections = extract_sections(text)
        contact_info = extract_contact_info(text)
        skills = self.keyword_extractor.extract_skills(text)

        return ParsedResume(
            text=text,
            filename=original_filename,
            file_type=ext,
            sections=sections,
            skills=skills,
            contact_info=contact_info,
            education=self._extract_list(sections.get('education', '')),
            experience=self._extract_list(sections.get('experience', '')),
            projects=self._extract_list(sections.get('projects', ''))
        )

    def _extract_list(self, text: str) -> list:
        if not text:
            return []
        items = [item.strip() for item in text.split(',') if item.strip()]
        return items[:10]

    def validate_parsed_resume(self, parsed: ParsedResume) -> tuple:
        if not parsed.text or len(parsed.text.strip()) < 100:
            return False, "Resume text is too short or empty"

        if not parsed.contact_info.get('email'):
            return False, "No email address found in resume"

        return True, "Valid resume"
