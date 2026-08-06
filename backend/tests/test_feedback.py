import pytest
from services.feedback_engine import FeedbackEngine

class TestFeedbackEngine:
    def setup_method(self):
        self.engine = FeedbackEngine()

    def test_generate_feedback_returns_list(self):
        analysis_data = {
            'contact_info': {'email': 'test@example.com'},
            'skills': ['Python', 'Java', 'SQL'],
            'sections': {'summary': 'Experienced developer'}
        }
        feedback = self.engine.generate_feedback(analysis_data)
        assert isinstance(feedback, list)

    def test_generate_feedback_includes_missing_contact(self):
        analysis_data = {
            'contact_info': {},
            'skills': ['Python'],
            'sections': {}
        }
        feedback = self.engine.generate_feedback(analysis_data)
        categories = [f['category'] for f in feedback]
        assert 'Contact' in categories

    def test_generate_feedback_includes_missing_skills(self):
        analysis_data = {
            'contact_info': {'email': 'test@example.com'},
            'skills': [],
            'sections': {}
        }
        feedback = self.engine.generate_feedback(analysis_data)
        categories = [f['category'] for f in feedback]
        assert 'Skills' in categories

    def test_generate_feedback_with_ats_data(self):
        analysis_data = {
            'contact_info': {'email': 'test@example.com'},
            'skills': ['Python'],
            'sections': {}
        }
        ats_data = {
            'missing_skills': ['Docker', 'Kubernetes', 'AWS']
        }
        feedback = self.engine.generate_feedback(analysis_data, ats_data)
        assert isinstance(feedback, list)

    def test_feedback_item_structure(self):
        analysis_data = {
            'contact_info': {},
            'skills': [],
            'sections': {}
        }
        feedback = self.engine.generate_feedback(analysis_data)
        if feedback:
            item = feedback[0]
            assert 'number' in item
            assert 'category' in item
            assert 'title' in item
            assert 'text' in item
            assert 'impact' in item

    def test_feedback_is_limited(self):
        analysis_data = {
            'contact_info': {},
            'skills': [],
            'sections': {}
        }
        feedback = self.engine.generate_feedback(analysis_data)
        assert len(feedback) <= 6
