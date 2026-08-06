# Smart Resume Analyzer Backend

A Flask-based backend for the **Smart Resume Analyzer with AI-Based Feedback** capstone project.

## Tech Stack

- **Language**: Python 3.11+
- **Framework**: Flask
- **Database**: SQLite (via SQLAlchemy)
- **Document Parsing**: pdfplumber, PyPDF2, python-docx
- **NLP**: spaCy, NLTK
- **Testing**: pytest

## Project Structure

```
backend/
├── app.py                  # Flask app entry point
├── config.py               # Configuration settings
├── requirements.txt        # Dependencies
├── routes/                 # API route handlers
│   ├── upload.py           # Module 1: Resume upload & parsing
│   ├── analysis.py         # Module 2: Resume score analyzer
│   ├── ats.py              # Module 3: ATS keyword checker
│   ├── feedback.py         # Module 4: Smart feedback system
│   ├── dashboard.py        # Module 5: Dashboard API
│   └── health.py           # Health check endpoint
├── services/               # Business logic
│   ├── resume_parser.py    # Parsing orchestration
│   ├── resume_scoring.py   # Score calculation
│   ├── ats_checker.py      # ATS keyword matching
│   ├── keyword_engine.py   # Keyword extraction
│   ├── feedback_engine.py  # Feedback generation
│   └── dashboard_service.py# Dashboard data assembly
├── utils/                  # Helpers
│   ├── pdf_parser.py       # PDF text extraction
│   ├── docx_parser.py      # DOCX text extraction
│   ├── file_handler.py     # File save/delete
│   ├── text_cleaner.py     # Text normalization
│   ├── validators.py       # File validation
│   ├── constants.py        # Shared constants
│   └── helpers.py          # Small utilities
├── models/                 # Database models
│   ├── database.py         # SQLAlchemy setup
│   ├── resume.py           # Resume model
│   ├── analysis.py         # Analysis model
│   └── schemas.py          # Data classes
├── data/                   # JSON keyword databases
│   ├── roles.json          # Job role keywords
│   ├── keywords.json       # Industry keywords
│   └── skills.json         # Skill database
└── tests/                  # pytest test cases
    ├── test_upload.py      # File validation tests
    ├── test_parser.py      # Text cleaning & parsing tests
    ├── test_scoring.py     # Resume scoring tests
    ├── test_ats.py         # ATS keyword matching tests
    ├── test_feedback.py    # Feedback generation tests
    ├── test_dashboard.py   # Dashboard service tests
    └── test_api.py         # Full API endpoint & error handling tests
```

## Installation

### 1. Create a virtual environment

```bash
cd backend
python -m venv venv
```

### 2. Activate the environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Download spaCy model (optional, for NLP features)

```bash
python -m spacy download en_core_web_sm
```

### 5. Run the server

```bash
python app.py
```

The server runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| POST   | `/api/upload`                | Upload & parse a resume (PDF/DOCX)   |
| POST   | `/api/analyze`               | Analyze resume structure & score     |
| POST   | `/api/ats`                   | Run ATS keyword check for a role     |
| GET    | `/api/roles`                 | List available job roles             |
| POST   | `/api/feedback`              | Generate improvement suggestions     |
| GET    | `/api/dashboard/<analysis_id>` | Fetch dashboard data                |
| GET    | `/api/health`                | Health check                        |

### POST /api/upload

Upload a PDF or DOCX resume file.

**Request**: `multipart/form-data` with a `file` field.

