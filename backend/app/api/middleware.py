"""
Guarded Enquiry Service - API Middleware
Handles sliding-window rate limiting, request correlation IDs, and security response headers.
"""

from collections import defaultdict
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.app.core.config import settings

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window in-memory rate limiter."""

    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.limit = requests_per_minute
        self.window = 60.0
        self.clients = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Exclude static assets or health checks from strict rate limit
        if request.url.path in ("/health", "/docs", "/openapi.json"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        timestamps = self.clients[client_ip]

        # Purge timestamps outside current window
        self.clients[client_ip] = [t for t in timestamps if now - t < self.window]

        if len(self.clients[client_ip]) >= self.limit:
            return JSONResponse(
                status_code=429,
                content={
                    "status": "escalated",
                    "reason": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please wait a moment before asking another question.",
                    "request_id": str(uuid.uuid4())
                }
            )

        self.clients[client_ip].append(now)
        return await call_next(request)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces essential HTTP security headers."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response
