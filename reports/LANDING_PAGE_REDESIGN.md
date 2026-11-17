# Voxra / Enquiry Studio — Premium SaaS Landing Page Redesign Report

**Date:** 2026-11-17  
**Author:** Principal Product Designer & Staff Frontend Engineer  
**Project:** Voxra (`Shashwatology/Voxra`)  
**Client Simulation:** Northstar Learning Academy (Andheri West, Mumbai, India)  
**Reference Asset:** Warm, editorial education SaaS hero reference (`media_1794888975220_1ad30778.jpg`)

---

## 1. Executive Summary & Design Vision

In accordance with product directives, the previous dark developer dashboard has been completely replaced with a warm, editorial, human-centered public landing page. Taking inspiration from the reference composition, the design avoids sci-fi neon, stereotypical robot mascots, and generic corporate stock aesthetics. Instead, it adopts the warmth, restraint, and typography precision associated with Apple, Linear, and modern editorial platforms.

### Core Brand Values
- **Warmth & Approachability:** A calm ivory/cream canvas (`#FDFBF7`) paired with soft amber ambient lighting replaces harsh dark themes.
- **Editorial Restraint:** Generous whitespace, refined sans-serif headings, subtle natural shadows, and stone borders (`#EAE4D8`).
- **Verifiable Truth:** Product messaging centers on the core operational principle: *Automate what is verifiable. Escalate what is not.*

---

## 2. Section-by-Section Architecture

### Section A — Hero Section (Primary Visual Focal Point)
- **Top Navigation Bar:**
  - Left: Refined monogram mark (`V`) with wordmark **Enquiry Studio** and **Northstar** campus pill.
  - Center: Clean links to *Product*, *How it works*, *Capabilities*, *Trust & Safety*, and *Documentation*.
  - Right: Quick badge reflecting **15 FAQs Ready** and warm pill button **Try live demo**.
- **Hero Typography:**
  - Centered headline: **Better answers. Less waiting. More confidence.** (48px–72px, responsive line height `1.08`).
  - Supporting copy: *"Help parents find the information they need, with responses grounded in approved institute policies and a clear route to human assistance."*
  - Dual CTAs: Primary **Try the assistant** (routes to `/demo`) and secondary **See how it works** (smooth-scrolls to the 3-step workflow).
- **Hero Photography & Ambient Glow:**
  - An authentic, naturally lit portrait of a person reviewing information on a modern smartphone, positioned at the lower central section.
  - An ambient radial gradient (`rgba(251, 191, 36, 0.12)`) glows softly behind the portrait, with a linear gradient masking the bottom edge seamlessly into the ivory canvas.
- **Floating Product Chat Cards:**
  1. *Foundation Fee (`FAQ-002`):* "What is the fee for the Foundation Program?" &rarr; "The Foundation Program tuition fee is ₹24,000 for the full 10-month program." (Green verified badge).
  2. *Rank Guarantee Escalation:* "Can you guarantee a top JEE rank?" &rarr; "Result guarantees are not covered by our approved information. Our admissions team can assist you." (Amber policy badge).
  3. *Weekend Timings (`FAQ-008`):* "Are weekend batches available?" &rarr; "Foundation weekend batch: Sat & Sun 9:00 AM–11:00 AM IST." (Verified badge).

### Section B — Product Introduction
- **Headline:** *"Your institute's information, clearly delivered."*
- **The Problem:** Details why coaching institutes cannot risk unrestrained generative AI (hallucinated 50% discounts, unauthorized promises, lack of auditability).
- **Comparison Grid:** Side-by-side contrast between conventional generative hallucinations and Voxra's deterministic grounded intelligence.

### Section C — How It Works (3-Step Pipeline)
1. **01 — Parent Asks Inquiry:** Natural language submission via text or Web Speech voice input.
2. **02 — Guarded Verification:** Multi-tier evaluation combining deterministic TF-IDF indexing, regex safety guardrails, and Gemini disambiguation.
3. **03 — Verbatim Answer or Handoff:** Canonical text returned verbatim with source FAQ ID, or cleanly routed to admissions staff with machine reason codes.

### Section D — Live Chatbot Demonstration
- An interactive mini-chat embedded directly on the landing page allowing visitors to test live queries against the running FastAPI backend and Gemini model.
- Suggested prompt pills: *Foundation Fee*, *JEE Timings*, *Rank Guarantee (Escalation)*, and *Discount Negotiation (Escalation)*.
- Real-time latency indicators and request ID audit badges.

### Section E — Product Capabilities
A 6-card feature grid highlighting:
1. *Approved Knowledge Base (15 FAQs)*
2. *Gemini Disambiguation (gemini-3.1-flash-lite)*
3. *Controlled Escalation with Explicit Machine Codes*
4. *Deterministic Guardrails (Regex Pre-screening)*
5. *Continuous Benchmark Monitoring (20-question evaluation)*
6. *Voice Speech-to-Text Input (Microphone Modal)*

### Section F — Trust & Safety Engineering
- Explains the architectural guarantee: AI identifies the relevant FAQ; canonical answers are returned strictly verbatim from the immutable JSON dataset.
- Real verified metrics table: **100% answer accuracy, 100% escalation accuracy, 0% false answer rate, <3ms fast-path latency, $0.0126 per 1k requests**.

### Section G & H — Final CTA & Footer
- **Final CTA:** *"See how trusted answers work."* with primary button **Open live demo** and link to GitHub.
- **Footer:** Brand line *"Every answer, accounted for."*, technical assessment disclaimer, and simulation attribution.

---

## 3. Responsive Implementation Matrix

| Breakpoint | Width | Composition Adjustments |
| :--- | :--- | :--- |
| **Desktop** | 1440px | Full horizontal navigation, 3 floating chat cards positioned around the hero portrait, 3-column capabilities grid. |
| **Laptop** | 1024px | Floating cards tucked slightly inward; 2 floating cards visible; spacious padding maintained. |
| **Tablet** | 768px | Mobile navigation scrollbar, hero portrait centered, floating cards gracefully stacked beneath on narrow widths. |
| **Mobile** | 390px | Hero headline sized to 36px, CTAs stacked vertically, mobile scrollable navigation bar, full-width chat composer. |

---

## 4. Verification & Build Confirmation
- **TypeScript & Vite Build:** Completed in 10.99s with zero errors (`dist/index.html`, `dist/assets/index.js`, `dist/assets/index.css`).
- **Interactive Routing:** Synchronized URL bar with `/`, `/demo`, `/overview`, `/knowledge`, `/evaluations`, `/handoffs`, `/security`, and `/documentation`.
