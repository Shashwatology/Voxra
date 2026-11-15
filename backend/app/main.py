"""
Guarded Enquiry Service - FastAPI Application Entry Point
Northstar Admissions Guarded FAQ Intelligence Service.
"""

from contextlib import asynccontextmanager
import time
import uuid
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.middleware import RateLimitMiddleware, SecurityHeadersMiddleware
from backend.app.api.routes import router
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.faq_service import faq_service
from backend.app.services.retrieval_service import retrieval_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle management."""
    logger.info("Initializing Guarded Enquiry Service...", extra={"environment": settings.ENVIRONMENT})
    # Warm up FAQ service and TF-IDF index
    faq_count = len(faq_service.get_all_faqs())
    logger.info(f"Verified {faq_count} approved FAQs ready for queries.")
    yield
    logger.info("Guarded Enquiry Service shutdown completed.")

app = FastAPI(
    title="Enquiry Studio API — Northstar Admissions",
    description="Guarded FAQ enquiry intelligence service with verified approved grounding and controlled escalation.",
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

# CORS configuration for development and frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Security and Rate Limiting Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)

# Include API Router
app.include_router(router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler for Pydantic input validation failures."""
    request_id = str(uuid.uuid4())
    logger.warning("Request validation rejected.", extra={"request_id": request_id})
    clean_errors = []
    for err in exc.errors():
        clean_errors.append({
            "loc": err.get("loc"),
            "msg": err.get("msg"),
            "type": err.get("type")
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "status": "error",
            "type": "VALIDATION_ERROR",
            "message": "Invalid request payload. Question must be between 3 and 500 characters with valid words.",
            "details": clean_errors,
            "request_id": request_id
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catches unhandled errors without leaking stack traces or secrets to users."""
    request_id = str(uuid.uuid4())
    logger.error(f"Unhandled server error: {exc}", exc_info=True, extra={"request_id": request_id})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "type": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred while processing your request. Please try again or contact admissions.",
            "request_id": request_id
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
