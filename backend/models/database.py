from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        from models.user import User  # noqa: F401 — needed to register model with metadata
        db.create_all()
