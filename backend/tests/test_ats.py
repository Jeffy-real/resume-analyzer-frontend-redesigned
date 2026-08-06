import pytest
from services.ats_checker import ATSChecker

class TestATSChecker:
    def setup_method(self):
        self.checker = ATSChecker()

    def test_get_available_roles_returns_list(self):
        roles = self.checker.get_available_roles()
        assert isinstance(roles, list)
        assert len(roles) > 0

    def test_get_available_roles_includes_default(self):
        roles = self.checker.get_available_roles()
        assert 'Software Engineer' in roles
        assert 'Web Developer' in roles
        assert 'Data Analyst' in roles

    def test_check_resume_returns_dict(self):
        resume_text = "Python Java SQL Developer"
        result = self.checker.check_resume(resume_text, 'Software Engineer')
        assert isinstance(result, dict)

    def test_check_resume_includes_ats_score(self):
        resume_text = "Python Java JavaScript SQL Git Docker"
        result = self.checker.check_resume(resume_text, 'Software Engineer')
        assert 'ats_score' in result
        assert 0 <= result['ats_score'] <= 100

    def test_check_resume_includes_matched_keywords(self):
        resume_text = "Python Java JavaScript SQL Git Docker"
        result = self.checker.check_resume(resume_text, 'Software Engineer')
        assert 'matched_keywords' in result
        assert isinstance(result['matched_keywords'], list)

    def test_check_resume_includes_missing_keywords(self):
        resume_text = "Some random text"
        result = self.checker.check_resume(resume_text, 'Software Engineer')
        assert 'missing_keywords' in result

    def test_check_resume_invalid_role(self):
        result = self.checker.check_resume("Python", 'Invalid Role')
        assert 'error' in result

    def test_get_role_suggestions_returns_list(self):
        resume_text = "Python Django Flask JavaScript React Node.js SQL PostgreSQL"
        suggestions = self.checker.get_role_suggestions(resume_text)
        assert isinstance(suggestions, list)
        assert len(suggestions) <= 5

    def test_get_role_suggestions_sorted_by_match(self):
        resume_text = "Python TensorFlow PyTorch Machine Learning Deep Learning Neural Networks"
        suggestions = self.checker.get_role_suggestions(resume_text)
        if len(suggestions) > 1:
            assert suggestions[0]['match_percentage'] >= suggestions[-1]['match_percentage']
