import pytest
import os
import tempfile
from services.resume_parser import ResumeParser
from utils.pdf_parser import parse_pdf
from utils.docx_parser import parse_docx
from utils.text_cleaner import clean_text, extract_sections, normalize_text

class TestResumeParser:
    def setup_method(self):
        self.parser = ResumeParser()

    def test_clean_text_collapses_spaces_within_lines(self):
        text = "Hello    World    Test"
        result = clean_text(text)
        assert result == "Hello World Test"

    def test_clean_text_preserves_newlines(self):
        text = "Hello World\nSkills: Python, SQL"
        result = clean_text(text)
        assert "\n" in result
        assert "Python" in result.split("\n")[1]

    def test_clean_text_removes_control_characters(self):
        text = "Hello\x00World\x1fTest"
        result = clean_text(text)
        assert "\x00" not in result
        assert "\x1f" not in result

    def test_extract_sections_finds_contact(self):
        text = "CONTACT\nemail@example.com\n\nSKILLS\nPython, Java"
        sections = extract_sections(text)
        assert 'contact' in sections or 'skills' in sections

    def test_normalize_text_lowercases(self):
        text = "PYTHON JAVA SQL"
        result = normalize_text(text)
        assert result == "python java sql"

    def test_normalize_text_removes_punctuation(self):
        text = "Python, Java; SQL!"
        result = normalize_text(text)
        assert "," not in result
        assert ";" not in result

class TestPDFParser:
    def test_parse_pdf_raises_on_missing_file(self):
        with pytest.raises(Exception):
            parse_pdf("nonexistent.pdf")

class TestDOCXParser:
    def test_parse_docx_raises_on_missing_file(self):
        with pytest.raises(Exception):
            parse_docx("nonexistent.docx")
