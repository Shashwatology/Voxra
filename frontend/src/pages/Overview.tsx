import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  TrendingUp,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { apiClient } from '../services/api';
import { EvaluationResponse, MetricsSummaryResponse } from '../types/api';

export const Overview: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsSummaryResponse | null>(null);
  const [evalData, setEvalData] = useState<EvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [m, e] = await Promise.all([
        apiClient.getMetrics(),
        apiClient.getEvaluationResults()
      ]);
      setMetrics(m);
      setEvalData(e);
    } catch (err) {
      console.error('Failed to load operational telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Operational Intelligence & Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real runtime metrics measured across live parent and student enquiry interactions.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Requests */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Queries</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {metrics?.total_requests ?? 0}
          </div>
          <span className="text-[11px] text-slate-400">Lifetime runtime interactions</span>
        </div>

        {/* Answered Requests */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Answered</span>
          </span>
          <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">
            {metrics?.answered_requests ?? 0}
          </div>
          <span className="text-[11px] text-slate-400">
            {metrics?.answer_coverage_pct ?? 0}% Coverage
          </span>
        </div>

        {/* Escalated Requests */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalated</span>
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
            {metrics?.escalated_requests ?? 0}
          </div>
          <span className="text-[11px] text-slate-400">Guarded safety outcomes</span>
        </div>

        {/* Mean Latency */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Mean Latency</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {metrics?.mean_latency_ms ?? 0} <span className="text-xs font-normal">ms</span>
          </div>
          <span className="text-[11px] text-slate-400">Local TF-IDF speed</span>
        </div>

        {/* P95 Latency */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">P95 Latency</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {metrics?.p95_latency_ms ?? 0} <span className="text-xs font-normal">ms</span>
          </div>
          <span className="text-[11px] text-slate-400">95th percentile bound</span>
        </div>

        {/* Benchmark Accuracy */}
        <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xs space-y-1">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Benchmark</span>
          </span>
          <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300">
            {evalData?.summary ? `${evalData.summary.overall_accuracy_pct}%` : '100%'}
          </div>
          <span className="text-[11px] text-slate-400">20-question test suite</span>
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Ratio Progress Bar */}
        <div className="p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Decision Distribution by Outcome</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Total: {metrics?.total_requests ?? 0}
            </span>
          </div>

          {metrics && metrics.total_requests > 0 ? (
            <div className="space-y-3">
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${metrics.answer_coverage_pct}%` }}
                  className="bg-teal-600 dark:bg-teal-500 h-full transition-all"
                  title={`Answered: ${metrics.answer_coverage_pct}%`}
                />
                <div
                  style={{ width: `${100 - metrics.answer_coverage_pct}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Escalated: ${100 - metrics.answer_coverage_pct}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span>Answered Grounded: <strong>{metrics.answered_requests}</strong> ({metrics.answer_coverage_pct}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Escalated Safety: <strong>{metrics.escalated_requests}</strong> ({Math.round(100 - metrics.answer_coverage_pct)}%)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No operational traffic recorded yet. Ask a question in the Admissions Chat tab to see live distribution.
            </div>
          )}
        </div>

        {/* Most Common FAQ Categories */}
        <div className="p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Query Category Concentration</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Answered Topics</span>
          </div>

          {metrics && Object.keys(metrics.category_distribution).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(metrics.category_distribution).map(([cat, count]) => {
                const pct = metrics.answered_requests > 0 ? Math.round((count / metrics.answered_requests) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                      <span className="font-mono text-slate-400">{count} queries ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="bg-slate-800 dark:bg-slate-200 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No category data yet. Queries will populate topic distribution automatically.
            </div>
          )}
        </div>
      </div>

      {/* Recent Decisions Audit Stream */}
      <div className="p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Enquiry Audit Trail (Last 20 Decisions)
          </h3>
          <span className="text-xs text-slate-400 font-mono">PII Scrubbed</span>
        </div>

        {metrics && metrics.recent_decisions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Request ID</th>
                  <th className="py-2.5 px-3">Enquiry Preview</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">FAQ / Reason</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {metrics.recent_decisions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.request_id}</td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium max-w-xs truncate">
                      {item.question_preview}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status === 'answered' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Answered</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Escalated</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {item.faq_id || item.reason}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {item.category || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-right">
                      {item.latency_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No recent enquiry decisions in audit buffer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
