from flask import Blueprint, request, jsonify
from models.database import db
from models.resume import Resume
from models.analysis import Analysis
from services.ats_checker import ATSChecker

ats_bp = Blueprint('ats', __name__)
ats_checker = ATSChecker()

@ats_bp.route('/ats', methods=['POST'])
def check_ats():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    resume_id = data.get('resume_id')
    target_role = data.get('target_role')

    if not resume_id:
        return jsonify({'error': 'Resume ID is required'}), 400

    if not target_role:
        return jsonify({'error': 'Target role is required'}), 400

    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    try:
        ats_result = ats_checker.check_resume(resume.extracted_text, target_role)

        if 'error' in ats_result:
            return jsonify({'error': ats_result['error']}), 400

        analysis = Analysis.query.filter_by(resume_id=resume_id).first()
        if analysis:
            analysis.target_role = target_role
            analysis.ats_score = ats_result['ats_score']
            analysis.set_matched_skills(ats_result['matched_skills'])
            analysis.set_missing_skills(ats_result['missing_skills'])
        else:
            analysis = Analysis(
                resume_id=resume_id,
                target_role=target_role,
                ats_score=ats_result['ats_score']
            )
            analysis.set_matched_skills(ats_result['matched_skills'])
            analysis.set_missing_skills(ats_result['missing_skills'])
            db.session.add(analysis)

        db.session.commit()

        return jsonify({
            'message': 'ATS check completed successfully',
            'analysis_id': analysis.id,
            'target_role': ats_result['target_role'],
            'category': ats_result['category'],
            'ats_score': ats_result['ats_score'],
            'matched_skills': ats_result['matched_skills'],
            'missing_skills': ats_result['missing_skills'],
            'matched_keywords': ats_result['matched_keywords'],
            'required_skills_match': ats_result['required_skills_match']
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'ATS check failed: {str(e)}'}), 500

@ats_bp.route('/roles', methods=['GET'])
def get_roles():
    return jsonify({
        'roles': ats_checker.get_available_roles()
    }), 200

@ats_bp.route('/suggest-roles/<int:resume_id>', methods=['GET'])
def suggest_roles(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    suggestions = ats_checker.get_role_suggestions(resume.extracted_text)
    return jsonify({
        'resume_id': resume_id,
        'suggestions': suggestions
    }), 200
