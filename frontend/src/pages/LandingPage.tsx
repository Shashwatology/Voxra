import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  ChevronRight,
  Cpu,
  UserCheck,
  Mic,
  Database,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../services/api';
import { AskResponse } from '../types/api';
import { Hero3D } from '../components/Hero3D';

interface LandingPageProps {
  onNavigateDemo?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateDemo,
  onNavigateTab
}) => {
  // Live mini-demo state on landing page
  const [heroQuery, setHeroQuery] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResponse, setDemoResponse] = useState<AskResponse | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [selectedDemoTab, setSelectedDemoTab] = useState<'grounded' | 'escalated'>('grounded');
  const [heroMode, setHeroMode] = useState<'portrait' | 'core3d'>('portrait');

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
    <div className="min-h-screen bg-[#F8F7F4] text-[#171C24] selection:bg-[#C1A37A]/20 selection:text-[#171C24]">
      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION A — EDITORIAL 3D HERO
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#C1A37A]/12 via-[#DCE5DD]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Subtle Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/90 text-stone-700 text-xs font-medium mb-6 shadow-2xs backdrop-blur-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C1A37A]" />
            <span>Trusted AI Enquiry Intelligence · Northstar Learning Academy</span>
          </motion.div>

          {/* Centered Large Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#171C24] max-w-4xl mx-auto leading-[1.08] mb-6 font-sans"
          >
            Better answers. Less waiting.{' '}
            <span className="text-[#C1A37A]">More confidence.</span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal"
          >
            Help parents find the information they need, with responses grounded in approved
            institute policies and a clear route to human assistance.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
          >
            <button
              onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#171C24] hover:bg-stone-800 text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-2xs hover:border-stone-400 transition-all"
            >
              <span>Explore Architecture</span>
            </a>
          </motion.div>

          {/* Hero Quick Inquiry Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-xl mx-auto mb-10 sm:mb-14"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (heroQuery.trim()) {
                  if (onNavigateDemo) onNavigateDemo();
                  else window.location.href = '/demo';
                }
              }}
              className="relative flex items-center bg-white border border-stone-300/90 rounded-full p-1.5 shadow-warm focus-within:ring-2 focus-within:ring-[#C1A37A]/30 focus-within:border-stone-400 transition-all"
            >
              <input
                type="text"
                placeholder="Ask about tuition fees, JEE timings, scholarships, refund..."
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                className="flex-1 bg-transparent px-5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                onClick={() => {
                  if (onNavigateDemo) onNavigateDemo();
                  else window.location.href = '/demo';
                }}
                className="inline-flex items-center space-x-1.5 bg-[#C1A37A] hover:bg-[#B39366] text-[#171C24] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <span>Ask Voxra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompt Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-stone-500">
              <span className="text-[11px] font-medium text-stone-400">Popular:</span>
              <button
                onClick={() => {
                  setHeroQuery("What is the JEE Preparation Program tuition fee?");
                  handleRunDemo("What is the JEE Preparation Program tuition fee?");
                }}
                className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-2.5 py-0.5 rounded-full transition-colors shadow-2xs hover:border-[#C1A37A]"
              >
                JEE Fee: ₹60,000
              </button>
              <button
                onClick={() => {
                  setHeroQuery("What is the Foundation Program tuition fee?");
                  handleRunDemo("What is the Foundation Program tuition fee?");
                }}
                className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-2.5 py-0.5 rounded-full transition-colors shadow-2xs hover:border-[#C1A37A]"
              >
                Foundation Fee: ₹24,000
              </button>
              <button
                onClick={() => {
                  setHeroQuery("When are JEE classes scheduled during the week?");
                  handleRunDemo("When are JEE classes scheduled during the week?");
                }}
                className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-2.5 py-0.5 rounded-full transition-colors shadow-2xs hover:border-[#C1A37A]"
              >
                JEE Timings
              </button>
              <button
                onClick={() => {
                  setHeroQuery("Does the institute offer scholarships?");
                  handleRunDemo("Does the institute offer scholarships?");
                }}
                className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-2.5 py-0.5 rounded-full transition-colors shadow-2xs hover:border-[#C1A37A]"
              >
                20% Scholarship
              </button>
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────────────────
              HERO SHOWCASE: EDITORIAL HUMAN PORTRAIT & 3D VERIFICATION CORE
          ───────────────────────────────────────────────────────────────────────── */}
          <div className="relative max-w-4xl mx-auto mt-6 sm:mt-10">
            {/* View Switcher Pill */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center bg-white/90 border border-stone-200/90 rounded-full p-1 shadow-2xs backdrop-blur-xs text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setHeroMode('portrait')}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    heroMode === 'portrait'
                      ? 'bg-[#171C24] text-white shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Parent Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('core3d')}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    heroMode === 'core3d'
                      ? 'bg-[#171C24] text-white shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C1A37A]" />
                  <span>3D Verification Core</span>
                </button>
              </div>
            </div>

            {heroMode === 'portrait' ? (
              /* Editorial Human Photography Showcase (Inspired by reference) */
              <div className="relative mx-auto flex items-center justify-center min-h-[380px] sm:min-h-[460px] pb-4">
                {/* Subtle Ambient Radial Glow behind subject */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#C1A37A]/15 via-[#DCE5DD]/20 to-transparent blur-3xl rounded-full transform scale-90 pointer-events-none" />

                {/* Central Human Subject with soft gradient fade into ivory background */}
                <div className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] mx-auto overflow-hidden">
                  <img
                    src="/hero-person.jpg"
                    alt="Parent researching educational admissions with Voxra"
                    className="w-full h-auto object-cover object-top rounded-3xl [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] shadow-warm"
                    loading="eager"
                  />
                </div>

                {/* Floating Chat Bubble 1 (Left - Grounded Answer) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="hidden md:flex absolute top-12 -left-2 lg:-left-10 z-20 max-w-[280px] text-left items-start space-x-2.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-lg border border-stone-200/90 transform -rotate-1 hover:rotate-0 transition-transform"
                >
                  <div className="w-7 h-7 rounded-full bg-[#171C24] text-[#C1A37A] flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold text-xs">
                    V
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 flex items-center space-x-1 mb-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline mr-1" />
                      Approved · FAQ-002
                    </p>
                    <p className="text-xs text-stone-700 leading-snug">
                      "The Foundation Program tuition fee is <span className="font-semibold text-stone-900">₹24,000</span> for the full 10-month program."
                    </p>
                  </div>
                </motion.div>

                {/* Floating Chat Bubble 2 (Right Upper - Parent Question) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="hidden md:flex absolute top-8 -right-2 lg:-right-10 z-20 max-w-[260px] text-left items-start space-x-2.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-lg border border-stone-200/90 transform rotate-1 hover:rotate-0 transition-transform"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-semibold text-xs">
                    P
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium tracking-wider text-stone-400 mb-0.5">
                      Parent Inquiry
                    </p>
                    <p className="text-xs font-medium text-stone-800 leading-snug">
                      Can you guarantee a top JEE rank?
                    </p>
                  </div>
                </motion.div>

                {/* Floating Chat Bubble 3 (Right Lower - Guarded Escalation) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="hidden md:flex absolute bottom-8 -right-4 lg:-right-6 z-20 max-w-[290px] text-left items-start space-x-2.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-lg border border-stone-200/90 transform -rotate-1 hover:rotate-0 transition-transform"
                >
                  <div className="w-7 h-7 rounded-full bg-[#171C24] text-amber-400 flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold text-xs">
                    V
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700 flex items-center space-x-1 mb-0.5">
                      <AlertCircle className="w-3 h-3 text-amber-600 inline mr-1" />
                      Escalated to Staff
                    </p>
                    <p className="text-xs text-stone-700 leading-snug">
                      "Result guarantees are not covered by our approved policy. Our admissions counselors will assist you."
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Interactive 3D Dimensional Verification Element */
              <div className="relative z-10 mx-auto">
                <Hero3D />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION B — PRODUCT PREVIEW & WORKSPACE SHOWCASE
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="product" className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              Product Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-4 font-sans">
              Your institute's verified information, perfectly delivered.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Experience an intelligent admissions assistant that never invents fee discounts,
              never hallucinates unapproved dates, and escalates complex requests to human staff with full context.
            </p>
          </div>

          {/* Interactive Assistant Preview Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#F8F7F4] border border-stone-200/90 shadow-warm p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs font-mono text-stone-500 font-medium">Northstar Admissions Assistant · Live Studio Preview</span>
              </div>
              <div className="flex items-center space-x-1 bg-stone-200/60 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setSelectedDemoTab('grounded')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedDemoTab === 'grounded' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Grounded Answer
                </button>
                <button
                  onClick={() => setSelectedDemoTab('escalated')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedDemoTab === 'escalated' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Counselor Escalation
                </button>
              </div>
            </div>

            {/* Tab 1: Grounded Answer Demonstration */}
            {selectedDemoTab === 'grounded' && (
              <div className="space-y-4 py-2">
                <div className="flex justify-end">
                  <div className="bg-[#171C24] text-white px-4 py-2.5 rounded-2xl rounded-br-xs text-xs sm:text-sm max-w-md shadow-xs">
                    What is the Foundation Program tuition fee?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200/90 p-4 rounded-2xl rounded-bl-xs text-xs sm:text-sm max-w-lg shadow-xs space-y-2.5">
                    <p className="text-stone-800 leading-relaxed">
                      The Foundation Program tuition fee is ₹24,000 for the full 10-month program. Study material and scheduled mock tests are included.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved Policy Grounded:</span>
                        <span className="font-mono bg-emerald-50 text-emerald-900 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-200/60">
                          FAQ-002
                        </span>
                      </div>
                      <span className="font-mono text-stone-400 text-[11px]">1.2ms · Fast-Path</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Controlled Escalation Demonstration */}
            {selectedDemoTab === 'escalated' && (
              <div className="space-y-4 py-2">
                <div className="flex justify-end">
                  <div className="bg-[#171C24] text-white px-4 py-2.5 rounded-2xl rounded-br-xs text-xs sm:text-sm max-w-md shadow-xs">
                    Can you give me a 50% discount if I pay full JEE fee in cash today?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-amber-50/70 border border-amber-200/90 p-4 rounded-2xl rounded-bl-xs text-xs sm:text-sm max-w-lg shadow-xs space-y-2.5">
                    <p className="text-stone-900 leading-relaxed">
                      Northstar provides scholarships up to 20% subject to assessment. Unauthorized fee waivers cannot be granted by the automated assistant.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs">
                      <div className="flex items-center space-x-1.5 text-amber-900 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Counselor Handoff:</span>
                        <span className="font-mono bg-amber-100/80 text-amber-950 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-amber-300">
                          UNAUTHORIZED_DISCOUNT
                        </span>
                      </div>
                      <span className="font-mono text-stone-400 text-[11px]">0.3ms · Guardrail Tripped</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="mt-4 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
              <span>Grounded in immutable Northstar Academy knowledge base</span>
              <button
                onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
                className="font-medium text-[#C1A37A] hover:text-[#B39366] inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Launch Interactive Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION C — THE PROBLEM AND SOLUTION CONTRAST
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-stone-200/70 bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              The Operational Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-4 font-sans">
              Why conventional generative chatbots fail institutes
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              When an unrestricted LLM talks with prospective parents, it attempts to answer everything.
              In high-stakes admissions, hallucinated discounts or examination promises create severe legal liabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Risk */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs text-left">
              <div className="flex items-center space-x-2 text-rose-700 font-semibold text-xs mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>The Conventional Chatbot Risk</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Invented Fees & Unauthorized Promises
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Generative chatbots aim to please. Under user bargaining, they hallucinate fee waivers,
                guarantee top examination ranks, or misstate strict 7-day refund rules.
              </p>
              <div className="space-y-2 text-xs text-stone-500 pt-3 border-t border-stone-100">
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>Unverifiable probabilistic text synthesis</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>Silent negotiation of non-existent discounts</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <span>✕</span>
                  <span>No audit trail or counselor escalation trigger</span>
                </div>
              </div>
            </div>

            {/* The Solution */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C1A37A]/50 shadow-warm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C1A37A]/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-center space-x-2 text-[#C1A37A] font-semibold text-xs mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>The Voxra Guarded Alternative</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Automate Verifiable. Escalate the Rest.
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Voxra uses AI strictly for index matching and intent disambiguation. Customer answers are loaded
                verbatim from approved policy. Anything unverified safely handsoff to staff.
              </p>
              <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verbatim canonical FAQ strings</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deterministic guardrails for discounts & guarantees</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audited staff handoff queue with machine reason codes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION D — HOW IT WORKS: 3-STAGE PIPELINE
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              Predictable Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-4 font-sans">
              How trusted enquiry intelligence works
            </h2>
            <p className="text-stone-600 text-base">
              Every inquiry passes through three deterministic verification gates before any response is rendered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#F8F7F4] p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-white text-[#171C24] font-bold text-sm flex items-center justify-center mb-5 border border-stone-200 shadow-2xs font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Parent Submits Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Parents ask questions in natural English or Hinglish via text or Web Speech voice input.
                Input is validated and sanitized against prompt injections.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8F7F4] p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-white text-[#171C24] font-bold text-sm flex items-center justify-center mb-5 border border-stone-200 shadow-2xs font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Guarded Verification Pipeline
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Matches query against the 15 canonical FAQs via TF-IDF indexing. High confidence (≥0.72) resolves in &lt;3ms;
                ambiguous queries trigger Gemini structured disambiguation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8F7F4] p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-white text-[#171C24] font-bold text-sm flex items-center justify-center mb-5 border border-stone-200 shadow-2xs font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Verbatim Answer or Handoff
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                If grounded, canonical answer text is loaded verbatim with exact FAQ ID and telemetry.
                If out-of-scope, inquiry safely handsoff with reason codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION E — LIVE INTERACTIVE SANDBOX
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-stone-200/70 bg-[#F8F7F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              Live Interactive Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-3 font-sans">
              Test real queries in real time
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Submit your inquiry below or tap a pre-loaded question to test live FastAPI `/ask` verification.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-warm text-left">
            {/* Pre-loaded Prompt Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunDemo(p.query)}
                  disabled={demoLoading}
                  className="text-xs bg-[#F8F7F4] hover:bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full border border-stone-200/90 transition-colors shadow-2xs text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Ask about tuition fees, JEE timings, scholarships, refund..."
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunDemo()}
                disabled={demoLoading}
                className="flex-1 bg-[#F8F7F4] border border-stone-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C1A37A]/30"
              />
              <button
                onClick={() => handleRunDemo()}
                disabled={demoLoading || !demoInput.trim()}
                className="bg-[#171C24] hover:bg-stone-800 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>

            {/* Live Output Card */}
            {demoResponse && (
              <div className="mt-4 p-4 rounded-2xl bg-[#F8F7F4] border border-stone-200 animate-fade-in text-xs sm:text-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {demoResponse.status === 'answered' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved Policy Grounded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Counselor Handoff</span>
                      </span>
                    )}
                    {demoResponse.faq_id && (
                      <span className="font-mono text-xs font-bold text-stone-700 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        {demoResponse.faq_id}
                      </span>
                    )}
                    {demoResponse.reason && (
                      <span className="font-mono text-xs font-semibold text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-300">
                        {demoResponse.reason}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-stone-400">
                    {demoResponse.latency_ms}ms
                  </span>
                </div>
                <p className="text-stone-800 leading-relaxed">
                  {demoResponse.answer || demoResponse.message}
                </p>
              </div>
            )}

            {demoError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{demoError}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION F — CAPABILITIES GRID
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-stone-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-4 font-sans">
              Engineered for absolute accuracy
            </h2>
            <p className="text-stone-600 text-base">
              Six production pillars that safeguard coaching institutes from AI liability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Approved Knowledge Base */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Approved Knowledge Base</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                15 immutable canonical FAQs governing program offerings, fees, instalments, batch capacity, and refund policies.
              </p>
            </div>

            {/* 2. Gemini Candidate Disambiguation */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Gemini 3.1 Flash Lite</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Constrained structured output for semantic disambiguation between close candidates with zero generative text generation.
              </p>
            </div>

            {/* 3. Counselor Escalation */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Human Counselor Handoff</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Controlled abstention with calibrated reason codes, routing sensitive queries to human admissions staff.
              </p>
            </div>

            {/* 4. Empirical Evaluation */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">100% Benchmark Accuracy</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                20-question fixed evaluation suite with 10 answerable and 10 escalation test cases passing 100% with 0% false answer rate.
              </p>
            </div>

            {/* 5. Multilingual Hinglish */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Hinglish Query Processing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Lexical normalization for colloquial Indian English and Hindi terms ("fees kitni hai" → tuition cost).
              </p>
            </div>

            {/* 6. Voice Input */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-stone-200/80 text-left">
              <div className="w-8 h-8 rounded-lg bg-white text-[#C1A37A] flex items-center justify-center mb-4 border border-stone-200 shadow-2xs">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Web Speech Voice Input</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                In-browser microphone dictation with live transcript review before dispatching to guarded verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION G — TRUST & EVALUATION BENCHMARK
      ───────────────────────────────────────────────────────────────────────────── */}
      <section id="trust" className="py-20 border-t border-stone-200/70 bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
              Verifiable Quality Metrics
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171C24] mt-2 mb-4 font-sans">
              Accountability in numbers
            </h2>
            <p className="text-stone-600 text-base">
              Every metric below is backed directly by reproducible evaluation runs on our fixed 20-question suite.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 text-center shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#171C24] font-mono">100%</span>
              <p className="text-xs text-stone-500 font-medium mt-1">Overall Accuracy (20/20)</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 text-center shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#171C24] font-mono">0.0%</span>
              <p className="text-xs text-stone-500 font-medium mt-1">False Answer Rate</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 text-center shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#171C24] font-mono">&lt;3ms</span>
              <p className="text-xs text-stone-500 font-medium mt-1">Fast-Path Latency</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 text-center shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#171C24] font-mono">31</span>
              <p className="text-xs text-stone-500 font-medium mt-1">Pytest Suites Passed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION H — FINAL HIGH-IMPACT CTA & FOOTER
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-stone-200/70 bg-[#171C24] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-bold text-[#C1A37A] tracking-wider uppercase font-mono">
            Ready to experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-3 mb-5 font-sans">
            Every answer, accounted for.
          </h2>
          <p className="text-stone-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Protect your coaching institute from AI hallucinations and provide verified answers to parents instantly.
          </p>
          <button
            onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
            className="inline-flex items-center space-x-2 bg-[#C1A37A] hover:bg-[#B39366] text-[#171C24] font-semibold text-sm sm:text-base px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer"
          >
            <span>Launch Northstar Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-12 bg-[#171C24] border-t border-stone-800 text-stone-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800/80">
            <div>
              <div className="flex items-center space-x-2 font-mono text-sm font-semibold text-white mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C1A37A]" />
                <span>voxra.</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Guarded admissions intelligence platform simulating Northstar Learning Academy.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-xs uppercase tracking-wider font-mono">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigateDemo ? onNavigateDemo() : (window.location.href = '/demo')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Launch Assistant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('overview') : (window.location.href = '/overview')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Live Workspace
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('knowledge') : (window.location.href = '/knowledge')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    15 Approved FAQs
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-xs uppercase tracking-wider font-mono">Governance</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('evaluations') : (window.location.href = '/evaluations')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Benchmark Evaluations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('handoffs') : (window.location.href = '/handoffs')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Review Queue
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('security') : (window.location.href = '/security')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Security & Guardrails
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-xs uppercase tracking-wider font-mono">Reference</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('docs') : (window.location.href = '/docs')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/Shashwatology/Voxra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <span className="text-emerald-400 font-mono text-[11px] block mt-1">● 100% Benchmark Verified</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              <span>© {new Date().getFullYear()} Voxra Admissions AI · Fictional Coaching Simulation</span>
            </div>
            <div>
              Technical assessment for AI Development Intern opportunity at StarvoxLabs.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
