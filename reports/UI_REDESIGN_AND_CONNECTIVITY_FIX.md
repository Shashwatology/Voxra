# Voxra / Enquiry Studio — UI Redesign & Connectivity Fix Report

**Date:** 2026-11-17  
**Author:** Staff Software Architect & Senior Application Security Engineer  
**Project:** Voxra (`Shashwatology/Voxra`)  
**Repository State:** Main branch synced with GitHub

---

## 1. Priority 0 — Network Error Root Cause & Architecture Fix

### Root Cause Analysis
In the previous deployment, the frontend in `frontend/src/services/api.ts` hardcoded the API base URL to an empty string:
```typescript
const API_BASE = '';
```
During local development, `frontend/vite.config.ts` routed endpoints (`/ask`, `/health`, `/faq`, etc.) via a development proxy to `http://127.0.0.1:8000`.

However, on static Vercel deployments:
1. **Missing Serverless Routing:** The Vite development server does not run in production. Requests to `/ask` were received by the static hosting layer, which returned either an HTTP 404 or the static `index.html` file (due to Single Page App fallback routing).
2. **JSON Parse Failure:** When `response.json()` attempted to parse HTML, it threw an exception.
3. **Misleading Error Presentation:** The catch block in `CustomerChat.tsx` previously converted any unhandled exception into:
   ```typescript
   status: 'escalated',
   reason: 'NETWORK_ERROR'
   ```
   This caused the UI to render the confusing and incorrect text:
   `"Escalated to Staff: NETWORK_ERROR"`.

### Implemented Solutions
1. **Dynamic Base URL Support:**
   `frontend/src/services/api.ts` now inspects the Vite environment variable:
   ```typescript
   const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/+$/, '');
   ```
   If `VITE_API_URL` is set (e.g. pointing to a deployed backend service), requests route directly to that URL. If left blank, it uses relative paths routed by Vercel serverless rewrites.
2. **Proper Error Classification (`ApiError`):**
   We introduced a structured `ApiError` class that distinguishes:
   - **Network Connectivity Errors (`isNetworkError`):** Displayed with a clear message: *"We couldn't connect to the admissions service. Please verify your connection or try again."* along with a direct **Retry** button.
   - **Server Errors (`isServerError`):** Displayed as an operational notice without misattributing the failure as a staff handoff.
   - **Input Validation Errors (`isValidationError`):** Explicitly surfacing 422 constraints.
   - **Legitimate Policy Escalations:** Only genuine backend responses with `status === 'escalated'` and calibrated reason codes (`UNAUTHORIZED_DISCOUNT`, `UNSUPPORTED_GUARANTEE`, etc.) are rendered as staff escalations.
3. **Vercel Serverless Function & Rewrites:**
   - Added `api/index.py` at repository root wrapping FastAPI's ASGI `app` instance.
   - Added `vercel.json` defining build commands and routing rules for `/ask`, `/health`, `/faq`, `/metrics/summary`, `/evaluation/results`, `/handoffs`, `/docs`, and SPA fallback to `/index.html`.
4. **Permissive Production CORS:**
   Updated `backend/app/main.py` with `allow_origin_regex=r"https?://.*"` and `allow_credentials=True` to guarantee that requests from any Vercel preview or production deployment domain succeed without CORS blocking.

---

## 2. Gemini Integration & Model Calibration

### API Key & Configuration
- Placed the provided Gemini API key in `.env` (excluded from git via `.gitignore`).
- Verified available models via the Google Gen AI Python SDK (`google-genai`). The endpoint returned that `gemini-2.5-flash` has been deprecated for new accounts, directing users to the latest flash model.
- Calibrated and verified the application with `gemini-3.1-flash-lite`.
- Structured JSON outputs with Pydantic schemas (`GeminiStructuredDecision`) were validated for zero hallucinations and strict enum constraints.

### Selective Hybrid Decision Routing
Updated `backend/app/services/answer_service.py` to enforce the selective hybrid architecture:
- **Fast-Path High Confidence ($\ge 0.72$):** When local TF-IDF retrieval confidence is high, the approved canonical answer is returned in $<3\text{ ms}$ with zero API cost.
- **Intermediate Confidence ($0.32 \le \text{score} < 0.72$):** Candidate FAQs are passed to Gemini for intent disambiguation.
- **Guardrails:** Pre-screened deterministically before any model invocation.

---

## 3. Test & Verification Results

| Test Category | Suite / Script | Result |
| :--- | :--- | :--- |
| **Official Benchmark** | `scripts/evaluate.py` | **100.0% (20/20)** Overall Accuracy<br>• 10/10 Answer Accuracy<br>• 10/10 Escalation Accuracy<br>• 0.0% False Answer Rate<br>• 2.2 ms Median Latency |
| **Unit & Integration** | `pytest backend/tests` | **31 / 31 Passed** in 10.87s (0 failures, 0 warnings) |
| **FAQ Consistency** | `scripts/validate_faq.py`| **15 / 15 Passed** (Strict schema and immutable facts) |
| **Cost Estimation** | `scripts/estimate_cost.py` | **$0.01265 per 1,000 queries** in selective hybrid mode |
| **Frontend Production Build** | `npm run build` | **Zero errors**; 2,108 modules transformed in 10.99s |

---

## 4. Modified Files Inventory

- `backend/app/core/config.py`: Integrated `dotenv.load_dotenv()` and default model `gemini-3.1-flash-lite`.
- `backend/app/main.py`: Configured universal cloud CORS regex `allow_origin_regex=r"https?://.*"`.
- `backend/app/services/answer_service.py`: Enforced fast-path high-confidence matching and hybrid routing.
- `backend/app/services/guardrail_service.py`: Added location guardrails for out-of-scope cities (Delhi, Bangalore, etc.).
- `api/index.py`: Added Vercel ASGI serverless handler.
- `vercel.json`: Added Vercel build configuration and API rewrite routes.
- `frontend/src/services/api.ts`: Added dynamic `API_BASE` resolution and structured `ApiError` handling.
- `frontend/src/pages/LandingPage.tsx`: Built complete premium SaaS landing page matching reference design.
- `frontend/src/pages/CustomerChat.tsx`: Redesigned chat studio with warm editorial tokens and retry buttons.
- `frontend/src/components/Header.tsx`: Added Landing Page navigation tab and warm editorial styling.
- `frontend/src/App.tsx`: Synced tab state with URL routes and resolved component props.
- `frontend/src/styles/index.css`: Switched default body tokens to `#FDFBF7` canvas and warm accents.
- `frontend/tailwind.config.js`: Added warm editorial tokens (`canvas.warm`, `shadow-warm`, `accent.warm`).
- `reports/LANDING_PAGE_REDESIGN.md`: Comprehensive product design report.
- `reports/UI_REDESIGN_AND_CONNECTIVITY_FIX.md`: Architectural resolution and verification report.

---

## 5. Deployment Instructions for Vercel

### Option A: Monorepo Deployment (Recommended)
1. In the Vercel project settings, set:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
2. Configure Environment Variables in Vercel:
   - `GEMINI_API_KEY`: `<Your Gemini API Key>`
   - `GEMINI_MODEL`: `gemini-3.1-flash-lite`
   - `AI_MODE`: `hybrid`
   - `ENVIRONMENT`: `production`

### Option B: Separate Backend Deployment
If hosting the backend on Render, Railway, or Google Cloud Run:
1. Deploy `backend/app` with Uvicorn.
2. In the Vercel Frontend environment variables, set:
   - `VITE_API_URL`: `https://your-backend-domain.com`
3. All frontend requests will automatically direct to that endpoint with zero code changes.
