# Security Policy

## 1. Supported Versions

| Version | Supported |
| :--- | :--- |
| `1.0.x` | Yes |
| `< 1.0` | No |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability, prompt injection bypass, or unauthorized disclosure risk within Voxra / Enquiry Studio:
1. **Do not create a public issue** on GitHub.
2. Email full reproduction steps to: `security@northstar.example` (or institutional contact).
3. Include:
   - Full input prompt and payload
   - Endpoint accessed (`/ask`, `/handoffs`, etc.)
   - Expected safe behavior vs. observed behavior
   - System configuration mode (`local_only` or `hybrid`)
4. You will receive an acknowledgment within 24 hours.

---

## 3. Security Invariants Enforced in Code

* **No Answer Generation:** LLMs are strictly forbidden from generating direct customer-facing text.
* **Secret Scrubbing:** All JSON logs are stripped of API credentials and user PII.
* **Rate Limits:** In-memory sliding-window limiter blocks traffic exceeding 60 requests/minute per client IP.
* **Controlled Abstention:** Any unverified query triggers explicit escalation.

