"""
Guarded Enquiry Service - Audit and Telemetry Service
Tracks real runtime operational metrics, manages the human handoff review queue,
and stores privacy-scrubbed recent interactions.
"""

from collections import deque
from datetime import datetime, timezone
import threading
from typing import Any, Dict, List, Optional
import numpy as np
from backend.app.models.response import HandoffRecord, MetricsSummaryResponse

class AuditService:
    """Thread-safe operational telemetry and human escalation handoff manager."""

    def __init__(self, max_history: int = 200):
        self._lock = threading.Lock()
        self.max_history = max_history
        self._history: deque = deque(maxlen=max_history)
        self._handoffs: Dict[str, HandoffRecord] = {}

        # Aggregated counters
        self.total_requests: int = 0
        self.answered_requests: int = 0
        self.escalated_requests: int = 0
        self.latencies: List[float] = []
        self.category_counts: Dict[str, int] = {}
        self.reason_counts: Dict[str, int] = {}

    def record_interaction(
        self,
        request_id: str,
        question: str,
        status: str,
        latency_ms: float,
        faq_id: Optional[str] = None,
        category: Optional[str] = None,
        reason: Optional[str] = None,
        candidate_ids: Optional[List[str]] = None,
        confidence: Optional[float] = None
    ) -> None:
        """Records an incoming query decision."""
        with self._lock:
            self.total_requests += 1
            self.latencies.append(latency_ms)

            # Keep only last 1000 latencies to bound memory
            if len(self.latencies) > 1000:
                self.latencies.pop(0)

            if status == "answered":
                self.answered_requests += 1
                cat = category or "General"
                self.category_counts[cat] = self.category_counts.get(cat, 0) + 1
            else:
                self.escalated_requests += 1
                rsn = reason or "UNSUPPORTED_QUESTION"
                self.reason_counts[rsn] = self.reason_counts.get(rsn, 0) + 1

                # Add to handoff review queue
                self._handoffs[request_id] = HandoffRecord(
                    request_id=request_id,
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    question_summary=self._sanitize_summary(question),
                    escalation_reason=rsn,
                    status="PENDING",
                    candidate_faq_ids=candidate_ids or [],
                    reviewer_notes=None
                )

            # Add to recent audit trail
            self._history.append({
                "request_id": request_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "question_preview": self._sanitize_summary(question),
                "status": status,
                "faq_id": faq_id,
                "category": category,
                "reason": reason,
                "latency_ms": round(latency_ms, 2),
                "confidence": round(confidence, 3) if confidence is not None else None
            })

    def _sanitize_summary(self, question: str) -> str:
        """Truncate and clean query for audit log view."""
        cleaned = question.strip()
        if len(cleaned) > 80:
            return cleaned[:77] + "..."
        return cleaned

    def get_metrics_summary(self) -> MetricsSummaryResponse:
        """Calculates live operational telemetry."""
        with self._lock:
            if not self.latencies:
                return MetricsSummaryResponse(
                    total_requests=0,
                    answered_requests=0,
                    escalated_requests=0,
                    answer_coverage_pct=0.0,
                    mean_latency_ms=0.0,
                    p95_latency_ms=0.0,
                    category_distribution={},
                    reason_distribution={},
                    recent_decisions=[]
                )

            mean_lat = float(np.mean(self.latencies))
            p95_lat = float(np.percentile(self.latencies, 95))
            coverage = (self.answered_requests / self.total_requests * 100.0) if self.total_requests > 0 else 0.0

            return MetricsSummaryResponse(
                total_requests=self.total_requests,
                answered_requests=self.answered_requests,
                escalated_requests=self.escalated_requests,
                answer_coverage_pct=round(coverage, 1),
                mean_latency_ms=round(mean_lat, 2),
                p95_latency_ms=round(p95_lat, 2),
                category_distribution=dict(self.category_counts),
                reason_distribution=dict(self.reason_counts),
                recent_decisions=list(reversed(list(self._history)))[:20]
            )

    def get_handoffs(self) -> List[HandoffRecord]:
        """Returns all escalation handoff records."""
        with self._lock:
            return list(reversed(list(self._handoffs.values())))

    def resolve_handoff(
        self,
        request_id: str,
        status: str,
        reviewer_notes: Optional[str] = None
    ) -> Optional[HandoffRecord]:
        """Updates the status and human notes for an escalated handoff item."""
        with self._lock:
            record = self._handoffs.get(request_id)
            if record:
                record.status = status
                if reviewer_notes:
                    record.reviewer_notes = reviewer_notes
                return record
            return None

audit_service = AuditService()

