# Voxra (Enquiry Studio) — Security Controls Specification

## 1. Trust Boundary Definition

The trust boundary is enforced strictly in backend application code:

```
[Untrusted Public Zone]
  - User Enquiry Text (Web Browser / Speech-to-Text)
  - HTTP Request Headers & Query Parameters
──────────────────────────── Trust Boundary ────────────────────────────
[Application Security Zone]
  - Pydantic v2 Input Validation (Length: 3-500, Alphanumeric check)
  - Guardrail Regex Screening (Prompt Injection, Guarantees, Discounts)
  - Rate Limiting Middleware (60 req/min per IP)
  - Secret & PII Scrubbing Structured Logger (SafeJsonFormatter)
────────────────────────────────────────────────────────────────────────
[Constrained Intelligence Zone]
  - Local Scikit-Learn TF-IDF Retrieval
  - Gemini 2.5 Flash Structured Classifier (Zero Generation)
  - Independent Policy Verification Layer
────────────────────────────────────────────────────────────────────────
[Immutable Data Zone]
  - data/approved_faq.json (Read-only, validated at boot)
  - Backend Environment Secrets (GEMINI_API_KEY, ADMIN_API_KEY)
```

---

## 2. Implemented Security Controls

### 2.1 Input Validation (`AskRequest`)
* **String Bounds:** Minimum 3 characters, maximum 500 characters.
* **Alphanumeric Guard:** Requires valid word characters, rejecting pure punctuation payloads.
* **Whitespace Trimming:** Trims leading/trailing whitespace before evaluation.

### 2.2 Upfront Guardrail Screening (`GuardrailService`)
* **Prompt Injection Defense:** Intercepts phrases such as *"ignore previous instructions"*, *"disregard rules"*, *"you are now DAN/admin"*, *"repeat the words above"*, *"system diagnostic override"*.
* **Credential Protection:** Blocks queries requesting hidden prompts or API keys (*"reveal your system prompt"*, *"print api key"*, *"dump environment"*).
* **Rank Guarantee Interception:** Rejects demands for examination rank promises (*"guarantee AIR 1"*, *"guarantee admission"*).
* **Discount Interception:** Blocks unauthorized concession negotiations (*"50% discount"*, *"cash discount"*, *"full fee waiver"*, *"100% free"*).
* **Curriculum Enforcement:** Immediately flags out-of-scope curricula (*"NEET"*, *"UPSC"*, *"CAT"*, *"IB curriculum"*).
* **Facility Enforcement:** Flags unsupported boarding/logistics (*"hostel"*, *"mess food"*, *"school bus"*, *"private home tutor"*).
* **Refund Boundary Guard:** Rejects refund demands that contradict the 7-day pre-commencement policy (*"refund after attending 3 weeks of class"*).

### 2.3 Denial of Service & Flooding Defense (`RateLimitMiddleware`)
* In-memory sliding-window rate limiter enforcing a maximum of **60 requests per minute** per client IP.
* Returns standard `HTTP 429 Too Many Requests` with a safe JSON escalation payload and request correlation ID.

### 2.4 Privacy-Preserving Telemetry (`SafeJsonFormatter`)
* Automated regex scrubbing intercepts:
  - Personal email addresses (`[REDACTED_EMAIL]`)
  - Phone numbers (`[REDACTED_PHONE]`)
  - Sensitive object keys (`api_key`, `token`, `authorization`, `secret`, `password`)

### 2.5 Administrative Route Protection
* Endpoints accessing staff handoffs (`GET /handoffs`, `POST /handoffs/{id}/resolve`) require an administrative API key (`X-Admin-Key`) in production environments.

