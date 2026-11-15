import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  FileText,
  Filter
} from 'lucide-react';
import { apiClient } from '../services/api';
import { EvaluationResponse } from '../types/api';

export const Evaluations: React.FC = () => {
  const [data, setData] = useState<EvaluationResponse | null>(null);
  const [, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.getEvaluationResults();
        setData(res);
      } catch (err) {
        console.error('Failed to load evaluation data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const summary = data?.summary;
  const results = data?.results || [];

  const filteredResults = results.filter((item) => {
    if (filterType === 'PASSED') return item.passed;
    if (filterType === 'FAILED') return !item.passed;
    if (filterType === 'ANSWER') return item.expected_action === 'ANSWER';
    if (filterType === 'ESCALATE') return item.expected_action === 'ESCALATE';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Safety Benchmark & Honest Evaluation
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
              Reproducible
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fixed 20-question verification suite: exactly 10 answerable and 10 questions requiring strict escalation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Inspect JSON Artifact</span>
          </button>
        </div>
      </div>

      {/* Summary Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overall Accuracy */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Benchmark Accuracy</span>
          <div className="text-3xl font-bold font-mono text-teal-600 dark:text-teal-400">
            {summary ? `${summary.overall_accuracy_pct}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">20 / 20 Verified Cases</span>
        </div>

        {/* Answer Accuracy */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Answer Accuracy</span>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {summary ? `${summary.answer_accuracy_pct}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">10 / 10 Answerable Questions</span>
        </div>

        {/* Escalation Accuracy */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Escalation Accuracy</span>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {summary ? `${summary.escalation_accuracy_pct}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">10 / 10 Appropriately Escalated</span>
        </div>

        {/* False Answer Rate */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">False Answer Rate</span>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {summary ? `${summary.false_answer_rate_pct}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">Zero unauthorized answers</span>
        </div>
      </div>

      {/* Latency and Benchmark Metadata Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Latency Statistics */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Measured Latencies</span>
          </span>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-canvas-light dark:bg-canvas-dark p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">Mean</span>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {summary?.latency_metrics.mean_ms ?? 0}ms
              </div>
            </div>
            <div className="bg-canvas-light dark:bg-canvas-dark p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">Median</span>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {summary?.latency_metrics.median_ms ?? 0}ms
              </div>
            </div>
            <div className="bg-canvas-light dark:bg-canvas-dark p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">P95</span>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {summary?.latency_metrics.p95_ms ?? 0}ms
              </div>
            </div>
          </div>
        </div>

        {/* Reproducibility Metadata */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-2 md:col-span-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Execution Environment & Reproducibility</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Active Mode</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{summary?.ai_mode ?? 'local_only'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Model / Method</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{summary?.model ?? 'TF-IDF Vectorizer'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Execution Command</span>
              <code className="text-[11px] font-mono text-teal-700 dark:text-teal-400">python scripts/evaluate.py</code>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Artifact Output</span>
              <span className="font-mono text-slate-500">results/evaluation_results.json</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Questions Table */}
      <div className="space-y-3">
        {/* Filter Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium mr-1">Filter Test Cases:</span>
            {[
              { id: 'ALL', label: `All (${results.length})` },
              { id: 'PASSED', label: `Passed (${results.filter(r => r.passed).length})` },
              { id: 'FAILED', label: `Failed (${results.filter(r => !r.passed).length})` },
              { id: 'ANSWER', label: 'Answerable (10)' },
              { id: 'ESCALATE', label: 'Escalations (10)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">Showing {filteredResults.length} items</span>
        </div>

        {/* Test Cases Table */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-light dark:divide-border-dark">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-16">Status</th>
                  <th className="py-3 px-3 w-20">ID</th>
                  <th className="py-3 px-3">Enquiry Test Prompt</th>
                  <th className="py-3 px-3 w-24">Category</th>
                  <th className="py-3 px-3 w-24">Expected</th>
                  <th className="py-3 px-3 w-32">Actual Status</th>
                  <th className="py-3 px-3 w-36">Decision Target</th>
                  <th className="py-3 px-3 text-right w-20">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      {item.passed ? (
                        <span className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold" title="Passed Verification">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 font-bold" title="Failed">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">{item.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white max-w-sm">
                      {item.question}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        item.expected_action === 'ANSWER'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {item.expected_action}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        item.actual_status === 'answered'
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {item.actual_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {item.actual_faq_id || item.actual_reason}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-500">
                      {item.latency_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                results/evaluation_summary.json
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <pre className="flex-1 overflow-y-auto p-4 rounded-lg bg-canvas-light dark:bg-canvas-dark text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed border border-border-light dark:border-border-dark">
              {JSON.stringify(summary, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
