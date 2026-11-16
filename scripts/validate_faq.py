"""
Guarded Enquiry Service - FAQ Validation Script
Verifies integrity, structure, schema constraints, and immutability of approved_faq.json.
"""

import json
import sys
from pathlib import Path

# Ensure backend can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from backend.app.core.config import settings

REQUIRED_FIELDS = {"id", "category", "canonical_question", "approved_answer", "immutable"}
PERMISSIBLE_CATEGORIES = {
    "Programs", "Fees", "Payments", "Schedule", "Batches",
    "Scholarships", "Location", "Admissions", "Refunds"
}

def validate_approved_faqs():
    print(f"[*] Validating FAQ knowledge base at: {settings.APPROVED_FAQ_PATH}")
    if not settings.APPROVED_FAQ_PATH.exists():
        print(f"[!] Error: File not found: {settings.APPROVED_FAQ_PATH}")
        sys.exit(1)

    with open(settings.APPROVED_FAQ_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    faqs = data.get("faqs", [])
    errors = []

    if len(faqs) != 15:
        errors.append(f"Expected exactly 15 FAQs, found {len(faqs)}")

    seen_ids = set()
    for idx, faq in enumerate(faqs, start=1):
        # 1. Check required fields
        missing = REQUIRED_FIELDS - set(faq.keys())
        if missing:
            errors.append(f"FAQ index {idx} missing required fields: {missing}")

        # 2. Check ID format
        faq_id = faq.get("id", "")
        expected_id = f"FAQ-{idx:03d}"
        if faq_id != expected_id:
            errors.append(f"FAQ index {idx} has ID '{faq_id}', expected '{expected_id}'")
        if faq_id in seen_ids:
            errors.append(f"Duplicate FAQ ID: '{faq_id}'")
        seen_ids.add(faq_id)

        # 3. Check Category
        category = faq.get("category", "")
        if category not in PERMISSIBLE_CATEGORIES:
            errors.append(f"FAQ {faq_id} has invalid category '{category}'")

        # 4. Check Content non-emptiness
        if not faq.get("canonical_question", "").strip():
            errors.append(f"FAQ {faq_id} has empty canonical_question")
        if not faq.get("approved_answer", "").strip():
            errors.append(f"FAQ {faq_id} has empty approved_answer")

        # 5. Check Immutability flag
        if not faq.get("immutable", False):
            errors.append(f"FAQ {faq_id} must have immutable=True")

    if errors:
        print(f"[!] Validation failed with {len(errors)} error(s):")
        for err in errors:
            print(f"    - {err}")
        sys.exit(1)

    print(f"[+] All 15 approved FAQs validated successfully!")
    print(f"    Institute: {data.get('institute')}")
    print(f"    Version:   {data.get('version')}")
    print(f"    Campus:    {data.get('campus')}")

if __name__ == "__main__":
    validate_approved_faqs()

