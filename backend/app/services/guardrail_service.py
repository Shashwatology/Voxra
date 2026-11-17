"""
Guarded Enquiry Service - Guardrail & Input Screening Service
Enforces security boundaries, rejects prompt injections, catches out-of-policy requests,
and flags unsupported service enquiries before any LLM or retrieval action.
"""

import re
from typing import Optional, Tuple
from backend.app.models.response import EscalationReason
from backend.app.core.logging import logger

# Compiled Regex Patterns for Untrusted Input Screening
INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior)\s+(instructions|directives|rules)", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?(guidelines|rules|instructions|prompts)", re.IGNORECASE),
    re.compile(r"you\s+are\s+now\s+(the\s+)?(system\s+administrator|director|dan|admin|chief|unrestricted)", re.IGNORECASE),
    re.compile(r"(reveal|print|dump|show|output)\s+.*?(system\s+prompt|hidden\s+prompt|api[ _-]?key|secret|environment)", re.IGNORECASE),
    re.compile(r"(repeat|echo)\s+(the\s+)?(words\s+above|system\s+instructions)", re.IGNORECASE),
    re.compile(r"(system\s+diagnostic\s+override|debug\s+mode\s+enabled)", re.IGNORECASE),
    re.compile(r"(drop\s+table|select\s+\*\s+from\s+credentials|<script)", re.IGNORECASE),
    re.compile(r"(the\s+director|the\s+dean|management)\s+.*?(updated|revised|confirmed)\s+.*?(fee|policy|scholarship|discount|free)", re.IGNORECASE),
]

GUARANTEE_PATTERNS = [
    re.compile(r"guarantee\s+(that\s+)?(my\s+child|a\s+seat|admission|selection|an?\s+air|rank)", re.IGNORECASE),
    re.compile(r"guaranteed\s+(air|rank|selection|admission|100%|iit)", re.IGNORECASE),
    re.compile(r"promise\s+(an?\s+air|rank|admission|result)", re.IGNORECASE),
]

DISCOUNT_PATTERNS = [
    re.compile(r"(\b[3-9]\d%|\b100%)\s*(discount|concession|off|waiver)", re.IGNORECASE),
    re.compile(r"cash\s+discount|full\s+waiver|waive\s+all\s+fees|100%\s+free|courses\s+are\s+free", re.IGNORECASE),
    re.compile(r"sibling\s+concession|special\s+discount", re.IGNORECASE),
]

UNSUPPORTED_PROGRAM_PATTERNS = [
    re.compile(r"\b(neet|mbbs|medical\s+entrance|upsc|cat|gmat|sat|gre|clat)\b", re.IGNORECASE),
    re.compile(r"\b(ib\s+curriculum|igcse|icse\s+class\s+8|primary\s+school)\b", re.IGNORECASE),
]

UNSUPPORTED_FACILITY_PATTERNS = [
    re.compile(r"\b(hostel|mess(\s+charges|\s+food)?|boarding|dormitory)\b", re.IGNORECASE),
    re.compile(r"\b(school\s+bus|transport(\s+facility|\s+pickup)?|van\s+service)\b", re.IGNORECASE),
    re.compile(r"\b(home\s+tutor(ing)?|private\s+1-on-1|private\s+tutor)\b", re.IGNORECASE),
    re.compile(r"\b(allergy|epinephrine|medical\s+emergency)\b", re.IGNORECASE),
]

UNSUPPORTED_LOCATION_PATTERNS = [
    re.compile(r"\b(delhi|bangalore|bengaluru|pune|hyderabad|chennai|kolkata|ahmedabad|kota|jaipur|gurgaon|noida)\b", re.IGNORECASE),
]

SYLLABUS_PATTERNS = [
    re.compile(r"\b(syll?a?u?b[ua]s|curriculum|study\s+plan|what\s+needs\s+to\s+be\s+studied|subjects\s+covered|chapters|study\s+for\s+jee|what\s+to\s+study)\b", re.IGNORECASE),
]

