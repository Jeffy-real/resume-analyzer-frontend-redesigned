import os
import uuid
from pathlib import Path
from utils.validators import sanitize_filename

def ensure_upload_dir(upload_folder: str) -> None:
    Path(upload_folder).mkdir(parents=True, exist_ok=True)

def generate_unique_filename(original_filename: str) -> str:
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    unique_id = uuid.uuid4().hex[:8]
    safe_name = sanitize_filename(original_filename.rsplit('.', 1)[0])
    return f"{safe_name}_{unique_id}.{ext}" if ext else f"{safe_name}_{unique_id}"

def save_file(file, upload_folder: str, filename: str) -> str:
    ensure_upload_dir(upload_folder)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    return filepath

def delete_file(filepath: str) -> bool:
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            return True
        return False
    except Exception:
        return False

def get_file_size(filepath: str) -> int:
    try:
        return os.path.getsize(filepath)
    except Exception:
        return 0
