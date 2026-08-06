from datetime import datetime
from models.database import db
import json

class Resume(db.Model):
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    extracted_text = db.Column(db.Text, nullable=True)
    parsed_data = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    analyses = db.relationship('Analysis', backref='resume', lazy=True, cascade='all, delete-orphan')

    def set_parsed_data(self, data: dict):
        self.parsed_data = json.dumps(data)

    def get_parsed_data(self) -> dict:
        return json.loads(self.parsed_data) if self.parsed_data else {}

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'has_text': bool(self.extracted_text),
            'text_length': len(self.extracted_text) if self.extracted_text else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
