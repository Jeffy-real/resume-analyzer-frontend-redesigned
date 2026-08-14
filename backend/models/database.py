import sys
import tempfile
import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        try:
            from models.user import User  # noqa: F401
            from models.resume import Resume  # noqa: F401
            from models.analysis import Analysis  # noqa: F401
            db.create_all()
        except Exception as e:
            print(f"[Warning] Primary DB create_all failed: {e}", file=sys.stderr)
            try:
                # Emergency fallback to /tmp SQLite
                tmp_db = os.path.join(tempfile.gettempdir(), 'resume_analyzer_fallback.db')
                app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{tmp_db}"
                db.create_all()
                print(f"[Database Recovery] Switched to temporary SQLite at {tmp_db}", file=sys.stderr)
            except Exception as e2:
                print(f"[Database Error] Fallback DB also failed: {e2}", file=sys.stderr)

