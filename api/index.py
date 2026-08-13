import sys
import os
from pathlib import Path

# Add root directory and backend directory to sys.path
root_dir = Path(__file__).parent.parent
backend_dir = root_dir / 'backend'

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app import create_app

env = os.environ.get('FLASK_ENV', 'production')
app = create_app(env)

# Export WSGI application entry point for Vercel Serverless Function
handler = app
