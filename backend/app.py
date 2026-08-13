from flask import Flask
from flask_cors import CORS
import os
from config import config_by_name
from models.database import init_db

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['development']))

    allowed_origins_env = os.environ.get('ALLOWED_ORIGINS', '')
    if allowed_origins_env and allowed_origins_env != '*':
        origins = [o.strip() for o in allowed_origins_env.split(',') if o.strip()]
    else:
        origins = '*'

    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    init_db(app)

    from routes.upload import upload_bp
    from routes.analysis import analysis_bp
    from routes.ats import ats_bp
    from routes.feedback import feedback_bp
    from routes.dashboard import dashboard_bp
    from routes.health import health_bp
    from routes.auth import auth_bp

    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(analysis_bp, url_prefix='/api')
    app.register_blueprint(ats_bp, url_prefix='/api')
    app.register_blueprint(feedback_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
        return response

    @app.errorhandler(413)
    def too_large(e):
        return {'error': 'File too large. Maximum size is 15MB.'}, 413

    @app.errorhandler(500)
    def internal_error(e):
        return {'error': 'An error occurred while processing your request.'}, 500

    return app

if __name__ == '__main__':
    env = os.environ.get('FLASK_ENV', 'development')
    app = create_app(env)
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
