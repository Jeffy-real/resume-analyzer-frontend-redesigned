import os
from werkzeug.utils import secure_filename
from utils.constants import ALLOWED_EXTENSIONS, MAX_FILE_SIZE

def allowed_file(filename: str) -> bool:
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def validate_file(file) -> tuple:
    if not file:
        return False, 'No file provided'

    if file.filename == '':
        return False, 'No file selected'

    if not allowed_file(file.filename):
        return False, f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size == 0:
        return False, 'File is empty'

    if file_size > MAX_FILE_SIZE:
        return False, f'File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB'

    return True, 'Valid'

def get_file_extension(filename: str) -> str:
    if '.' not in filename:
        return ''
    return filename.rsplit('.', 1)[1].lower()

def sanitize_filename(filename: str) -> str:
    return secure_filename(filename)
