"""
Unit tests for Retrieval Service.
Verifies TF-IDF similarity accuracy, distinction between near-neighbor programs,
Hinglish normalization, and ambiguity detection.
"""

import pytest
from backend.app.services.retrieval_service import retrieval_service

def test_foundation_fee_retrieval():
    """Verify Foundation fee query retrieves FAQ-002."""
    query = "How much is the Foundation Program tuition fee?"
    res = retrieval_service.retrieve(query)
    assert res.top_candidate is not None
    assert res.top_candidate.faq_id == "FAQ-002"
    assert not res.is_ambiguous
    assert not res.is_low_confidence

def test_jee_fee_retrieval():
    """Verify JEE fee query retrieves FAQ-003."""
    query = "What is the fee for the 12-month JEE Preparation Program?"
    res = retrieval_service.retrieve(query)
    assert res.top_candidate is not None
    assert res.top_candidate.faq_id == "FAQ-003"
    assert not res.is_ambiguous

def test_registration_fee_distinction():
    """Verify separate registration fee query retrieves FAQ-004."""
    query = "Is there a registration charge and is it included in tuition?"
    res = retrieval_service.retrieve(query)
    assert res.top_candidate is not None
    assert res.top_candidate.faq_id == "FAQ-004"

def test_batch_schedule_distinction():
    """Verify weekday timings for Foundation vs JEE."""
    foundation_res = retrieval_service.retrieve("When are Foundation weekday classes held?")
    assert foundation_res.top_candidate.faq_id == "FAQ-006"

    jee_res = retrieval_service.retrieve("What are the days and hours for JEE classes?")
    assert jee_res.top_candidate.faq_id == "FAQ-007"

def test_weekend_batch_retrieval():
    """Verify weekend batch enquiry retrieves FAQ-008."""
    res = retrieval_service.retrieve("Do you offer Saturday and Sunday weekend batches?")
    assert res.top_candidate.faq_id == "FAQ-008"

def test_batch_capacity_retrieval():
    """Verify batch capacity query retrieves FAQ-009."""
    res = retrieval_service.retrieve("How many students are there in a batch?")
    assert res.top_candidate.faq_id == "FAQ-009"

def test_ambiguity_flagged_for_generic_fee():
    """Verify generic 'How much is the fee?' is flagged as ambiguous."""
    res = retrieval_service.retrieve("How much is the fee?")
    assert res.is_ambiguous

def test_hinglish_normalization():
    """Verify Hindi/Hinglish query retrieves correct FAQ."""
    res = retrieval_service.retrieve("Foundation ki fees kitni hai?")
    assert res.top_candidate.faq_id == "FAQ-002"

