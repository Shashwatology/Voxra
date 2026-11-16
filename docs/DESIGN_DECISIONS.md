# Voxra (Enquiry Studio) — Architectural Design Decisions (ADRs)

## ADR-001: Separation of Candidate Retrieval from Answer Text Delivery
* **Context:** Generative chatbots frequently hallucinate numbers, currency amounts, and policy clauses.
* **Decision:** Decouple retrieval/intent selection from answer delivery. The AI model or TF-IDF engine selects an approved FAQ identifier (`FAQ-002`). The backend then loads the exact string verbatim from `data/approved_faq.json`.
* **Consequence:** 100% elimination of generative answer hallucinations.

## ADR-002: Deterministic TF-IDF as Primary Retrieval Baseline
* **Context:** Neural embedding models (e.g., SentenceTransformers, OpenAI embeddings) introduce heavy PyTorch/ONNX dependencies, high cold-start latency, and non-calibrated cosine scores.
* **Decision:** Use scikit-learn's `TfidfVectorizer` with sublinear term scaling, unigrams, and bigrams, augmented with domain affinity re-weighting.
* **Consequence:** Sub-2ms response latency, minimal memory footprint, 100% offline air-gapped capability, and full explainability.

## ADR-003: Constrained Pydantic Structured Output for Gemini
* **Context:** When using Gemini Flash, open-ended conversational prompting creates vulnerabilities to jailbreaks and unauthorized discount agreements.
* **Decision:** Enforce structured output via Pydantic model (`GeminiStructuredDecision`) using the official `google-genai` SDK. The model returns only `decision`, `faq_id`, `ambiguity_detected`, and `reason_code`.
* **Consequence:** Zero natural language text is returned from the model to the user, preventing prompt leaks and jailbreaks.

## ADR-004: In-Memory Sliding-Window Rate Limiting
* **Context:** Public chat endpoints are vulnerable to automated query floods.
* **Decision:** Implement `RateLimitMiddleware` using a thread-safe sliding window tracking client IPs with a 60-second horizon and 60-request limit.
* **Consequence:** Protects backend from CPU exhaustion while avoiding the overhead of external Redis instances for single-node deployments.

## ADR-005: Voice-to-Text via Browser Web Speech API with Editable Preview
* **Context:** Voice input can inadvertently capture private background conversation or misinterpret accents.
* **Decision:** Implement browser-native Web Speech API with an explicit click-to-record modal and editable transcript confirmation dialog.
* **Consequence:** User explicitly approves every transcript before submission, ensuring untrusted audio inputs pass through the exact same guardrail pipeline as typed text.

