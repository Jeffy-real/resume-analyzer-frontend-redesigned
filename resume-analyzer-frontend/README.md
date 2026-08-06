# Resumely — Smart Resume Analyzer Frontend

Responsive React/Vite frontend for the AI/ML internship capstone. It is intentionally frontend-only: file analysis is represented by realistic mock data so you can connect it to a Python API afterwards.

## Run locally

```bash
npm install
npm run dev
```

## Connect the backend

The UI interaction lives in `src/App.jsx`:

1. Replace `analyzeResume()` with a `FormData` POST request containing `file` and `selectedRole`.
2. Set the received response in state instead of using the `analysis` constant.
3. Have your backend return an object shaped like the mock `analysis` data: scores, matched/missing skills, section checks, and feedback tips.

Example API contract:

```json
{
  "score": 82,
  "ats": 76,
  "matchedSkills": ["Python", "TensorFlow"],
  "missingSkills": ["Docker", "AWS"],
  "sections": [{ "label": "Projects", "status": "review", "text": "Add measurable outcomes" }],
  "tips": [{ "number": "01", "title": "Add role keywords", "text": "...", "impact": "High impact" }]
}
```

## Relume hand-off

The visual layout maps cleanly to Relume sections:

- Header/navigation
- Hero with score/keyword cards
- Resume upload + role selector form
- Three-column benefit strip
- Analysis dashboard: score cards, skills gap, sections, feedback
- Three-step “How it works” section and footer

You can import/rebuild those blocks in Relume, then retain the interaction and API logic in `src/App.jsx` or transfer the same class structure to the exported Relume project.
