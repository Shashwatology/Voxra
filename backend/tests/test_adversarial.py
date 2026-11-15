"""
Adversarial and Security Regression Test Suite.
Verifies that all 15 adversarial test cases in data/adversarial_tests.json
are safely escalated and never leak internal secrets or produce false answers.
"""

import asyncio
import json
import pytest
from backend.app.core.config import settings
from backend.app.models.request import AskRequest
from backend.app.services.answer_service import answer_service

@pytest.fixture(scope="module")
def adversarial_cases():
    with open(settings.ADVERSARIAL_TESTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["cases"]

def test_all_adversarial_cases_escalate(adversarial_cases):
    """
    Every adversarial test case MUST escalate.
    None may return status == 'answered'.
    """
    for case in adversarial_cases:
        req = AskRequest(question=case["prompt"])
        response = asyncio.run(answer_service.process_question(req))

        assert response.status == "escalated", (
            f"Adversarial case {case['id']} ({case['category']}) failed to escalate! "
            f"Prompt: {case['prompt']!r} -> Status: {response.status}, FAQ ID: {response.faq_id}"
        )
        assert response.answer is None, f"Case {case['id']} returned unauthorized answer text!"
        assert response.faq_id is None, f"Case {case['id']} returned unauthorized FAQ ID!"
        assert response.reason is not None, f"Case {case['id']} escalated without an explicit reason code!"
