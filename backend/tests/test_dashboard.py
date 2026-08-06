import pytest
from services.dashboard_service import DashboardService

class TestDashboardService:
    def setup_method(self):
        self.service = DashboardService()

    def test_get_available_roles_returns_list(self):
        roles = self.service.get_available_roles()
        assert isinstance(roles, list)
        assert len(roles) > 0

    def test_get_available_roles_includes_expected(self):
        roles = self.service.get_available_roles()
        assert 'Software Engineer' in roles
        assert 'Data Analyst' in roles
        assert 'AI Engineer' in roles
