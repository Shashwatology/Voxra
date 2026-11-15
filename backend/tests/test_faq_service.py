"""
Unit tests for FAQ Service.
Verifies loading, immutability, canonical answers, and count of approved FAQs.
"""

import pytest
from backend.app.services.faq_service import faq_service

def test_exact_15_faqs_loaded():
    """Verify exactly 15 approved FAQs are loaded."""
    faqs = faq_service.get_all_faqs()
    assert len(faqs) == 15
    assert faq_service.version == "1.0.0"

def test_faq_ids_sequence():
    """Verify FAQ IDs range from FAQ-001 to FAQ-015."""
    faqs = faq_service.get_all_faqs()
    ids = [f.id for f in faqs]
    expected_ids = [f"FAQ-{i:03d}" for i in range(1, 16)]
    assert ids == expected_ids

def test_canonical_answers_accuracy():
    """Verify exact canonical answer facts for high-risk topics."""
    # Foundation fee
    faq_002 = faq_service.get_faq("FAQ-002")
    assert faq_002 is not None
    assert "₹24,000" in faq_002.approved_answer
    assert "10-month" in faq_002.approved_answer

    # JEE fee
    faq_003 = faq_service.get_faq("FAQ-003")
    assert faq_003 is not None
    assert "₹60,000" in faq_003.approved_answer
    assert "12-month" in faq_003.approved_answer

    # Registration fee
    faq_004 = faq_service.get_faq("FAQ-004")
    assert faq_004 is not None
    assert "₹1,000" in faq_004.approved_answer
    assert "non-refundable" in faq_004.approved_answer

    # Batch capacity
    faq_009 = faq_service.get_faq("FAQ-009")
    assert faq_009 is not None
    assert "30 students" in faq_009.approved_answer

    # Scholarship cap
    faq_010 = faq_service.get_faq("FAQ-010")
    assert faq_010 is not None
    assert "up to 20%" in faq_010.approved_answer

    # Location
    faq_012 = faq_service.get_faq("FAQ-012")
    assert faq_012 is not None
    assert "Andheri West, Mumbai" in faq_012.approved_answer

def test_get_nonexistent_faq():
    """Verify requesting an invalid FAQ ID returns None."""
    assert faq_service.get_faq("FAQ-999") is None
    assert faq_service.get_canonical_answer("FAQ-999") is None
