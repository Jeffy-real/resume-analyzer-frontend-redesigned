import pytest
from services.resume_scoring import ResumeScorer

class TestResumeScorer:
    def setup_method(self):
        self.scorer = ResumeScorer()

    def test_calculate_score_returns_dict(self):
        parsed_data = {
            'sections': {},
            'skills': ['Python', 'Java'],
            'contact_info': {'email': 'test@example.com'},
            'education': [],
            'experience': [],
            'projects': []
        }
        result = self.scorer.calculate_score(parsed_data, "Sample resume text")
        assert isinstance(result, dict)
        assert 'overall_score' in result
        assert 'sections' in result

    def test_contact_scoring(self):
        contact_info = {
            'email': 'test@example.com',
            'phone': '1234567890',
            'linkedin': 'linkedin.com/in/test',
            'github': 'github.com/test'
        }
        score = self.scorer._score_contact(contact_info)
        assert score >= 10

    def test_skills_scoring_many_skills(self):
        skills = ['Python', 'Java', 'JavaScript', 'SQL', 'Git',
                  'Docker', 'AWS', 'React', 'Node.js', 'MongoDB',
                  'PostgreSQL', 'Linux', 'HTML', 'CSS', 'TypeScript']
        score = self.scorer._score_skills(skills)
        assert score >= 20

    def test_skills_scoring_few_skills(self):
        skills = ['Python']
        score = self.scorer._score_skills(skills)
        assert score < 15

    def test_summary_scoring_good_length(self):
        summary = (
            "Experienced software developer with 5 years building scalable web applications. "
            "Skilled in Python, JavaScript, and SQL with expertise in REST API design and "
            "database optimization. Led a team of four developers delivering features used "
            "by over 100,000 users while reducing deployment time by 40%."
        )
        score = self.scorer._score_summary(summary)
        assert score >= 12

    def test_summary_scoring_short(self):
        summary = "Developer with experience."
        score = self.scorer._score_summary(summary)
        assert score < 12

    def test_overall_score_is_bounded(self):
        parsed_data = {
            'sections': {},
            'skills': [],
            'contact_info': {},
            'education': [],
            'experience': [],
            'projects': []
        }
        result = self.scorer.calculate_score(parsed_data, "Short text")
        assert 0 <= result['overall_score'] <= 100
