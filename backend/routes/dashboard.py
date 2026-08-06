from flask import Blueprint, jsonify
from models.analysis import Analysis
from services.dashboard_service import DashboardService

dashboard_bp = Blueprint('dashboard', __name__)
dashboard_service = DashboardService()

@dashboard_bp.route('/dashboard/<int:analysis_id>', methods=['GET'])
def get_dashboard(analysis_id):
    dashboard_data = dashboard_service.get_dashboard_data(analysis_id)

    if 'error' in dashboard_data:
        return jsonify({'error': dashboard_data['error']}), 404

    return jsonify(dashboard_data), 200
