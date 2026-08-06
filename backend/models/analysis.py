from datetime import datetime
from models.database import db
import json

class Analysis(db.Model):
    __tablename__ = 'analyses'

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    target_role = db.Column(db.String(100), nullable=True)

    overall_score = db.Column(db.Integer, nullable=True)
    ats_score = db.Column(db.Integer, nullable=True)

    matched_skills = db.Column(db.Text, nullable=True)
    missing_skills = db.Column(db.Text, nullable=True)

    section_scores = db.Column(db.Text, nullable=True)
    feedback = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
        self.feedback = json.dumps(feedback)

    def get_feedback(self) -> list:
        return json.loads(self.feedback) if self.feedback else []

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'target_role': self.target_role,
            'overall_score': self.overall_score,
            'ats_score': self.ats_score,
            'matched_skills': self.get_matched_skills(),
            'missing_skills': self.get_missing_skills(),
            'section_scores': self.get_section_scores(),
            'feedback': self.get_feedback(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
