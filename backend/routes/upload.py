from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os

from utils.validators import validate_file, get_file_extension
from utils.file_handler import generate_unique_filename, save_file
from services.resume_parser import ResumeParser
from models.database import db
from models.resume import Resume

upload_bp = Blueprint('upload', __name__)
parser = ResumeParser()

@upload_bp.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']

    is_valid, message = validate_file(file)
    if not is_valid:
        return jsonify({'error': message}), 400

    try:
        original_filename = secure_filename(file.filename)
        stored_filename = generate_unique_filename(original_filename)
        file_type = get_file_extension(original_filename)

        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, stored_filename)
        file.save(file_path)

        parsed_resume = parser.parse(file_path, original_filename)

        is_valid, validation_msg = parser.validate_parsed_resume(parsed_resume)
        if not is_valid:
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': validation_msg}), 400

        file_size = os.path.getsize(file_path)

        resume = Resume(
            filename=stored_filename,
            original_filename=original_filename,
            file_type=file_type,
            file_size=file_size,
            extracted_text=parsed_resume.text
        )
        resume.set_parsed_data({
            'sections': parsed_resume.sections,
            'skills': parsed_resume.skills,
            'contact_info': parsed_resume.contact_info,
            'education': parsed_resume.education,
            'experience': parsed_resume.experience,
            'projects': parsed_resume.projects
        })

        db.session.add(resume)
        db.session.commit()

        return jsonify({
            'message': 'Resume uploaded and parsed successfully',
            'resume_id': resume.id,
            'filename': original_filename,
            'file_type': file_type,
            'file_size': file_size,
            'text_length': len(parsed_resume.text),
            'skills_found': len(parsed_resume.skills),
            'contact_info': parsed_resume.contact_info,
            'parsed_data': {
                'sections': parsed_resume.sections,
                'skills': parsed_resume.skills
            }
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500
