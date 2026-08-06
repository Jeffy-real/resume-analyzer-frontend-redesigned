import json
from pathlib import Path
from typing import List, Set
from utils.text_cleaner import normalize_text

class KeywordExtractor:
    def __init__(self):
        self.skills_db = self._load_skills_db()

    def _load_skills_db(self) -> Set[str]:
        skills_path = Path(__file__).parent.parent / 'data' / 'skills.json'
        if skills_path.exists():
            with open(skills_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return set(skill.lower() for skill in data.get('skills', []))
        return set()

    def extract_skills(self, text: str) -> List[str]:
        if not text:
            return []

        normalized_text = normalize_text(text)
        words = set(normalized_text.split())

        found_skills = []
        for skill in self.skills_db:
            skill_lower = skill.lower()
            if skill_lower in normalized_text:
                found_skills.append(skill.title())

        return list(set(found_skills))

    def extract_keywords(self, text: str) -> List[str]:
        normalized_text = normalize_text(text)
        keywords = []

        for word in normalized_text.split():
            if len(word) > 3 and word.isalpha():
                keywords.append(word)

        return list(set(keywords))

    def compare_with_role(self, resume_text: str, role_keywords: List[str]) -> dict:
        normalized_text = normalize_text(resume_text)

        matched = []
        missing = []

        for keyword in role_keywords:
            if keyword.lower() in normalized_text:
                matched.append(keyword)
            else:
                missing.append(keyword)

        return {
            'matched': matched,
            'missing': missing,
            'match_percentage': round((len(matched) / len(role_keywords)) * 100, 2) if role_keywords else 0
        }
