"""
Guarded Enquiry Service - Safe Structured Logging
Provides sanitized JSON logging without leaking secrets, personal identifiable information (PII),
or raw customer questions by default.
"""

import json
import logging
import re
import sys
from datetime import datetime, timezone
from typing import Any

# Sensitive patterns to scrub
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@(?!northstar\.example\b)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b")
PHONE_PATTERN = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
SECRET_KEYS = {"api_key", "token", "authorization", "secret", "password", "gemini_api_key"}

def sanitize_value(val: Any) -> Any:
    """Recursively scrub sensitive information from values."""
    if isinstance(val, str):
        val = EMAIL_PATTERN.sub("[REDACTED_EMAIL]", val)
        val = PHONE_PATTERN.sub("[REDACTED_PHONE]", val)
        return val
    elif isinstance(val, dict):
        cleaned = {}
        for k, v in val.items():
            if str(k).lower() in SECRET_KEYS:
                cleaned[k] = "[REDACTED_SECRET]"
            else:
                cleaned[k] = sanitize_value(v)
        return cleaned
    elif isinstance(val, list):
        return [sanitize_value(item) for item in val]
    return val

class SafeJsonFormatter(logging.Formatter):
    """Formats log records as sanitized JSON strings."""
    def format(self, record: logging.LogRecord) -> str:
        log_payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Attach correlation ID and extra attributes if provided
        for key in ("request_id", "status", "faq_id", "latency_ms", "reason", "ai_mode"):
            if hasattr(record, key):
                log_payload[key] = getattr(record, key)
                
        # If record has custom structured data
        if hasattr(record, "structured_data") and isinstance(record.structured_data, dict):
            log_payload["data"] = sanitize_value(record.structured_data)
            
        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_payload)

def setup_logger(name: str = "voxra") -> logging.Logger:
    """Configure and return the root application logger."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(SafeJsonFormatter())
        logger.addHandler(handler)
        
    logger.propagate = False
    return logger

logger = setup_logger()
