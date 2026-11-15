"""
Guarded Enquiry Service - FAQ Service
Loads and strictly serves the canonical approved FAQ knowledge base.
All answers are immutable and directly fetched from the validated JSON file.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.models.response import FaqItem

class FaqService:
    """Manages the canonical, immutable FAQ knowledge repository."""
    
    def __init__(self, file_path: Optional[Path] = None):
        self.file_path = file_path or settings.APPROVED_FAQ_PATH
        self._faqs: Dict[str, FaqItem] = {}
        self._faq_list: List[FaqItem] = []
        self.version: str = "1.0.0"
        self.institute: str = "Northstar Learning Academy"
        self._load_and_validate()

    def _load_and_validate(self) -> None:
        """Loads and strictly validates the approved FAQ data."""
        if not self.file_path.exists():
            raise FileNotFoundError(f"Approved FAQ repository not found at: {self.file_path}")
            
        with open(self.file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        self.version = data.get("version", "1.0.0")
        self.institute = data.get("institute", "Northstar Learning Academy")
        raw_faqs = data.get("faqs", [])
        
        if len(raw_faqs) != 15:
            logger.warning(
                f"Expected exactly 15 approved FAQ entries, but found {len(raw_faqs)}.",
                extra={"faq_count": len(raw_faqs)}
            )
            
        self._faqs.clear()
        self._faq_list.clear()
        
        for item in raw_faqs:
            faq_item = FaqItem(
                id=item["id"],
                category=item["category"],
                canonical_question=item["canonical_question"],
                approved_answer=item["approved_answer"],
                alternative_questions=item.get("alternative_questions", []),
                keywords=item.get("keywords", []),
                immutable=True
            )
            self._faqs[faq_item.id] = faq_item
            self._faq_list.append(faq_item)
            
        logger.info(
            f"Successfully loaded {len(self._faqs)} approved FAQs from {self.file_path.name}",
            extra={"faq_count": len(self._faqs), "version": self.version}
        )

    def get_faq(self, faq_id: str) -> Optional[FaqItem]:
        """Returns a canonical FAQ item by its unique ID."""
        return self._faqs.get(faq_id)

    def get_all_faqs(self) -> List[FaqItem]:
        """Returns all canonical FAQ items in repository order."""
        return list(self._faq_list)

    def get_canonical_answer(self, faq_id: str) -> Optional[str]:
        """Returns strictly the verified approved answer text."""
        item = self._faqs.get(faq_id)
        return item.approved_answer if item else None

faq_service = FaqService()
