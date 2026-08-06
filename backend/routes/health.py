from flask import Blueprint, jsonify
from models.database import db
from models.resume import Resume

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    try:
        resume_count = Resume.query.count()
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'resumes_stored': resume_count
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500
