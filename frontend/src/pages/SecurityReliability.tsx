import React from 'react';
import {
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  Server
} from 'lucide-react';
import { HealthResponse } from '../types/api';

interface SecurityReliabilityProps {
  health: HealthResponse | null;
}

export const SecurityReliability: React.FC<SecurityReliabilityProps> = ({ health }) => {
  const securityControls = [
    {
      threat: "Prompt Injection & Directive Override",
      surface: "User Enquiry Text",
      control: "Deterministic Regex Screening + Pydantic v2 String Length Limits (500 chars)",
      verification: "Adversarial Test Suite (ADV-001 to ADV-015)",
      status: "Verified (100% Blocked)"
    },
    {
      threat: "Generative Fee Hallucination",
      surface: "LLM Completion Generation",
      control: "Zero Generative Answer Text; Answers Loaded Strictly from Immutable JSON File",
      verification: "Unit & Integration Test Assertions",
      status: "Architecturally Enforced"
    },
    {
      threat: "Secret & API Key Leaks",
      surface: "Chat Playground & System Prompts",
      control: "Safe JSON Logger with Secret Scrubbing + Server-side Environment Isolation",
      verification: "Logging Privacy Unit Tests",
      status: "Verified (Scrubbed)"
    },
    {
      threat: "Denial of Service / Query Flooding",
      surface: "Public API /ask Endpoint",
      control: "Sliding-Window Rate Limiting (60 requests/minute per client IP)",
      verification: "RateLimitMiddleware Integration Tests",
      status: "Active (60 req/min)"
    },
    {
      threat: "Exam Rank & Result Guarantees",
      surface: "Parent Expectation Manipulation",
      control: "Domain Guardrail Escalation (EscalationReason.UNSUPPORTED_GUARANTEE)",
      verification: "Benchmark EVAL-013 & ADV-005",
      status: "Verified Escalated"
    },
    {
      threat: "Unauthorized Fee Waivers / Discounts",
      surface: "Admissions Fee Inquiries",
      control: "Discount Guardrail (EscalationReason.UNAUTHORIZED_DISCOUNT)",
      verification: "Benchmark EVAL-012 & ADV-002",
      status: "Verified Escalated"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Security Architecture & System Trust
          </h1>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
            Trust Boundary Enforced in Code
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Rigorous guardrails, offline fallback safety, strict Pydantic contracts, and immutable canonical answers.
        </p>
      </div>

      {/* Provider & Runtime Architecture Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active AI Mode */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>AI Operating Mode</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white uppercase">
              {health?.ai_mode || 'LOCAL_ONLY'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {health?.ai_mode === 'hybrid'
              ? 'Gemini 2.5 Flash utilized strictly for intent classification & disambiguation.'
              : 'Deterministic scikit-learn TF-IDF running locally without external cloud dependencies.'}
          </p>
        </div>

        {/* Gemini Provider Health */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>Gemini Provider Status</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {health?.gemini_configured ? 'CONNECTED' : 'STANDBY (OFFLINE MODE)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {health?.gemini_configured
              ? `Official Google Gen AI SDK initialized with model ${health.model_name}.`
              : 'Service operates safely and deterministically without external credentials.'}
          </p>
        </div>

        {/* Knowledge Base Invariant */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Knowledge Base Invariant</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              IMMUTABLE JSON
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              15 FAQs
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Loaded at boot from data/approved_faq.json. Chat messages cannot mutate or extend the knowledge base.
          </p>
        </div>
      </div>

      {/* Decision Pipeline Diagram */}
      <div className="p-6 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Architectural Trust Boundary & Decision Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark space-y-1">
            <span className="font-mono text-[10px] text-red-500 uppercase font-semibold">1. Untrusted Input</span>
            <div className="font-medium text-slate-800 dark:text-slate-200">Parent / Student Query</div>
            <p className="text-[11px] text-slate-400">Strict Pydantic v2 length & alphanumeric screening.</p>
          </div>

          <div className="p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark space-y-1">
            <span className="font-mono text-[10px] text-amber-500 uppercase font-semibold">2. Upfront Guardrails</span>
            <div className="font-medium text-slate-800 dark:text-slate-200">Regex & Threat Filters</div>
            <p className="text-[11px] text-slate-400">Rejects prompt injection, rank guarantees, & unapproved discounts.</p>
          </div>

          <div className="p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark space-y-1">
            <span className="font-mono text-[10px] text-teal-500 uppercase font-semibold">3. Deterministic TF-IDF</span>
            <div className="font-medium text-slate-800 dark:text-slate-200">Candidate Retrieval</div>
            <p className="text-[11px] text-slate-400">Multi-ngram cosine similarity + ambiguity margin checks.</p>
          </div>

          <div className="p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark space-y-1">
            <span className="font-mono text-[10px] text-blue-500 uppercase font-semibold">4. Disambiguation</span>
            <div className="font-medium text-slate-800 dark:text-slate-200">Gemini Structured Selector</div>
            <p className="text-[11px] text-slate-400">Chooses strictly from top 3 candidate FAQ IDs or escalates.</p>
          </div>

          <div className="p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark space-y-1">
            <span className="font-mono text-[10px] text-emerald-500 uppercase font-semibold">5. Canonical Output</span>
            <div className="font-medium text-slate-800 dark:text-slate-200">Immutable JSON Fact</div>
            <p className="text-[11px] text-slate-400">Zero model text generation. Verified answer delivered verbatim.</p>
          </div>
        </div>
      </div>

      {/* Threat Model Verification Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Threat Model & Verification Matrix
        </h3>

        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-light dark:divide-border-dark">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-44">Threat Category</th>
                  <th className="py-3 px-4 w-36">Attack Surface</th>
                  <th className="py-3 px-4">Implemented Defense Control</th>
                  <th className="py-3 px-4 w-48">Verification Method</th>
                  <th className="py-3 px-4 text-right w-36">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {securityControls.map((sc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {sc.threat}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {sc.surface}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {sc.control}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {sc.verification}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sc.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
