"""
Guarded Enquiry Service - Deterministic Retrieval Service
Uses scikit-learn TF-IDF with word and character n-grams, cosine similarity,
and rigorous ambiguity and threshold boundaries over the 15 approved FAQs.
"""

import math
import re
from collections import Counter
from typing import Dict, List, NamedTuple, Optional, Tuple

try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    np = None

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

    def _tokenize(self, text: str) -> List[str]:
        words = text.lower().split()
        unigrams = words
        bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words) - 1)]
        return unigrams + bigrams

    def _compute_vector(self, tokens: List[str]) -> Dict[str, float]:
        counts = Counter(tokens)
        vec = {}
        for tok, count in counts.items():
            if hasattr(self, '_pure_idf') and tok in self._pure_idf:
                tf = 1.0 + math.log(count) if count > 0 else 0.0
                vec[tok] = tf * self._pure_idf[tok]
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        return {k: v / norm for k, v in vec.items()}

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

        if SKLEARN_AVAILABLE:
            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                sublinear_tf=True,
                norm="l2",
                lowercase=True
            )
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        else:
            # Pure Python TF-IDF fallback for lightweight serverless environments
            doc_tokens_list = [self._tokenize(doc) for doc in corpus]
            self._pure_vocab = sorted(list({tok for toks in doc_tokens_list for tok in toks}))
            n_docs = len(corpus)
            self._pure_df = Counter()
            for toks in doc_tokens_list:
                for tok in set(toks):
                    self._pure_df[tok] += 1
            self._pure_idf = {tok: math.log((1 + n_docs) / (1 + self._pure_df[tok])) + 1 for tok in self._pure_vocab}
            self._pure_doc_vectors = [self._compute_vector(toks) for toks in doc_tokens_list]

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

        if SKLEARN_AVAILABLE:
            query_vector = self.vectorizer.transform([normalized_query])
            raw_scores = cosine_similarity(query_vector, self.tfidf_matrix)[0].tolist()
        else:
            q_vec = self._compute_vector(self._tokenize(normalized_query))
            raw_scores = []
            for d_vec in self._pure_doc_vectors:
                sim = sum(q_vec.get(tok, 0.0) * d_vec.get(tok, 0.0) for tok in q_vec)
                raw_scores.append(sim)
        
        # Domain-affinity fine-tuning for near-neighbors
        query_words = set(normalized_query.split())
        has_jee = "jee" in query_words
        has_foundation = "foundation" in query_words
        has_reg = "registration" in query_words or "register" in query_words
        has_weekend = "weekend" in query_words or "saturday" in query_words or "sunday" in query_words

        adjusted_scores = list(raw_scores)
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
        ranked_indices = sorted(range(len(adjusted_scores)), key=lambda i: adjusted_scores[i], reverse=True)
        
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
        # Ambiguity only applies when top candidate is an actual viable match (>= SIMILARITY_THRESHOLD)
        is_ambiguous = False
        ambiguity_reason = None
        if top1.score >= settings.SIMILARITY_THRESHOLD:
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
