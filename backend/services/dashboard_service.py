from typing import Dict, List
from models.resume import Resume
from models.analysis import Analysis
from services.ats_checker import ATSChecker
from services.feedback_engine import FeedbackEngine

class DashboardService:
    def __init__(self):
        self.ats_checker = ATSChecker()
        self.feedback_engine = FeedbackEngine()

    def get_dashboard_data(self, analysis_id: int) -> Dict:
        analysis = Analysis.query.get(analysis_id)
        if not analysis:
            return {'error': 'Analysis not found'}

        resume = Resume.query.get(analysis.resume_id)
        if not resume:
            return {'error': 'Resume not found'}

        parsed_data = resume.get_parsed_data()
        section_scores = analysis.get_section_scores()

        sections = []
        section_mapping = {
            'Contact Information': 'contact',
            'Professional Summary': 'summary',
            'Skills & Technologies': 'skills',
            'Education & Certifications': 'education',
            'Projects & Experience': 'experience',
            'Resume Completeness': 'completeness'
        }

        for label, default_key in section_mapping.items():
            score_data = section_scores.get(label, {})
            sections.append({
                'label': label,
                'status': score_data.get('status', 'review'),
                'text': self._get_section_text(label, score_data.get('pts', 0)),
                'pts': score_data.get('pts', 0),
                'max': score_data.get('max', 15)
            })

        dashboard_data = {
            'analysis_id': analysis.id,
            'resume_id': resume.id,
            'resume_name': resume.original_filename,
            'target_role': analysis.target_role,

            'overall_score': analysis.overall_score or 0,
            'ats_score': analysis.ats_score or 0,

            'matched_skills': analysis.get_matched_skills(),
            'missing_skills': analysis.get_missing_skills(),

            'sections': sections,
            'feedback': analysis.get_feedback(),

            'parsed_data': {
                'contact_info': parsed_data.get('contact_info', {}),
                'skills': parsed_data.get('skills', []),
                'sections': parsed_data.get('sections', {})
            },

            'analysis_summary': self._generate_summary(
                analysis.overall_score,
                analysis.ats_score,
                analysis.target_role
            )
        }

        return dashboard_data

    def _get_section_text(self, label: str, pts: int) -> str:
        text_map = {
            'Contact Information': 'Complete & Verifiable' if pts >= 12 else 'Missing contact details',
            'Professional Summary': 'Well Written' if pts >= 12 else 'Needs Role Focus',
            'Skills & Technologies': 'Well Structured' if pts >= 20 else 'Add more skills',
            'Education & Certifications': 'Complete' if pts >= 12 else 'Needs details',
            'Projects & Experience': 'Well Documented' if pts >= 16 else 'Add Quantified Metrics',
            'Resume Completeness': 'Standard Layout' if pts >= 8 else 'Incomplete'
        }
        return text_map.get(label, 'Needs Improvement')

    def _generate_summary(self, overall_score: int, ats_score: int, target_role: str) -> str:
        if overall_score >= 80:
            quality = 'Strong'
        elif overall_score >= 60:
            quality = 'Good'
        else:
            quality = 'Needs Improvement'

        role_text = f" for {target_role}" if target_role else ""

        return f"{quality} resume{role_text} with {overall_score}% overall score and {ats_score}% ATS compatibility."

    def get_available_roles(self) -> List[str]:
        return self.ats_checker.get_available_roles()
