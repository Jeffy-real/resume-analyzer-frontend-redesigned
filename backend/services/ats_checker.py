import json
from pathlib import Path
from typing import Dict, List
from utils.text_cleaner import normalize_text

class ATSChecker:
    def __init__(self):
        self.roles_data = self._load_roles()

    def _load_roles(self) -> Dict:
        roles_path = Path(__file__).parent.parent / 'data' / 'roles.json'
        if roles_path.exists():
            with open(roles_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def get_available_roles(self) -> List[str]:
        return list(self.roles_data.keys())

    def check_resume(self, resume_text: str, target_role: str) -> Dict:
        if target_role not in self.roles_data:
            return {
                'error': f"Role '{target_role}' not found. Available roles: {', '.join(self.get_available_roles())}"
            }

        role_data = self.roles_data[target_role]
        normalized_text = normalize_text(resume_text)

        all_keywords = self._get_all_role_keywords(role_data)

        matched_keywords = []
        missing_keywords = []

        for keyword in all_keywords:
            if keyword.lower() in normalized_text:
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)

        required_skills = role_data.get('required_skills', [])
        matched_required = [s for s in required_skills if s.lower() in normalized_text]
        missing_required = [s for s in required_skills if s.lower() not in normalized_text]

        preferred_skills = role_data.get('preferred_skills', [])
        matched_preferred = [s for s in preferred_skills if s.lower() in normalized_text]

        ats_score = self._calculate_ats_score(
            len(matched_keywords),
            len(all_keywords),
            len(matched_required),
            len(required_skills)
        )

        return {
            'target_role': target_role,
            'category': role_data.get('category', 'General'),
            'ats_score': ats_score,
            'matched_keywords': matched_keywords,
            'missing_keywords': missing_keywords[:15],
            'matched_skills': matched_required + matched_preferred,
            'missing_skills': missing_required,
            'required_skills_match': {
                'matched': len(matched_required),
                'total': len(required_skills),
                'percentage': round((len(matched_required) / len(required_skills)) * 100, 1) if required_skills else 0
            }
        }

    def _get_all_role_keywords(self, role_data: Dict) -> List[str]:
        keywords = []
        keywords.extend(role_data.get('required_skills', []))
        keywords.extend(role_data.get('preferred_skills', []))
        keywords.extend(role_data.get('keywords', []))
        keywords.extend(role_data.get('tools', []))
        keywords.extend(role_data.get('frameworks', []))
        return list(set(keywords))

    def _calculate_ats_score(self, matched_count: int, total_count: int, matched_required: int, total_required: int) -> int:
        if total_count == 0:
            return 0

        keyword_score = (matched_count / total_count) * 60

        required_score = (matched_required / total_required) * 40 if total_required > 0 else 0

        total_score = keyword_score + required_score
        return min(round(total_score), 100)

    def get_role_suggestions(self, resume_text: str, top_n: int = None) -> List[Dict]:
        suggestions = []
        normalized_text = normalize_text(resume_text)

        for role_name, role_data in self.roles_data.items():
            all_keywords = self._get_all_role_keywords(role_data)
            matched = sum(1 for k in all_keywords if k.lower() in normalized_text)
            match_percentage = round((matched / len(all_keywords)) * 100, 1) if all_keywords else 0

            required_skills = role_data.get('required_skills', [])
            missing_required = [s for s in required_skills if s.lower() not in normalized_text]
            matched_required = len(required_skills) - len(missing_required)
            ats_score = self._calculate_ats_score(
                matched,
                len(all_keywords),
                matched_required,
                len(required_skills)
            )

            suggestions.append({
                'role': role_name,
                'category': role_data.get('category', 'General'),
                'match_percentage': match_percentage,
                'matched_keywords': matched,
                'total_keywords': len(all_keywords),
                'ats_score': ats_score,
                'required_skills': required_skills,
                'missing_required_skills': missing_required,
            })

        suggestions.sort(key=lambda x: x['match_percentage'], reverse=True)
        if top_n:
            return suggestions[:top_n]
        return suggestions
