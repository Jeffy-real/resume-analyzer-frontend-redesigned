from flask import Blueprint, request, jsonify
from models.database import db
from models.resume import Resume
from models.analysis import Analysis
from services.resume_scoring import ResumeScorer
from services.ats_checker import ATSChecker

from services.ai_analyzer import AIAnalyzer

analysis_bp = Blueprint('analysis', __name__)
scorer = ResumeScorer()
ats_checker = ATSChecker()
ai_analyzer = AIAnalyzer()

@analysis_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.get_json() or {}

    if 'resume_id' not in data:
        return jsonify({'error': 'Resume ID is required'}), 400

    resume_id = data.get('resume_id')
    target_role = data.get('target_role', 'Software Engineer')

    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    try:
        parsed_data = resume.get_parsed_data()
        scoring_result = scorer.calculate_score(parsed_data, resume.extracted_text)

        # Run AI Multi-Dimensional Analysis
        ai_result = ai_analyzer.analyze(
            resume_text=resume.extracted_text,
            target_role=target_role,
            parsed_data=parsed_data
        )

        analysis = Analysis(
            resume_id=resume_id,
            target_role=target_role,
            overall_score=ai_result['overall_score'],
            ats_score=ai_result['ats_score']
        )
        analysis.set_matched_skills(ai_result['matched_skills'])
        analysis.set_missing_skills(ai_result['missing_skills'])
        analysis.set_section_scores({
            section.label: {'pts': section.pts, 'max': section.max, 'status': section.status}
            for section in scoring_result['sections']
        })
        analysis.set_ai_analysis(ai_result)

        db.session.add(analysis)
        db.session.commit()

        response_payload = {
            'message': 'AI Analysis completed successfully',
            'analysis_id': analysis.id,
            'sections': [
                {
                    'label': s.label,
                    'status': s.status,
                    'text': s.text,
                    'pts': s.pts,
                    'max': s.max
                } for s in scoring_result['sections']
            ],
            'weak_sections': scoring_result['weak_sections']
        }
        response_payload.update(ai_result)

        return jsonify(response_payload), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500


@analysis_bp.route('/analyze-all-roles', methods=['POST'])
def analyze_all_roles():
    """Compare a resume against EVERY supported role and return ranked matches."""
    data = request.get_json()

    if not data or 'resume_id' not in data:
        return jsonify({'error': 'Resume ID is required'}), 400

    resume_id = data.get('resume_id')
    top_n = data.get('top_n', 20)

    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    try:
        suggestions = ats_checker.get_role_suggestions(resume.extracted_text, top_n=top_n)

        # Update any stored analysis for this resume with recommendations
        analysis = Analysis.query.filter_by(resume_id=resume_id).order_by(Analysis.created_at.desc()).first()
        if analysis:
            analysis.set_role_recommendations(suggestions)
            db.session.commit()
            analysis_id = analysis.id
        else:
            analysis = Analysis(resume_id=resume_id)
            analysis.set_role_recommendations(suggestions)
            db.session.add(analysis)
            db.session.commit()
            analysis_id = analysis.id

        return jsonify({
            'message': 'Multi-role comparison completed',
            'resume_id': resume_id,
            'total_roles_compared': len(ats_checker.get_available_roles()),
            'analysis_id': analysis_id,
            'suggestions': suggestions
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Role comparison failed: {str(e)}'}), 500


@analysis_bp.route('/recommendations/<int:resume_id>', methods=['GET'])
def get_recommendations(resume_id):
    """Fetch stored role recommendations for a resume without recomputing."""
    analysis = Analysis.query.filter_by(resume_id=resume_id).order_by(Analysis.created_at.desc()).first()
    if not analysis:
        return jsonify({'error': 'No analysis found for this resume'}), 404

    return jsonify({
        'resume_id': resume_id,
        'analysis_id': analysis.id,
        'suggestions': analysis.get_role_recommendations()
    }), 200
