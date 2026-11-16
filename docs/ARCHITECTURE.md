# Voxra (Enquiry Studio) — Architecture Specification

## 1. System Overview

**Product Title:** Enquiry Studio  
**Customer-Facing Interface:** Northstar Admissions  
**Client Simulation:** Northstar Learning Academy (Andheri West, Mumbai, Maharashtra, India)  
**Core Architectural Philosophy:** *Automate what is verifiable. Escalate what is not. Every answer, accounted for.*

Voxra is built to eliminate generative hallucination in customer-facing educational admissions. Coaching institutes face severe reputational and legal risks if automated systems invent fees, grant unauthorized discounts, guarantee exam ranks, or misrepresent refund terms.

To solve this, Voxra implements a **hybrid retrieval and controlled-decision architecture**:
- **Zero Generative Text:** The system never synthesizes answer sentences.
- **Canonical Grounding:** Verified answers are loaded directly from `data/approved_faq.json`.
- **Controlled Abstention:** Ambiguous, unsupported, or hostile enquiries are escalated to human admissions personnel with explicit, machine-readable reason codes.

---

## 2. Decision Flow Architecture

The request lifecycle moves through seven discrete stages:

```
[Untrusted User Enquiry]
           │
           ▼
[1. Request Validation (Pydantic v2)]
  - Length: 3 to 500 characters
  - Alphanumeric validation & whitespace trimming
           │
           ▼
[2. Upfront Guardrail Screening (Regex & Threat Filters)]
  - Prompt injection detection
  - Secret extraction screening
  - Exam rank guarantee rejection
  - Unauthorized discount blocking
  - Out-of-scope program/facility filter
           │
           ├──────────────────────────────► [ESCALATE (Explicit Reason Code)]
           ▼
[3. Deterministic Retrieval Engine (TF-IDF + Cosine Similarity)]
  - Sublinear term frequency, unigram + bigram n-grams
  - Hinglish lexical normalization
  - Domain-affinity weighting (Foundation vs. JEE vs. Registration)
  - Ambiguity margin evaluation: (Score_Top1 - Score_Top2 < 0.08)
           │
           ├──────────────────────────────► [ESCALATE (AMBIGUOUS_QUERY)]
           ▼
[4. Disambiguation & Candidate Selection (Gemini 2.5 Flash)]
  - Invoked ONLY in hybrid mode (optional)
  - Constrained structured output: { decision, faq_id, ambiguity_detected, reason_code }
  - Model selects ONLY from provided top-3 candidate FAQ IDs
  - Invariant: Zero answer text generation
           │
           ├──────────────────────────────► [ESCALATE (UNSUPPORTED_QUESTION)]
           ▼
[5. Canonical Answer Enforcement]
  - Exact verbatim answer loaded from data/approved_faq.json
           │
           ▼
[6. Structured Response Assembly & Audit Logging]
  - Return JSON: { status: "answered", answer, faq_id, source: "approved_faq", request_id, latency_ms }
  - PII-scrubbed structured JSON telemetry
```

---

## 3. Component Architecture

### 3.1 Backend Components (`backend/app/`)
* **`api/routes.py`**: Declares REST endpoints (`POST /ask`, `GET /health`, `GET /faq`, `GET /metrics/summary`, `GET /evaluation/results`, `GET /handoffs`).
* **`api/middleware.py`**: Enforces sliding-window rate limiting (60 requests/minute/IP), correlation IDs (`X-Request-ID`), and standard security headers (`nosniff`, `DENY`).
* **`services/guardrail_service.py`**: Intercepts prompt injections, fee negotiations, rank promises, and unsupported curricula.
* **`services/retrieval_service.py`**: Scikit-learn TF-IDF vectorizer and cosine similarity scorer with multi-target ambiguity detection.
* **`services/gemini_service.py`**: Official Google Gen AI SDK integration with bounded retries, 4-second timeout, and Pydantic structured output.
* **`services/faq_service.py`**: In-memory immutable store of the 15 canonical FAQs.
* **`services/answer_service.py`**: Core orchestrator executing the pipeline stages.
* **`services/audit_service.py`**: Operational telemetry tracker and human handoff review queue manager.

### 3.2 Frontend Architecture (`frontend/src/`)
* **React 18 + TypeScript + Vite + Tailwind CSS**: Clean component-driven modular structure.
* **Design System**: Editorial-quality palette inspired by Linear and Apple (off-white light canvas `#F8F9FB`, charcoal dark canvas `#0D1117`, restrained teal accent `#0D9488`).
* **Customer Chat**: Conversational interface with verified grounding badges, measured latency, keyboard shortcuts, copy action, and speech-to-text input.
* **Operations Workspace**:
  - *Overview:* Live metrics, answer coverage %, latency percentiles, recent query stream.
  - *Knowledge Base:* Searchable, filterable table of the 15 canonical FAQs with detail drawer.
  - *Evaluations:* Benchmark dashboard with 100% verified test cases and raw JSON artifact inspection.
  - *Review Queue:* Handoff queue for escalated questions with audit resolution notes.
  - *Security & Trust:* Threat model matrix, guardrail verification, and provider status.
  - *Documentation:* Embedded architectural specification and economic analysis.

---

## 4. Key Engineering Invariants

1. **Answer Immutability:** No prompt, API request, or model generation can modify the text of canonical FAQ answers.
2. **Controlled Abstention:** Ambiguous queries (e.g., "What is the fee?") MUST be escalated to prevent misinforming parents.
3. **Zero Secrets in Telemetry:** All log payloads are scrubbed of emails, phone numbers, and credentials before serialization.
4. **Air-Gapped Local Operation:** The service boots and answers valid queries locally even if no Gemini API key is configured.

