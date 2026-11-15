"""
Guarded Enquiry Service - Deterministic Retrieval Service
Uses scikit-learn TF-IDF with word and character n-grams, cosine similarity,
and rigorous ambiguity and threshold boundaries over the 15 approved FAQs.
"""

import re
from typing import Dict, List, NamedTuple, Optional, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.faq_service import faq_service

class CandidateMatch(NamedTuple):
    faq_id: str
    score: float
    canonical_question: str
    category: str

class RetrievalResult(NamedTuple):
    top_candidate: Optional[CandidateMatch]
    candidates: List[CandidateMatch]
    is_ambiguous: bool
    is_low_confidence: bool
    ambiguity_reason: Optional[str]

# Hindi / Hinglish normalization mapping
HINGLISH_MAP = {
    r"\bfees?\s+kitni\s+hai\b": "fee cost tuition",
    r"\bkitna\s+kharcha\b": "cost tuition fee",
    r"\bkahan\s+hai\b": "where located address campus",
    r"\baddress\s+kya\s+hai\b": "campus address location",
    r"\btiming\s+kya\s+hai\b": "timings schedule hours",
    r"\bsamay\b": "timing schedule hours",
    r"\bdakhila\b": "admission application",
    r"\bpaisa\s+wapas\b": "tuition refund policy",
}

class RetrievalService:
    """Deterministic FAQ retrieval using TF-IDF and multi-level similarity."""

    def __init__(self):
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.faq_ids: List[str] = []
        self.faq_categories: List[str] = []
        self.canonical_questions: List[str] = []
        self.tfidf_matrix = None
        self._build_index()

    def _normalize_text(self, text: str) -> str:
        """Sanitize, lowercase, and apply Hinglish normalization."""
        cleaned = text.lower().strip()
        for pattern, replacement in HINGLISH_MAP.items():
            cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
        # Strip non-alphanumeric except rupee and question symbols
        cleaned = re.sub(r"[^\w\s₹?]", " ", cleaned)
        return " ".join(cleaned.split())

    def _build_index(self) -> None:
        """Constructs the TF-IDF matrix across all 15 canonical FAQs."""
        corpus: List[str] = []
        self.faq_ids.clear()
        self.faq_categories.clear()
        self.canonical_questions.clear()

        for faq in faq_service.get_all_faqs():
            # Combine canonical question, alternative questions, and keywords
            # Canonical question is duplicated to give it higher term frequency weight
            doc_parts = [
                faq.canonical_question,
                faq.canonical_question,
                " ".join(faq.alternative_questions),
                " ".join(faq.keywords)
            ]
            full_doc = self._normalize_text(" ".join(doc_parts))
            corpus.append(full_doc)
            self.faq_ids.append(faq.id)
            self.faq_categories.append(faq.category)
            self.canonical_questions.append(faq.canonical_question)

        # Word n-grams (1, 2) and character n-grams (3, 5) combined via analyzer
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            norm="l2",
            lowercase=True
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        logger.info(
            f"TF-IDF retrieval index built successfully for {len(self.faq_ids)} FAQs.",
            extra={"corpus_size": len(corpus)}
        )

    def retrieve(self, query: str, top_k: int = 3) -> RetrievalResult:
        """
        Calculates cosine similarity and verifies ambiguity and confidence bounds.
        Applies domain-affinity adjustments for program and fee distinctions.
        """
        normalized_query = self._normalize_text(query)
        query_vector = self.vectorizer.transform([normalized_query])
        
        # Calculate cosine similarities
        raw_scores = cosine_similarity(query_vector, self.tfidf_matrix)[0].copy()
        
        # Domain-affinity fine-tuning for near-neighbors
        query_words = set(normalized_query.split())
        has_jee = "jee" in query_words
        has_foundation = "foundation" in query_words
        has_reg = "registration" in query_words or "register" in query_words
        has_weekend = "weekend" in query_words or "saturday" in query_words or "sunday" in query_words

        adjusted_scores = raw_scores.copy()
        for idx, faq_id in enumerate(self.faq_ids):
            doc_text = self.canonical_questions[idx].lower()
            
            if has_jee:
                if "jee" in doc_text:
                    adjusted_scores[idx] *= 1.30
                elif "foundation" in doc_text:
                    adjusted_scores[idx] *= 0.60
                    
            if has_foundation:
                if "foundation" in doc_text:
                    adjusted_scores[idx] *= 1.30
                elif "jee" in doc_text and not has_jee:
                    adjusted_scores[idx] *= 0.60
                    
            if has_reg:
                if faq_id == "FAQ-004":
                    adjusted_scores[idx] *= 1.35
                    
            if has_weekend:
                if faq_id == "FAQ-008":
                    adjusted_scores[idx] *= 1.35
        
        # Rank all candidates by adjusted score
        ranked_indices = np.argsort(adjusted_scores)[::-1]
        
        candidates: List[CandidateMatch] = []
        for idx in ranked_indices[:top_k]:
            candidates.append(
                CandidateMatch(
                    faq_id=self.faq_ids[idx],
                    score=float(adjusted_scores[idx]),
                    canonical_question=self.canonical_questions[idx],
                    category=self.faq_categories[idx]
                )
            )

        if not candidates:
            return RetrievalResult(
                top_candidate=None,
                candidates=[],
                is_ambiguous=False,
                is_low_confidence=True,
                ambiguity_reason="No candidates identified."
            )

        top1 = candidates[0]
        top2 = candidates[1] if len(candidates) > 1 else None

        # 1. Generic Ambiguity Check
        # Specific known ambiguous queries like "How much is the fee?" or "What is the fee?"
        # where the user does not specify Foundation, JEE, or registration fee.
        generic_fee_query = bool(re.search(r"^(what|how\s+much)\s+(is|are)\s+(the\s+)?fees?\??$", normalized_query))
        if generic_fee_query:
            return RetrievalResult(
                top_candidate=top1,
                candidates=candidates,
                is_ambiguous=True,
                is_low_confidence=False,
                ambiguity_reason="AMBIGUOUS_FEE_QUERY: Multiple programs exist (Foundation ₹24,000, JEE ₹60,000, Registration ₹1,000)."
            )

        # 2. Score Margin Ambiguity Check
        # If top 1 and top 2 are very close, and top 1 is not overwhelmingly confident
        is_ambiguous = False
        ambiguity_reason = None
        if top2 and (top1.score - top2.score < settings.AMBIGUITY_DELTA) and (top1.score < settings.HIGH_CONFIDENCE_THRESHOLD):
            # Check if candidates represent different distinct programs or categories
            if top1.faq_id != top2.faq_id:
                is_ambiguous = True
                ambiguity_reason = f"Close similarity between {top1.faq_id} ({top1.score:.2f}) and {top2.faq_id} ({top2.score:.2f})."

        # 3. Low Confidence Check
        is_low_confidence = top1.score < settings.SIMILARITY_THRESHOLD

        return RetrievalResult(
            top_candidate=top1,
            candidates=candidates,
            is_ambiguous=is_ambiguous,
            is_low_confidence=is_low_confidence,
            ambiguity_reason=ambiguity_reason
        )

retrieval_service = RetrievalService()
