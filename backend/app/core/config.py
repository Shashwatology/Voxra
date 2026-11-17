"""
Guarded Enquiry Service - Application Configuration
Encapsulates environment variables, path resolutions, and operational constants.
"""

import os
from pathlib import Path
from typing import Literal

# Load environment variables from .env if present
try:
    import dotenv
    dotenv.load_dotenv(Path(__file__).resolve().parent.parent.parent.parent / ".env")
except Exception:
    pass

# Base directory paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
RESULTS_DIR = BASE_DIR / "results"

class Settings:
    """Application settings with environment variable fallbacks."""
    PROJECT_NAME: str = "Guarded Enquiry Service"
    PROJECT_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Model & AI Configuration
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
    AI_MODE: Literal["hybrid", "local_only"] = (
        "hybrid" if os.getenv("AI_MODE", "hybrid") == "hybrid" and os.getenv("GEMINI_API_KEY")
        else "local_only"
    )
    
    # Retrieval Tuning Parameters
    # Calibrated on development questions
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.32"))
    AMBIGUITY_DELTA: float = float(os.getenv("AMBIGUITY_DELTA", "0.08"))
    HIGH_CONFIDENCE_THRESHOLD: float = float(os.getenv("HIGH_CONFIDENCE_THRESHOLD", "0.72"))
    
    # Security & Input Constraints
    MAX_QUESTION_LENGTH: int = 500
    MIN_QUESTION_LENGTH: int = 3
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "northstar-admin-secret-dev")
    
    # File Paths
    RESULTS_DIR: Path = RESULTS_DIR
    APPROVED_FAQ_PATH: Path = DATA_DIR / "approved_faq.json"
    EVALUATION_SET_PATH: Path = DATA_DIR / "evaluation_set.json"
    ADVERSARIAL_TESTS_PATH: Path = DATA_DIR / "adversarial_tests.json"
    EVALUATION_RESULTS_PATH: Path = RESULTS_DIR / "evaluation_results.json"
    EVALUATION_SUMMARY_PATH: Path = RESULTS_DIR / "evaluation_summary.json"
    
    # Max Retries for External API
    MAX_API_RETRIES: int = 3
    API_TIMEOUT_SECONDS: float = 4.0

settings = Settings()
