# Voxra (Enquiry Studio) — Product Design & UI/UX Specification

## 1. Design Direction: Reduction Until Everything Has a Purpose

Voxra rejects the recognizable cliches of artificial intelligence tools:
- No purple or blue neon ambient gradients
- No floating 3D spheres or isometric mockups
- No cartoon robot avatars or mascots
- No decorative "sparkles" or generic "Welcome to the Future" headlines
- No fake charts or manufactured live numbers

Instead, the product adopts the interface precision of **Linear** and the calm restraint of **Apple**, calibrated for an educational enterprise where clarity and trust supersede visual spectacle.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Palette Tokens
* **Canvas Light:** `#F8F9FB` (Warm, editorial off-white)
* **Surface Light:** `#FFFFFF` (Crisp white cards and modals)
* **Canvas Dark:** `#0D1117` (Deep slate charcoal)
* **Surface Dark:** `#161B22` (Elevated dark surfaces)
* **Accent Teal:** `#0D9488` (Light mode accent) / `#14B8A6` (Dark mode accent)
* **Accent Blue:** `#2563EB` (Information and benchmark references)
* **Border Light:** `#E2E8F0` (Subtle 1px boundaries)
* **Border Dark:** `#30363D` (Subtle dark dividers)
* **Status Colors:**
  - Success / Grounded: `#10B981` (Green)
  - Warning / Escalated: `#F59E0B` (Amber)
  - Danger / Rejection: `#EF4444` (Red)

### 2.2 Typography
* **Primary Sans-Serif:** Inter (`font-sans`), with system font fallbacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`).
* **Monospace Accent:** JetBrains Mono (`font-mono`) for identifiers (`FAQ-002`, `req-05bacae6006e`), latencies (`1.6ms`), and code snippets.
* **Scale:**
  - Page Titles: 20px / 24px (`text-xl font-bold tracking-tight`)
  - Section Headings: 14px / 16px (`text-sm font-semibold`)
  - Body Text: 14px (`text-sm leading-relaxed`)
  - Microcopy & Badges: 11px - 12px (`text-xs` / `text-[11px]`)

---

## 3. Customer Chat Experience ("Northstar Admissions")

The customer interface reflects a welcoming, professional admissions office:
* **Welcome State:** Clear, human microcopy setting expectations:
  *"Hello! Welcome to Northstar Learning Academy Admissions. I provide verified information regarding our Foundation and JEE programs, tuition fees, payment instalments, schedules, and scholarship policies. What would you like to know today?"*
* **Answer Bubbles:**
  - Right-aligned dark bubble for parent queries.
  - Left-aligned surface bubble for verified answers.
  - Attached verification footer showing green badge (`Approved Fact: FAQ-002`), latency (`1.8ms`), and copy action.
* **Escalation Bubbles:**
  - Amber border and background tint (`bg-amber-50/80 dark:bg-amber-950/20`).
  - Explicit reason pill (`AMBIGUOUS_QUERY`, `UNSUPPORTED_QUESTION`, etc.).
  - Direct guidance to contact the human admissions office at `admissions@northstar.example`.
* **Voice-to-Text Composer:**
  - Accessible microphone control opening a dedicated preview dialog.
  - Recording indicator with pulse feedback.
  - User can edit the transcribed text before submitting.
  - Graceful fallback for unsupported browsers.

---

## 4. Staff Operations Workspace

For coaching institute staff, the workspace provides six purpose-driven modules:
1. **Overview:** Actual operational traffic metrics, answer coverage percentage, mean/P95 latencies, topic breakdown, and recent query audit trail.
2. **Knowledge Base:** Data table displaying the 15 canonical FAQs with search, category filtering, and side inspection drawer.
3. **Review Queue (Handoffs):** Auditable list of escalated queries with status (`PENDING`, `REVIEWED`, `RESOLVED`, `DISMISSED`) and staff resolution notes.
4. **Evaluations:** Full 20-question benchmark runner results showing 100% accuracy, latency metrics, and raw JSON export.
5. **Security & Trust:** Trust boundary pipeline, threat matrix, and provider configuration status.
6. **Documentation:** System architecture guide and operational cost projections.
