from flask import Blueprint, request, jsonify
from models.database import db
from models.resume import Resume
from models.analysis import Analysis
from services.ats_checker import ATSChecker

from services.ai_analyzer import AIAnalyzer

ats_bp = Blueprint('ats', __name__)
ats_checker = ATSChecker()
ai_analyzer = AIAnalyzer()

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
        parsed_data = resume.get_parsed_data()
        ats_result = ats_checker.check_resume(resume.extracted_text, target_role)

        if 'error' in ats_result:
            return jsonify({'error': ats_result['error']}), 400

        ai_result = ai_analyzer.analyze(
            resume_text=resume.extracted_text,
            target_role=target_role,
            parsed_data=parsed_data
        )

        analysis = Analysis.query.filter_by(resume_id=resume_id).first()
        if analysis:
            analysis.target_role = target_role
            analysis.ats_score = ai_result['ats_score']
            analysis.overall_score = ai_result['overall_score']
            analysis.set_matched_skills(ai_result['matched_skills'])
            analysis.set_missing_skills(ai_result['missing_skills'])
            analysis.set_ai_analysis(ai_result)
        else:
            analysis = Analysis(
                resume_id=resume_id,
                target_role=target_role,
                overall_score=ai_result['overall_score'],
                ats_score=ai_result['ats_score']
            )
            analysis.set_ai_analysis(ai_result)
            db.session.add(analysis)

        db.session.commit()

        response_payload = {
            'message': 'ATS check completed successfully',
            'analysis_id': analysis.id,
            'category': ats_result.get('category', 'General'),
            'matched_keywords': ats_result.get('matched_keywords', []),
            'required_skills_match': ats_result.get('required_skills_match', {})
        }
        response_payload.update(ai_result)

        return jsonify(response_payload), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'ATS check failed: {str(e)}'}), 500

@ats_bp.route('/roles', methods=['GET'])
def get_roles():
    """Return full role metadata for frontend filtering/browsing."""
    return jsonify({
        'roles': ats_checker.roles_data
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
