"""
Vercel Serverless Function Entry Point for FastAPI Backend.
Routes incoming HTTP requests on Vercel to the Guarded Enquiry Service ASGI app.
"""
import sys
from pathlib import Path

# Add project root to sys.path to enable backend module imports
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

# Export app for Vercel Python runtime
handler = app
