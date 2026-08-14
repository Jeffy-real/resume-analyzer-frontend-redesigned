from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        from models.user import User  # noqa: F401
        from models.resume import Resume  # noqa: F401
        from models.analysis import Analysis  # noqa: F401
        db.create_all()
