"""
Guarded Enquiry Service - Response Models
Standardized API response contracts for both verified answers and controlled escalations.
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class EscalationReason(str, Enum):
    """Hardcoded set of permissible escalation reason codes."""
    UNSUPPORTED_QUESTION = "UNSUPPORTED_QUESTION"
    AMBIGUOUS_QUERY = "AMBIGUOUS_QUERY"
    POLICY_VIOLATION = "POLICY_VIOLATION"
    PROMPT_INJECTION_DETECTED = "PROMPT_INJECTION_DETECTED"
    UNSUPPORTED_GUARANTEE = "UNSUPPORTED_GUARANTEE"
    UNAUTHORIZED_DISCOUNT = "UNAUTHORIZED_DISCOUNT"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"

class AskResponse(BaseModel):
    """Unified response model for /ask endpoint."""
    status: str = Field(..., description="'answered' when verified, 'escalated' when guarded.")
    answer: Optional[str] = Field(default=None, description="Canonical approved answer text.")
    faq_id: Optional[str] = Field(default=None, description="Exact identifier of the approved FAQ.")
    source: Optional[str] = Field(default=None, description="Source repository ('approved_faq').")
    reason: Optional[str] = Field(default=None, description="Escalation code if status is escalated.")
    message: Optional[str] = Field(default=None, description="Human-readable customer guidance.")
    request_id: str = Field(..., description="Unique UUID correlation identifier.")
    latency_ms: float = Field(..., description="Observed processing time in milliseconds.")
    confidence: Optional[float] = Field(default=None, description="Retrieval similarity score.")
    category: Optional[str] = Field(default=None, description="Subject category (e.g. Fees, Schedule).")

class FaqItem(BaseModel):
    """Canonical FAQ representation."""
    id: str
    category: str
    canonical_question: str
    approved_answer: str
    alternative_questions: List[str] = []
    keywords: List[str] = []
    immutable: bool = True

class HealthResponse(BaseModel):
    """System health and operational status."""
    status: str
    ai_mode: str
    gemini_configured: bool
    model_name: str
    faq_count: int
    faq_version: str
    timestamp: str

class MetricsSummaryResponse(BaseModel):
    """Operational metrics aggregated from runtime telemetry."""
    total_requests: int
    answered_requests: int
    escalated_requests: int
    answer_coverage_pct: float
    mean_latency_ms: float
    p95_latency_ms: float
    category_distribution: Dict[str, int]
    reason_distribution: Dict[str, int]
    recent_decisions: List[Dict[str, Any]]

class HandoffRecord(BaseModel):
    """Audit record for escalated questions awaiting or having human review."""
    request_id: str
    timestamp: str
    question_summary: str
    escalation_reason: str
    status: str
    candidate_faq_ids: List[str] = []
    reviewer_notes: Optional[str] = None

