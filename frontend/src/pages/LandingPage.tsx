import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Send,
  Loader2,
  FileText,
  ExternalLink,
  ChevronRight,
  Lock,
  Layers,
  Cpu,
  UserCheck,
  Mic
} from 'lucide-react';
import { apiClient } from '../services/api';
import { AskResponse } from '../types/api';

interface LandingPageProps {
  onNavigateDemo?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateDemo,
  onNavigateTab
}) => {
  // Live mini-demo state on landing page
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResponse, setDemoResponse] = useState<AskResponse | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  const samplePrompts = [
    { label: 'Foundation Fee', query: 'What is the fee for the Foundation Program?' },
    { label: 'JEE Timings', query: 'When are JEE classes scheduled during the week?' },
    { label: 'Rank Guarantee (Escalation)', query: 'Can you guarantee a top 100 JEE rank?' },
    { label: 'Discount Negotiation (Escalation)', query: 'Can you give me a 50% discount on tuition fees?' }
  ];

  const handleRunDemo = async (queryToRun?: string) => {
    const q = (queryToRun !== undefined ? queryToRun : demoInput).trim();
    if (!q) return;
    if (queryToRun !== undefined) setDemoInput(queryToRun);
    setDemoLoading(true);
    setDemoError(null);
    setDemoResponse(null);

    try {
      const res = await apiClient.askQuestion(q);
      setDemoResponse(res);
    } catch (err: any) {
      setDemoError(err.message || 'Could not connect to the admissions service.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION A — HERO SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden bg-warm-radial">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-medium mb-6 animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Guarded AI Intelligence · Zero Hallucinated Fees</span>
          </div>

          {/* Centered Large Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.08] mb-6 font-sans">
            Better answers. Less waiting. More confidence.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
            Help parents find the information they need, with responses grounded in approved
            institute policies and a clear route to human assistance.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 sm:mb-20">
            <button
              onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Try the assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300/80 font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-sm hover:border-stone-400 transition-all"
            >
              <span>See how it works</span>
            </a>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────────
              HERO PHOTOGRAPHY & FLOATING CONVERSATION CARDS
          ───────────────────────────────────────────────────────────────────────── */}
          <div className="relative max-w-4xl mx-auto mt-4">
            {/* Ambient Golden Glow Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-200/40 via-amber-100/20 to-transparent blur-3xl rounded-full transform -translate-y-8" />

            {/* Central Photographic Subject */}
            <div className="relative z-10 mx-auto w-72 sm:w-96 md:w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Parent reviewing admissions enquiry on smartphone"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              {/* Soft Bottom Gradient Fade into Canvas */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent opacity-80" />
            </div>

            {/* FLOATING CARD 1: Grounded Approved Answer (Top Left) */}
            <div className="hidden sm:block absolute -top-4 -left-6 md:-left-12 z-20 max-w-xs text-left bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-warm-lg border border-stone-200/90 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-semibold">
                  P
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  What is the fee for the Foundation Program?
                </p>
              </div>
              <div className="pl-8 border-l-2 border-emerald-500/60 ml-3 py-0.5 space-y-1">
                <p className="text-xs text-stone-600 leading-snug">
                  "The Foundation Program tuition fee is ₹24,000 for the full 10-month program."
                </p>
                <div className="flex items-center space-x-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Approved · FAQ-002
                  </span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Controlled Policy Escalation (Top Right) */}
            <div className="hidden sm:block absolute -top-8 -right-6 md:-right-12 z-20 max-w-xs text-left bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-warm-lg border border-stone-200/90 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-semibold">
                  P
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  Can you guarantee a top JEE rank?
                </p>
              </div>
              <div className="pl-8 border-l-2 border-amber-500/60 ml-3 py-0.5 space-y-1">
                <p className="text-xs text-stone-600 leading-snug">
                  "Result guarantees are not covered by our approved information. Our admissions team can assist you."
                </p>
                <div className="flex items-center space-x-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                    Escalated · Safety Guardrail
                  </span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 3: Schedule Verification (Bottom Right) */}
            <div className="hidden md:block absolute bottom-8 -right-8 z-20 max-w-xs text-left bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-warm-lg border border-stone-200/90 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[10px] font-semibold">
                  P
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  Are weekend batches available?
                </p>
              </div>
              <div className="pl-7 border-l-2 border-emerald-500/60 ml-2.5 py-0.5 space-y-1">
                <p className="text-xs text-stone-600 leading-snug">
                  "Foundation weekend batch: Sat & Sun 9:00 AM–11:00 AM IST."
                </p>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Verified · FAQ-008
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION B — PRODUCT INTRODUCTION
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="product" className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              The Coaching Institute Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2 mb-4">
              Your institute's information, clearly delivered.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Coaching institutes receive hundreds of repetitive parent inquiries regarding fees,
              schedules, batch sizes, and scholarships. Manual handling is slow and repetitive, while
              unrestrained generative AI creates financial and legal risks by hallucinating discounts or promising ranks.
            </p>
          </div>

          {/* Comparison Cards: Unsafe GenAI vs Voxra Guarded Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Risk: Conventional Generative Chat */}
            <div className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/90 text-left">
              <div className="flex items-center space-x-2 text-rose-700 font-semibold text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>The Conventional Chatbot Risk</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Invented Fees & Unauthorized Promises
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Standard LLMs attempt to answer everything. When a parent negotiates or asks about scholarships,
                the model often invents unauthorized 50% discounts, promises top 100 ranks, or provides outdated timetables.
              </p>
              <div className="space-y-2 text-xs text-stone-500 pt-2 border-t border-stone-200">
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>Unverifiable generative text generation</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>Silent hallucination of fee concessions</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>Zero audit trail or human escalation policy</span>
                </div>
              </div>
            </div>

            {/* The Solution: Voxra Guarded Intelligence */}
            <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-bl-full pointer-events-none" />
              <div className="flex items-center space-x-2 text-amber-800 font-semibold text-sm mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Voxra Architecture</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Automate Verifiable. Escalate the Rest.
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Voxra uses AI strictly to index and identify approved FAQs. Customer-facing answers are returned
                verbatim from the official knowledge base. Anything ambiguous or unapproved is cleanly escalated to human staff.
              </p>
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-amber-200">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verbatim approved FAQ strings</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deterministic guardrails for discounts & guarantees</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audited human handoff queue with machine reason codes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION C — HOW IT WORKS
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 border-t border-stone-200/70 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Predictable Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2 mb-4">
              How trusted enquiry intelligence works
            </h2>
            <p className="text-stone-600 text-base">
              Every query passes through a multi-stage verification pipeline before any answer is returned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-warm text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Parent Asks Inquiry
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Parents or students submit natural language queries via text or Web Speech voice input.
                Input is validated and sanitized against prompt injections.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-warm text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Guarded Verification
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Queries are matched against the 15 canonical FAQs using deterministic TF-IDF indexing and
                Gemini candidate selection. Guardrails screen for unauthorized fee waivers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-warm text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Verbatim Answer or Handoff
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                If grounded, the exact approved canonical text is returned with FAQ ID and latency metrics.
                If ambiguous or unsupported, it escalates to admissions staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION D — LIVE INTERACTIVE CHATBOT DEMONSTRATION
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Interactive Test Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2 mb-3">
              Try the live admissions assistant
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Test real queries directly against the live FastAPI backend and Gemini-powered routing.
            </p>
          </div>

          {/* Interactive Playground Box */}
          <div className="bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 text-left shadow-warm-lg">
            {/* Quick Suggestion Chips */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-500 mb-2">Try a sample query:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunDemo(p.query)}
                    className="text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/90 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Composer */}
            <div className="relative mb-6">
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunDemo()}
                placeholder="Ask about fees, timings, scholarships, batches, or refund policy..."
                className="w-full bg-white border border-stone-300 rounded-2xl px-4 py-3.5 pr-24 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
              <button
                onClick={() => handleRunDemo()}
                disabled={demoLoading || !demoInput.trim()}
                className="absolute right-2 top-2 bottom-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium px-4 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {demoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Ask</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {/* Live Response Panel */}
            {demoResponse && (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    {demoResponse.status === 'answered' ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Approved Answer · {demoResponse.faq_id}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Escalated to Staff ({demoResponse.reason})</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-stone-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{demoResponse.latency_ms} ms</span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      {demoResponse.request_id}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-800 leading-relaxed font-normal">
                  {demoResponse.status === 'answered'
                    ? demoResponse.answer
                    : demoResponse.message || "I couldn't verify that from our approved information. The admissions team can assist you."}
                </p>
              </div>
            )}

            {/* Error Message */}
            {demoError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                <span>{demoError}</span>
                <button
                  onClick={() => handleRunDemo()}
                  className="font-semibold underline ml-2 hover:text-rose-900 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Link to Full Experience */}
            <div className="mt-5 text-center">
              <button
                onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
              >
                <span>Launch full conversational studio with voice input</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION E — PRODUCT CAPABILITIES
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-20 border-t border-stone-200/70 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Production Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2 mb-4">
              Engineered for absolute accuracy
            </h2>
            <p className="text-stone-600 text-base">
              Designed from ground up to reduce admissions operational risk while maintaining rapid response times.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">Approved Knowledge Base</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Exactly 15 canonical FAQs covering tuition fees, schedules, capacity, scholarships, and refund policies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">Gemini Disambiguation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Uses official Gemini 3.1 Flash Lite strictly to classify and match user inquiries to candidate FAQ IDs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">Controlled Escalation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clean routing to admissions staff with explicit machine reason codes when queries fall outside approved facts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">Deterministic Guardrails</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upfront regex patterns block unauthorized discounts, rank guarantees, prompt injection, and off-topic questions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">20-Question Benchmark</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fixed 20-question evaluation set achieving 100% answer accuracy, 100% escalation accuracy, and 0% false answers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-warm text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">Voice Speech Input</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Integrated Web Speech API speech-to-text with transcript preview and review before query execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION F — TRUST & ENGINEERING
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="trust" className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Architecture & Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2 mb-4">
              Zero generative modification guarantee
            </h2>
            <p className="text-stone-600 text-base">
              The AI selects which approved FAQ entry applies. The exact canonical text is served directly from source code.
            </p>
          </div>

          {/* Architecture comparison box */}
          <div className="max-w-4xl mx-auto bg-[#FAF8F5] border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-warm text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  Why Northstar uses approved knowledge grounding
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  In education admissions, answering incorrectly is much worse than not answering at all.
                  If an AI grants a 50% discount or promises a rank, parents feel entitled to that promise.
                </p>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Voxra treats a properly escalated question as a <strong>successful safety outcome</strong>.
                  All operations are logged with machine-readable request IDs and full audit metadata.
                </p>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('docs') : (window.location.href = '/docs')}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-900 hover:text-amber-800 underline underline-offset-4 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Read full technical architecture notebook</span>
                </button>
              </div>

              {/* Verified Metrics Snapshot */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-xs font-semibold text-stone-700">Benchmark Metric</span>
                  <span className="text-xs font-bold text-stone-900">Verified Result</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Answer Accuracy (10/10)</span>
                  <span className="font-semibold text-emerald-700">100.0%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Escalation Accuracy (10/10)</span>
                  <span className="font-semibold text-emerald-700">100.0%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">False Answer Rate</span>
                  <span className="font-semibold text-emerald-700">0.0%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Deterministic Fast-Path Latency</span>
                  <span className="font-semibold text-stone-900">&lt; 3.0 ms</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Cost per 1k Requests (Hybrid)</span>
                  <span className="font-semibold text-amber-700">$0.0126</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION G — FINAL CTA
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-stone-200/70 bg-gradient-to-b from-[#FDFBF7] to-[#FAF5EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
            See how trusted answers work.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Experience the guarded enquiry intelligence studio built for Northstar Learning Academy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Open live demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/Shashwatology/Voxra"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-sm transition-all"
            >
              <span>View GitHub repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION H — FOOTER
      ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 py-10 bg-white text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-[10px]">
              V
            </div>
            <span className="font-semibold text-stone-800">Voxra · Enquiry Studio</span>
            <span className="text-stone-300">|</span>
            <span>Every answer, accounted for.</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[11px] text-stone-400">
              Technical Assessment for AI Development Intern · StarvoxLabs Evaluation Simulation
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Fictional Campus: Northstar Learning Academy · Andheri West, Mumbai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
