import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any

# Configurable dimension weights
SCORE_WEIGHTS = {
    'ats': 0.20,
    'skills': 0.25,
    'experience': 0.20,
    'projects': 0.15,
    'education': 0.10,
    'quality': 0.10
}

class AIAnalyzer:
    def __init__(self):
        self.weights = SCORE_WEIGHTS
        self.roles_data = self._load_roles()

    def _load_roles(self) -> Dict[str, Any]:
        candidates = [
            Path(__file__).parent.parent / 'data' / 'roles.json',
            Path(__file__).parent.parent.parent / 'backend' / 'data' / 'roles.json',
            Path(__file__).parent.parent.parent / 'resume-analyzer-frontend' / 'src' / 'data' / 'roles.json',
            Path.cwd() / 'backend' / 'data' / 'roles.json',
            Path.cwd() / 'data' / 'roles.json',
        ]
        for p in candidates:
            if p.exists():
                try:
                    with open(p, 'r', encoding='utf-8') as f:
                        return json.load(f)
                except Exception:
                    pass
        return {}

    def get_available_roles(self) -> List[str]:
        return list(self.roles_data.keys())

    def analyze(self, resume_text: str, target_role: str, parsed_data: Dict[str, Any] = None) -> Dict[str, Any]:
        parsed_data = parsed_data or {}
        normalized_text = resume_text.lower() if resume_text else ''

        # 1. Target Role Lookup & Keyword Extraction
        role_info = self.roles_data.get(target_role)
        if not role_info and self.roles_data:
            # Fall back to first available role if requested role isn't in roles.json
            fallback_role = list(self.roles_data.keys())[0]
            role_info = self.roles_data[fallback_role]
            target_role = fallback_role

        required_skills = role_info.get('required_skills', []) if role_info else []
        preferred_skills = role_info.get('preferred_skills', []) if role_info else []
        role_keywords = role_info.get('keywords', []) if role_info else []
        tools_frameworks = (role_info.get('tools', []) + role_info.get('frameworks', [])) if role_info else []

        all_role_terms = list(set(required_skills + preferred_skills + role_keywords + tools_frameworks))

        # 2. Skill Matching
        matched_skills = []
        missing_skills = []
        for skill in (required_skills + preferred_skills):
            if self._contains_term(normalized_text, skill):
                if skill not in matched_skills:
                    matched_skills.append(skill)
            else:
                if skill not in missing_skills:
                    missing_skills.append(skill)

        # Additional candidate skills from resume
        extracted_skills = parsed_data.get('skills', [])
        for skill in extracted_skills:
            if self._contains_term(normalized_text, skill) and skill not in matched_skills:
                matched_skills.append(skill)

        # 3. Calculate 6 Dimensional Scores (0-100)

        # A. ATS Score (20%)
        matched_terms = [t for t in all_role_terms if self._contains_term(normalized_text, t)]
        matched_req = [s for s in required_skills if self._contains_term(normalized_text, s)]
        ats_score = self._calc_ats_score(matched_terms, all_role_terms, matched_req, required_skills)

        # B. Skills Score (25%)
        skills_score = self._calc_skills_score(matched_req, required_skills, matched_skills, extracted_skills)

        # C. Experience Score (20%)
        experience_score = self._calc_experience_score(resume_text, parsed_data, all_role_terms)

        # D. Projects Score (15%)
        projects_score = self._calc_projects_score(resume_text, parsed_data, tools_frameworks)

        # E. Education Score (10%)
        education_score = self._calc_education_score(resume_text, parsed_data)

        # F. Quality Score (10%)
        quality_score = self._calc_quality_score(resume_text, parsed_data)

        # 4. Overall Weighted Score Calculation
        overall_score = round(
            ats_score * self.weights['ats'] +
            skills_score * self.weights['skills'] +
            experience_score * self.weights['experience'] +
            projects_score * self.weights['projects'] +
            education_score * self.weights['education'] +
            quality_score * self.weights['quality']
        )
        overall_score = min(max(overall_score, 0), 100)

        # 5. Generate AI Insights (Strengths, Weaknesses, Recommendations, Keywords)
        strengths = self._generate_strengths(
            overall_score, ats_score, skills_score, experience_score,
            projects_score, education_score, quality_score, matched_skills
        )
        weaknesses = self._generate_weaknesses(
            ats_score, skills_score, experience_score, projects_score,
            education_score, quality_score, missing_skills, target_role
        )
        recommendations = self._generate_recommendations(
            target_role, missing_skills, experience_score, projects_score, ats_score
        )
        recommended_keywords = [k for k in all_role_terms if not self._contains_term(normalized_text, k)][:12]

        return {
            "overall_score": overall_score,
            "ats_score": ats_score,
            "skills_score": skills_score,
            "experience_score": experience_score,
            "projects_score": projects_score,
            "education_score": education_score,
            "quality_score": quality_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "keywords": recommended_keywords,
            "target_role": target_role,
            "score_weights": self.weights
        }

    def _contains_term(self, text: str, term: str) -> bool:
        if not text or not term:
            return False
        pattern = r'\b' + re.escape(term.lower()) + r'\b'
        return bool(re.search(pattern, text))

    def _calc_ats_score(self, matched_terms, all_terms, matched_req, req_skills) -> int:
        if not all_terms:
            return 70
        keyword_pct = (len(matched_terms) / len(all_terms)) * 60
        req_pct = (len(matched_req) / len(req_skills)) * 40 if req_skills else 40
        return min(round(keyword_pct + req_pct), 100)

    def _calc_skills_score(self, matched_req, req_skills, matched_skills, extracted_skills) -> int:
        req_score = (len(matched_req) / len(req_skills)) * 70 if req_skills else 50
        breadth_score = min((len(matched_skills) / 10) * 30, 30)
        return min(round(req_score + breadth_score), 100)

    def _calc_experience_score(self, text: str, parsed_data: dict, role_terms: list) -> int:
        sections = parsed_data.get('sections', {})
        exp_text = sections.get('experience', '') or text

        score = 40  # base
        word_count = len(exp_text.split())
        if word_count > 150:
            score += 20
        elif word_count > 75:
            score += 10

        # Check for role keywords in experience
        matched_in_exp = sum(1 for t in role_terms if self._contains_term(exp_text.lower(), t))
        score += min(matched_in_exp * 4, 25)

        # Check for quantified metrics (% or numbers)
        has_metrics = bool(re.search(r'\b\d+(?:%|\+|k|m|x)?\b', exp_text))
        if has_metrics:
            score += 15

        return min(score, 100)

    def _calc_projects_score(self, text: str, parsed_data: dict, tools: list) -> int:
        sections = parsed_data.get('sections', {})
        proj_text = sections.get('projects', '') or text

        score = 30
        if 'project' in text.lower():
            score += 25

        matched_tools = sum(1 for tool in tools if self._contains_term(proj_text.lower(), tool))
        score += min(matched_tools * 10, 30)

        if len(proj_text.split()) > 50:
            score += 15

        return min(score, 100)

    def _calc_education_score(self, text: str, parsed_data: dict) -> int:
        lower_text = text.lower()
        score = 40
        if any(term in lower_text for term in ['b.s', 'b.t', 'bachelor', 'master', 'm.s', 'degree', 'university', 'college']):
            score += 35
        if any(term in lower_text for term in ['computer science', 'engineering', 'information technology', 'data science', 'math']):
            score += 15
        if any(term in lower_text for term in ['certified', 'certification', 'aws', 'cloud', 'coursera']):
            score += 10
        return min(score, 100)

    def _calc_quality_score(self, text: str, parsed_data: dict) -> int:
        contact_info = parsed_data.get('contact_info', {})
        score = 30
        if contact_info.get('email'):
            score += 15
        if contact_info.get('phone'):
            score += 15
        if contact_info.get('linkedin') or contact_info.get('github'):
            score += 10

        word_count = len(text.split()) if text else 0
        if 200 <= word_count <= 900:
            score += 30
        elif word_count > 100:
            score += 15

        return min(score, 100)

    def _generate_strengths(self, overall, ats, skills, exp, proj, edu, qual, matched_skills) -> List[str]:
        strengths = []
        if overall >= 80:
            strengths.append("High overall resume alignment for candidate evaluation.")
        if ats >= 75:
            strengths.append("Strong ATS compatibility and keyword density for automated parsers.")
        if skills >= 75:
            strengths.append(f"Solid technical skill match including {', '.join(matched_skills[:3])}.")
        if exp >= 75:
            strengths.append("Work experience contains relevant domain terminology and quantifiable impacts.")
        if proj >= 75:
            strengths.append("Projects section effectively highlights practical engineering application.")
        if edu >= 75:
            strengths.append("Education and academic background align well with job requirements.")
        if len(strengths) < 2:
            strengths.append("Clear resume structure with identifiable contact and professional sections.")
            strengths.append("Good baseline technical skills inventory.")
        return strengths[:4]

    def _generate_weaknesses(self, ats, skills, exp, proj, edu, qual, missing_skills, target_role) -> List[str]:
        weaknesses = []
        if missing_skills:
            weaknesses.append(f"Missing key required skills for {target_role}: {', '.join(missing_skills[:3])}.")
        if ats < 70:
            weaknesses.append("ATS keyword density is below target threshold for automated screening.")
        if exp < 70:
            weaknesses.append("Work experience section lacks specific metrics, numbers, or role-specific action verbs.")
        if proj < 70:
            weaknesses.append("Projects section could more explicitly detail tools, frameworks, and achievements.")
        if edu < 70:
            weaknesses.append("Education or relevant technical certifications could be expanded.")
        if len(weaknesses) < 2:
            weaknesses.append("Professional summary could be more tightly tailored to target role expectations.")
        return weaknesses[:4]

    def _generate_recommendations(self, target_role, missing_skills, exp_score, proj_score, ats_score) -> List[str]:
        recs = []
        if missing_skills:
            recs.append(f"Incorporate missing core skills: {', '.join(missing_skills[:4])} directly into experience bullet points.")
        if ats_score < 80:
            recs.append(f"Tailor section headings and skill keywords to mirror the standard {target_role} job description.")
        if exp_score < 75:
            recs.append("Add quantified metrics (e.g., '% improvement', 'reduced latency by Xms', 'served Y users') to experience achievements.")
        if proj_score < 75:
            recs.append("Detail the specific technical stack (frameworks, databases, cloud tools) used in each featured project.")
        recs.append("Ensure consistent bullet point formatting and clear date ranges for all listed positions.")
        return recs[:5]
