import pdfplumber
from PyPDF2 import PdfReader
from utils.text_cleaner import clean_text

def extract_text_pdfplumber(file_path: str) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
            return clean_text(text)
    except Exception as e:
        raise ValueError(f"PDF parsing failed with pdfplumber: {str(e)}")

def extract_text_pypdf2(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        text = ''
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n'
        return clean_text(text)
    except Exception as e:
        raise ValueError(f"PDF parsing failed with PyPDF2: {str(e)}")

def parse_pdf(file_path: str) -> str:
    try:
        text = extract_text_pdfplumber(file_path)
        if text and len(text.strip()) >= 5:
            return text
    except Exception:
        pass

    try:
        text = extract_text_pypdf2(file_path)
        if text and len(text.strip()) >= 5:
            return text
    except Exception:
        pass

    raise ValueError("Failed to extract readable text from PDF. Ensure the file contains text and is not password protected.")
