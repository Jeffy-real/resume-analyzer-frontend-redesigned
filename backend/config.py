import os
import tempfile
from pathlib import Path

BASE_DIR = Path(__file__).parent

def get_database_uri():
    # 1. Check for explicit database connection URLs (e.g. from PlanetScale, AWS RDS, GCP Cloud SQL, Aiven, Railway)
    db_uri = os.environ.get('SQLALCHEMY_DATABASE_URI') or os.environ.get('MYSQL_URL') or os.environ.get('DATABASE_URL')
    if db_uri:
        if db_uri.startswith('mysql://'):
            db_uri = db_uri.replace('mysql://', 'mysql+pymysql://', 1)
        return db_uri

    # 2. Check for MySQL individual component environment variables
    mysql_user = os.environ.get('MYSQL_USER')
    mysql_password = os.environ.get('MYSQL_PASSWORD')
    mysql_host = os.environ.get('MYSQL_HOST', 'localhost')
    mysql_port = os.environ.get('MYSQL_PORT', '3306')
    mysql_db = os.environ.get('MYSQL_DB', 'jobfirst_db')

    if mysql_user and mysql_password:
        return f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_db}"

    # 3. Fallback to SQLite for offline/development environments
    is_vercel = os.environ.get('VERCEL') == '1' or os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None
    default_db = os.path.join(tempfile.gettempdir(), 'resume_analyzer.db') if is_vercel else str(BASE_DIR / 'resume_analyzer.db')

    db_path = os.environ.get('DATABASE_PATH', default_db)
    return f"sqlite:///{db_path}"

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or get_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    is_vercel = os.environ.get('VERCEL') == '1' or os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None
    default_upload = os.path.join(tempfile.gettempdir(), 'uploads') if is_vercel else str(BASE_DIR / 'uploads')

    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', default_upload)
    MAX_CONTENT_LENGTH = 15 * 1024 * 1024  # 15MB max file size
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt', 'rtf', 'png', 'jpg', 'jpeg', 'webp', 'svg'}

    # NLP Settings
    SPACY_MODEL = 'en_core_web_sm'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    DATABASE_PATH = str(BASE_DIR / 'test_resume_analyzer.db')

class ProductionConfig(Config):
    DEBUG = False

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}
