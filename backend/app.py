from flask import Flask
from flask_cors import CORS
from config import config_by_name
from models.database import init_db

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

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

    @app.errorhandler(413)
    def too_large(e):
        return {'error': 'File too large. Maximum size is 10MB.'}, 413

    @app.errorhandler(500)
    def internal_error(e):
        return {'error': 'Internal server error'}, 500

    return app

if __name__ == '__main__':
    app = create_app('development')
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
