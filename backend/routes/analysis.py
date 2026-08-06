from flask import Blueprint, request, jsonify
from models.database import db
from models.resume import Resume
from models.analysis import Analysis
from services.resume_scoring import ResumeScorer

analysis_bp = Blueprint('analysis', __name__)
scorer = ResumeScorer()

@analysis_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.get_json()

    if not data or 'resume_id' not in data:
        return jsonify({'error': 'Resume ID is required'}), 400

    resume_id = data.get('resume_id')

    resume = Resume.query.get(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    if not resume.extracted_text:
        return jsonify({'error': 'No text found in resume'}), 400

    try:
        parsed_data = resume.get_parsed_data()
        scoring_result = scorer.calculate_score(parsed_data, resume.extracted_text)

        analysis = Analysis(
            resume_id=resume_id,
            overall_score=scoring_result['overall_score']
        )
        analysis.set_matched_skills(parsed_data.get('skills', []))
        analysis.set_missing_skills(scoring_result['weak_sections'])
        analysis.set_section_scores({
            section.label: {'pts': section.pts, 'max': section.max, 'status': section.status}
            for section in scoring_result['sections']
        })

        db.session.add(analysis)
        db.session.commit()

        return jsonify({
            'message': 'Analysis completed successfully',
            'analysis_id': analysis.id,
            'overall_score': scoring_result['overall_score'],
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
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500
