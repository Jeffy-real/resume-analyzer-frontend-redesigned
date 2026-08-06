from typing import List, Dict
from models.schemas import SectionScore
from utils.helpers import count_words
from utils.text_cleaner import extract_sections

class ResumeScorer:
    def __init__(self):
        self.section_weights = {
            'contact': 15,
            'summary': 15,
            'skills': 25,
            'education': 15,
            'experience': 20,
            'projects': 10
        }
        self.total_points = 100

    def calculate_score(self, parsed_data: dict, extracted_text: str = None) -> Dict:
        sections = parsed_data.get('sections', {})
        skills = parsed_data.get('skills', [])
        contact_info = parsed_data.get('contact_info', {})
        education = parsed_data.get('education', [])
        experience = parsed_data.get('experience', [])
        projects = parsed_data.get('projects', [])

        text = extracted_text or ''

        section_scores = []

        contact_score = self._score_contact(contact_info)
        section_scores.append(SectionScore(
            label='Contact Information',
            status='complete' if contact_score >= 12 else 'review',
            text='Complete & Verifiable' if contact_score >= 12 else 'Missing contact details',
            pts=contact_score,
            max=15
        ))

        summary_score = self._score_summary(sections.get('summary', ''))
        section_scores.append(SectionScore(
            label='Professional Summary',
            status='complete' if summary_score >= 12 else 'review',
            text='Well Written' if summary_score >= 12 else 'Needs Improvement',
            pts=summary_score,
            max=15
        ))

        skills_score = self._score_skills(skills)
        section_scores.append(SectionScore(
            label='Skills & Technologies',
            status='complete' if skills_score >= 20 else 'review',
            text='Well Structured' if skills_score >= 20 else 'Add more skills',
            pts=skills_score,
            max=25
        ))

        education_score = self._score_education(education, sections.get('education', ''))
        section_scores.append(SectionScore(
            label='Education & Certifications',
            status='complete' if education_score >= 12 else 'review',
            text='Complete' if education_score >= 12 else 'Needs details',
            pts=education_score,
            max=15
        ))

        experience_score = self._score_experience(experience, sections.get('experience', ''))
        section_scores.append(SectionScore(
            label='Projects & Experience',
            status='complete' if experience_score >= 16 else 'review',
            text='Well Documented' if experience_score >= 16 else 'Add quantified metrics',
            pts=experience_score,
            max=20
        ))

        completeness_score = self._score_completeness(text, sections)
        section_scores.append(SectionScore(
            label='Resume Completeness',
            status='complete' if completeness_score >= 8 else 'review',
            text='Standard Layout' if completeness_score >= 8 else 'Incomplete',
            pts=completeness_score,
            max=10
        ))

        total_score = sum(score.pts for score in section_scores)

        return {
            'overall_score': min(total_score, 100),
            'sections': section_scores,
            'weak_sections': self._identify_weak_sections(section_scores)
        }

    def _score_contact(self, contact_info: dict) -> int:
        score = 0
        if contact_info.get('email'):
            score += 5
        if contact_info.get('phone'):
            score += 4
        if contact_info.get('linkedin'):
            score += 3
        if contact_info.get('github'):
            score += 3
        return min(score, 15)

    def _score_summary(self, summary: str) -> int:
        if not summary:
            return 0
        word_count = count_words(summary)
        if word_count >= 50:
            return 15
        elif word_count >= 30:
            return 12
        elif word_count >= 15:
            return 8
        return 5

    def _score_skills(self, skills: list) -> int:
        if not skills:
            return 0
        skill_count = len(skills)
        if skill_count >= 15:
            return 25
        elif skill_count >= 10:
            return 20
        elif skill_count >= 5:
            return 15
        return 10

    def _score_education(self, education: list, education_text: str) -> int:
        score = 0
        if education or education_text:
            score += 8
            if len(education) >= 2 or count_words(education_text) >= 50:
                score += 7
        return min(score, 15)

    def _score_experience(self, experience: list, experience_text: str) -> int:
        score = 0
        if experience or experience_text:
            score += 8
            word_count = count_words(experience_text)
            if word_count >= 200:
                score += 12
            elif word_count >= 100:
                score += 8
            else:
                score += 4
        return min(score, 20)

    def _score_completeness(self, text: str, sections: dict) -> int:
        score = 0
        word_count = count_words(text)
        if word_count >= 300:
            score += 4
        elif word_count >= 150:
            score += 2

        if len(sections) >= 5:
            score += 4
        elif len(sections) >= 3:
            score += 2

        if word_count <= 800:
            score += 2

        return min(score, 10)

    def _identify_weak_sections(self, section_scores: List[SectionScore]) -> List[str]:
        weak = []
        for score in section_scores:
            if score.pts < score.max * 0.6:
                weak.append(score.label)
        return weak
