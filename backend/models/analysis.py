from datetime import datetime
from models.database import db
import json

class Analysis(db.Model):
    __tablename__ = 'analyses'

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    target_role = db.Column(db.String(100), nullable=True)
    role_recommendations = db.Column(db.Text, nullable=True)

    overall_score = db.Column(db.Integer, nullable=True)
    ats_score = db.Column(db.Integer, nullable=True)

    matched_skills = db.Column(db.Text, nullable=True)
    missing_skills = db.Column(db.Text, nullable=True)

    section_scores = db.Column(db.Text, nullable=True)
    feedback = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_role_recommendations(self, recommendations: list):
        self.role_recommendations = json.dumps(recommendations)

    def get_role_recommendations(self) -> list:
        return json.loads(self.role_recommendations) if self.role_recommendations else []

    def set_matched_skills(self, skills: list):
        self.matched_skills = json.dumps(skills)

    def get_matched_skills(self) -> list:
        return json.loads(self.matched_skills) if self.matched_skills else []

    def set_missing_skills(self, skills: list):
        self.missing_skills = json.dumps(skills)

    def get_missing_skills(self) -> list:
        return json.loads(self.missing_skills) if self.missing_skills else []

    def set_section_scores(self, scores: dict):
        self.section_scores = json.dumps(scores)

    def get_section_scores(self) -> dict:
        return json.loads(self.section_scores) if self.section_scores else {}

    def set_feedback(self, feedback: list):
        if isinstance(feedback, (dict, list)):
            self.feedback = json.dumps(feedback)
        else:
            self.feedback = str(feedback)

    def get_feedback(self) -> list:
        if not self.feedback:
            return []
        try:
            val = json.loads(self.feedback)
            if isinstance(val, list):
                return val
            elif isinstance(val, dict):
                return val.get('recommendations', [])
        except Exception:
            pass
        return []

    def set_ai_analysis(self, ai_data: dict):
        self.overall_score = ai_data.get('overall_score', self.overall_score)
        self.ats_score = ai_data.get('ats_score', self.ats_score)
        self.target_role = ai_data.get('target_role', self.target_role)
        self.set_matched_skills(ai_data.get('matched_skills', []))
        self.set_missing_skills(ai_data.get('missing_skills', []))
        self.feedback = json.dumps(ai_data)

    def get_ai_analysis(self) -> dict:
        if not self.feedback:
            return {}
        try:
            data = json.loads(self.feedback)
            if isinstance(data, dict) and 'overall_score' in data:
                return data
        except Exception:
            pass
        return {}

    def to_dict(self):
        ai = self.get_ai_analysis()
        base_dict = {
            'id': self.id,
            'resume_id': self.resume_id,
            'target_role': self.target_role,
            'role_recommendations': self.get_role_recommendations(),
            'overall_score': self.overall_score or ai.get('overall_score', 0),
            'ats_score': self.ats_score or ai.get('ats_score', 0),
            'skills_score': ai.get('skills_score', 75),
            'experience_score': ai.get('experience_score', 75),
            'projects_score': ai.get('projects_score', 75),
            'education_score': ai.get('education_score', 75),
            'quality_score': ai.get('quality_score', 75),
            'matched_skills': self.get_matched_skills() or ai.get('matched_skills', []),
            'missing_skills': self.get_missing_skills() or ai.get('missing_skills', []),
            'strengths': ai.get('strengths', []),
            'weaknesses': ai.get('weaknesses', []),
            'recommendations': ai.get('recommendations', []),
            'keywords': ai.get('keywords', []),
            'section_scores': self.get_section_scores(),
            'feedback': ai.get('recommendations') or self.get_feedback(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        return base_dict
