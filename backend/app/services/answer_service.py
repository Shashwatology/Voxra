"""
Guarded Enquiry Service - Answer Orchestration Service
Implements the core decision pipeline:
Untrusted input -> Guardrail screening -> Deterministic retrieval -> Ambiguity check
-> Optional Gemini classification -> Canonical FAQ answer loading -> Audit telemetry.
"""

import time
import uuid
from typing import Optional
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.models.request import AskRequest
from backend.app.models.response import AskResponse, EscalationReason
from backend.app.services.audit_service import audit_service
from backend.app.services.faq_service import faq_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.guardrail_service import guardrail_service
from backend.app.services.retrieval_service import retrieval_service

class AnswerService:
    """Orchestrates the guarded answering process ensuring absolute grounding."""

    async def process_question(self, request: AskRequest) -> AskResponse:
        start_time = time.perf_counter()
        request_id = f"req-{uuid.uuid4().hex[:12]}"
        query = request.question

        logger.info(
            "Processing enquiry",
            extra={"request_id": request_id, "query_length": len(query), "ai_mode": settings.AI_MODE}
        )

        # Step 1: Upfront Guardrail & Safety Screening
        is_safe, guardrail_reason, guardrail_msg = guardrail_service.screen_query(query)
        if not is_safe:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            audit_service.record_interaction(
                request_id=request_id,
                question=query,
                status="escalated",
                latency_ms=elapsed_ms,
                reason=guardrail_reason.value if guardrail_reason else "SECURITY_VIOLATION"
            )
            return AskResponse(
                status="escalated",
                answer=None,
                faq_id=None,
                source=None,
                reason=guardrail_reason.value if guardrail_reason else "SECURITY_VIOLATION",
                message=guardrail_msg or "I couldn't verify that from our approved information. The admissions team can assist you.",
                request_id=request_id,
                latency_ms=round(elapsed_ms, 2)
            )

        # Step 2: Deterministic TF-IDF Candidate Retrieval
        retrieval = retrieval_service.retrieve(query, top_k=3)
        candidate_ids = [c.faq_id for c in retrieval.candidates]

        # Step 3: Ambiguity Check
        if retrieval.is_ambiguous:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            audit_service.record_interaction(
                request_id=request_id,
                question=query,
                status="escalated",
                latency_ms=elapsed_ms,
                reason=EscalationReason.AMBIGUOUS_QUERY.value,
                candidate_ids=candidate_ids,
                confidence=retrieval.top_candidate.score if retrieval.top_candidate else 0.0
            )
            return AskResponse(
                status="escalated",
                answer=None,
                faq_id=None,
                source=None,
                reason=EscalationReason.AMBIGUOUS_QUERY.value,
                message=(
                    "Your question could apply to multiple programs or fee structures. "
                    "Could you please specify whether you are asking about the Foundation Program (Classes 9-10), "
                    "JEE Preparation (Classes 11-12), or registration charges?"
                ),
                request_id=request_id,
                latency_ms=round(elapsed_ms, 2),
                confidence=round(retrieval.top_candidate.score, 3) if retrieval.top_candidate else None
            )

        # Step 4: Decision Routing (Local vs. Gemini Hybrid)
        chosen_faq_id: Optional[str] = None
        confidence_score: Optional[float] = None

        if gemini_service.is_configured and settings.AI_MODE == "hybrid":
            # Pass candidates to Gemini for fine-grained intent selection & disambiguation
            gemini_decision = await gemini_service.classify_and_select(query, retrieval.candidates)
            if gemini_decision and gemini_decision.decision == "ANSWER" and gemini_decision.faq_id:
                chosen_faq_id = gemini_decision.faq_id
                confidence_score = retrieval.top_candidate.score if retrieval.top_candidate else 0.85
            elif gemini_decision and gemini_decision.decision == "ESCALATE":
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                reason_code = gemini_decision.reason_code or EscalationReason.UNSUPPORTED_QUESTION.value
                audit_service.record_interaction(
                    request_id=request_id,
                    question=query,
                    status="escalated",
                    latency_ms=elapsed_ms,
                    reason=reason_code,
                    candidate_ids=candidate_ids
                )
                return AskResponse(
                    status="escalated",
                    answer=None,
                    faq_id=None,
                    source=None,
                    reason=reason_code,
                    message="I couldn't verify that from our approved information. The admissions team can assist you.",
                    request_id=request_id,
                    latency_ms=round(elapsed_ms, 2)
                )

        # Step 5: Local Deterministic Fallback if Gemini not used or offline
        if not chosen_faq_id:
            if not retrieval.is_low_confidence and retrieval.top_candidate:
                chosen_faq_id = retrieval.top_candidate.faq_id
                confidence_score = retrieval.top_candidate.score
            else:
                # Low confidence or off-topic question
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                audit_service.record_interaction(
                    request_id=request_id,
                    question=query,
                    status="escalated",
                    latency_ms=elapsed_ms,
                    reason=EscalationReason.UNSUPPORTED_QUESTION.value,
                    candidate_ids=candidate_ids,
                    confidence=retrieval.top_candidate.score if retrieval.top_candidate else 0.0
                )
                return AskResponse(
                    status="escalated",
                    answer=None,
                    faq_id=None,
                    source=None,
                    reason=EscalationReason.UNSUPPORTED_QUESTION.value,
                    message="I couldn't verify that from our approved information. The admissions team can assist you directly at admissions@northstar.example.",
                    request_id=request_id,
                    latency_ms=round(elapsed_ms, 2),
                    confidence=round(retrieval.top_candidate.score, 3) if retrieval.top_candidate else None
                )

        # Step 6: Canonical Answer Retrieval (Guaranteed Grounding)
        # Load directly from verified repository
        faq_item = faq_service.get_faq(chosen_faq_id)
        if not faq_item:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return AskResponse(
                status="escalated",
                answer=None,
                faq_id=None,
                source=None,
                reason=EscalationReason.UNSUPPORTED_QUESTION.value,
                message="I couldn't verify that from our approved information. The admissions team can assist you.",
                request_id=request_id,
                latency_ms=round(elapsed_ms, 2)
            )

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        audit_service.record_interaction(
            request_id=request_id,
            question=query,
            status="answered",
            latency_ms=elapsed_ms,
            faq_id=faq_item.id,
            category=faq_item.category,
            confidence=confidence_score
        )

        return AskResponse(
            status="answered",
            answer=faq_item.approved_answer,
            faq_id=faq_item.id,
            source="approved_faq",
            category=faq_item.category,
            request_id=request_id,
            latency_ms=round(elapsed_ms, 2),
            confidence=round(confidence_score, 3) if confidence_score else None
        )

answer_service = AnswerService()