**Response (200)**:
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume_id": 1,
  "filename": "resume.pdf",
  "file_type": "pdf",
  "file_size": 245000,
  "text_length": 1200,
  "skills_found": 12,
  "contact_info": {
    "email": "candidate@example.com",
    "phone": "+1 555-123-4567",
    "linkedin": "linkedin.com/in/candidate",
    "github": "github.com/candidate"
  },
  "parsed_data": {
    "sections": { "skills": "Python, Java", "...": "..." },
    "skills": ["Python", "Java", "SQL"]
  }
}
```

### POST /api/analyze

Generate a resume score.

**Request body**:
```json
{ "resume_id": 1 }
```

**Response (200)**:
```json
{
  "message": "Analysis completed successfully",
  "analysis_id": 1,
  "overall_score": 78,
  "sections": [
    { "label": "Contact Information", "status": "complete", "text": "Complete & Verifiable", "pts": 15, "max": 15 }
  ],
  "weak_sections": ["Projects & Experience"]
}
```

### POST /api/ats

Run ATS keyword matching against a target role.

**Request body**:
```json
{ "resume_id": 1, "target_role": "Software Engineer" }
```

**Response (200)**:
```json
{
  "message": "ATS check completed successfully",
  "analysis_id": 1,
  "target_role": "Software Engineer",
  "category": "Software Engineering",
  "ats_score": 82,
  "matched_skills": ["Python", "SQL", "Git"],
  "missing_skills": ["Docker", "Kubernetes"],
  "matched_keywords": ["API", "testing", "algorithms"]
}
```

### POST /api/feedback

Generate smart improvement suggestions.

**Request body**:
```json
{ "resume_id": 1, "target_role": "Data Analyst" }
```

**Response (200)**:
```json
{
  "message": "Feedback generated successfully",
  "analysis_id": 1,
  "feedback": [
    {
      "number": "01",
      "category": "Contact",
      "title": "Add Email Address",
      "text": "Include a professional email address...",
      "impact": "High Impact"
    }
  ],
  "total_suggestions": 6
}
```

### GET /api/dashboard/<analysis_id>

Fetch complete dashboard data for an analysis.

**Response (200)**:
```json
{
  "analysis_id": 1,
  "resume_id": 1,
  "resume_name": "resume.pdf",
  "target_role": "Software Engineer",
  "overall_score": 78,
  "ats_score": 82,
  "matched_skills": ["Python", "SQL", "Git"],
  "missing_skills": ["Docker", "Kubernetes"],
  "sections": [],
  "feedback": [],
  "analysis_summary": "Strong resume for Software Engineer..."
}
```

### GET /api/health

Health check endpoint.

```json
{ "status": "healthy", "database": "connected", "resumes_stored": 3 }
```

## Error Handling

The API returns meaningful HTTP status codes and JSON error messages:

- `400` — Invalid request (bad file type, empty file, missing resume ID, invalid role)
- `404` — Resource not found (resume or analysis does not exist)
- `413` — File too large (over 10MB)
- `500` — Internal server error

Error response format:
```json
{ "error": "Description of what went wrong" }
```

## Supported Job Roles

Role keywords are stored in `data/roles.json`. To add a new role, add an entry with required skills, preferred skills, keywords, tools, and frameworks.

Currently supported roles:
- Software Engineer
- Web Developer
- Data Analyst
- AI Engineer
- Cloud Engineer

## Running Tests

The suite contains 53 test cases covering upload validation, PDF/DOCX parsing, resume scoring, ATS keyword matching, feedback generation, dashboard data, and all API endpoints including error handling.

```bash
cd backend
pytest
```

To run with coverage:

```bash
pytest --cov=. --cov-report=term-missing
```

## Modules Overview

1. **Module 1 — Resume Upload & Parsing**: Validates and extracts text from PDF/DOCX resumes, detects sections, and extracts contact information and skills.
2. **Module 2 — Resume Score Analyzer**: Scores resumes out of 100 across structure, skills, education, projects, contact info, and completeness.
3. **Module 3 — ATS Keyword Checker**: Compares resume keywords against role-specific requirements and calculates ATS compatibility.
4. **Module 4 — Smart Feedback System**: Generates categorized, prioritized improvement suggestions.
5. **Module 5 — Dashboard**: Assembles all results into a single JSON payload for the frontend.