REFUND_BOUNDARY_PATTERNS = [
    re.compile(r"(refund\s+after\s+(attending|starting|beginning)\s+classes)", re.IGNORECASE),
    re.compile(r"(completed\s+\d+\s+weeks?.*refund|classes\s+have\s+started.*refund)", re.IGNORECASE),
    re.compile(r"(registration\s+fee.*(instal+ment|split|part|after\s+classes))", re.IGNORECASE),
    re.compile(r"(instal+ments?.*(registration\s+fee|after\s+classes\s+start))", re.IGNORECASE),
]

class GuardrailService:
    """Evaluates untrusted user queries against deterministic safety and policy rules."""

    def screen_query(self, query: str) -> Tuple[bool, Optional[EscalationReason], Optional[str]]:
        """
        Screen the query.
        Returns:
            (is_safe, escalation_reason, customer_facing_message)
        """
        cleaned = query.strip()

        # 1. Prompt Injection & System Tampering Checks
        for pattern in INJECTION_PATTERNS:
            if pattern.search(cleaned):
                logger.warning("Guardrail tripped: Prompt Injection detected.", extra={"pattern": pattern.pattern})
                return (
                    False,
                    EscalationReason.PROMPT_INJECTION_DETECTED,
                    "I couldn't verify that from our approved information. The admissions team can assist you with official policies."
                )

        # 2. Unsupported Result Guarantees
        for pattern in GUARANTEE_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Unsupported guarantee request.")
                return (
                    False,
                    EscalationReason.UNSUPPORTED_GUARANTEE,
                    "Northstar Learning Academy does not guarantee ranks or examination results. Please contact admissions for performance histories."
                )

        # 3. Unauthorized Discounts and Waivers
        for pattern in DISCOUNT_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Unauthorized discount negotiation.")
                return (
                    False,
                    EscalationReason.UNAUTHORIZED_DISCOUNT,
                    "Northstar provides scholarships up to 20% subject to assessment. Unauthorized fee waivers cannot be granted by the automated assistant."
                )

        # 4. Out-of-Scope Programs (NEET, UPSC, etc.)
        for pattern in UNSUPPORTED_PROGRAM_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Unsupported academic curriculum.")
                return (
                    False,
                    EscalationReason.UNSUPPORTED_QUESTION,
                    "Northstar Learning Academy offers only Foundation (Classes 9-10) and JEE (Classes 11-12) programs. We do not provide coaching for the requested examination."
                )

        # 5. Out-of-Scope Facilities (Hostel, Transport, Home Tutoring)
        for pattern in UNSUPPORTED_FACILITY_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Unsupported facility or logistic query.")
                return (
                    False,
                    EscalationReason.UNSUPPORTED_QUESTION,
                    "Northstar Learning Academy does not provide hostel, transport, or private home tutoring. Our admissions team can assist with nearby student accommodation recommendations."
                )

        # 6. Out-of-Scope Locations (Delhi, Bangalore, Pune, etc.)
        for pattern in UNSUPPORTED_LOCATION_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Unsupported campus location.")
                return (
                    False,
                    EscalationReason.UNSUPPORTED_QUESTION,
                    "Northstar Learning Academy operates exclusively at our single campus in Andheri West, Mumbai. We do not have branches in other cities."
                )

        # 7. Syllabus and Curriculum Detailed Inquiries
        for pattern in SYLLABUS_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Detailed curriculum inquiry.")
                return (
                    False,
                    EscalationReason.UNSUPPORTED_QUESTION,
                    "Northstar Learning Academy offers a 12-month JEE Preparation Program for Classes 11-12 and a 10-month Foundation Program for Classes 9-10 with study material and mock tests included. For the detailed subject syllabus and chapter breakdown, please contact our academic team at admissions@northstar.example."
                )

        # 6. Refund Policy Violation Demands
        for pattern in REFUND_BOUNDARY_PATTERNS:
            if pattern.search(cleaned):
                logger.info("Guardrail tripped: Refund policy violation boundary.")
                return (
                    False,
                    EscalationReason.POLICY_VIOLATION,
                    "Under Northstar policy, tuition fees are non-refundable once classes have begun. You may contact admissions@northstar.example for special circumstance reviews."
                )

        # Passed all upfront guardrails
        return (True, None, None)

guardrail_service = GuardrailService()
