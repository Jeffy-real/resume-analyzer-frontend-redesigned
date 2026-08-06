from flask import Blueprint, request, jsonify
from models.database import db
from models.resume import Resume
from models.analysis import Analysis
from services.feedback_engine import FeedbackEngine
from services.ats_checker import ATSChecker

feedback_bp = Blueprint('feedback', __name__)
feedback_engine = FeedbackEngine()
ats_checker = ATSChecker()

@feedback_bp.route('/feedback', methods=['POST'])
def generate_feedback():
    data = request.get_json()

    if not data or 'resume_id' not in data:
        return jsonify({'error': 'Resume ID is required'}), 400

    resume_id = data.get('resume_id')
    target_role = data.get('target_role')

    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    try:
        parsed_data = resume.get_parsed_data()
        parsed_data['contact_info'] = parsed_data.get('contact_info', {})

        ats_data = None
        if target_role:
            ats_data = ats_checker.check_resume(resume.extracted_text, target_role)

        feedback = feedback_engine.generate_feedback(parsed_data, ats_data)

        analysis = Analysis.query.filter_by(resume_id=resume_id).first()
        if analysis:
            analysis.set_feedback(feedback)
            if target_role:
                analysis.target_role = target_role
        else:
            analysis = Analysis(
                resume_id=resume_id,
                target_role=target_role
            )
            analysis.set_feedback(feedback)
            db.session.add(analysis)

        db.session.commit()

        return jsonify({
            'message': 'Feedback generated successfully',
            'analysis_id': analysis.id,
            'feedback': feedback,
            'total_suggestions': len(feedback)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Feedback generation failed: {str(e)}'}), 500
