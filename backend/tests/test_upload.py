import pytest
from utils.validators import allowed_file, validate_file, get_file_extension

class TestValidators:
    def test_allowed_file_pdf(self):
        assert allowed_file("resume.pdf") == True

    def test_allowed_file_docx(self):
        assert allowed_file("resume.docx") == True

    def test_allowed_file_invalid(self):
        assert allowed_file("resume.exe") == False
        assert allowed_file("resume.zip") == False
        assert allowed_file("resume") == False

    def test_get_file_extension(self):
        assert get_file_extension("resume.pdf") == "pdf"
        assert get_file_extension("document.docx") == "docx"
        assert get_file_extension("noextension") == ""

    def test_allowed_file_case_insensitive(self):
        assert allowed_file("resume.PDF") == True
        assert allowed_file("resume.DOCX") == True

    def test_allowed_file_multiple_dots(self):
        assert allowed_file("my.resume.final.pdf") == True
