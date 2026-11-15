import React, { useState, useEffect } from 'react';
import {
  Inbox,
  FileEdit,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { apiClient } from '../services/api';
import { HandoffRecord } from '../types/api';

export const HandoffReview: React.FC = () => {
  const [handoffs, setHandoffs] = useState<HandoffRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedHandoff, setSelectedHandoff] = useState<HandoffRecord | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [resolutionStatus, setResolutionStatus] = useState<'REVIEWED' | 'RESOLVED' | 'DISMISSED'>('RESOLVED');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchHandoffs = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getHandoffs();
      setHandoffs(data);
    } catch (err) {
      console.error('Failed to load handoffs queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHandoffs();
  }, []);

  const handleOpenResolve = (item: HandoffRecord) => {
    setSelectedHandoff(item);
    setReviewerNotes(item.reviewer_notes || '');
    setResolutionStatus(item.status === 'PENDING' ? 'RESOLVED' : (item.status as any));
  };

  const handleSaveResolution = async () => {
    if (!selectedHandoff) return;
    setIsSubmitting(true);
    try {
      const updated = await apiClient.resolveHandoff(
        selectedHandoff.request_id,
        resolutionStatus,
        reviewerNotes
      );
      setHandoffs((prev) =>
        prev.map((h) => (h.request_id === updated.request_id ? updated : h))
      );
      setSelectedHandoff(null);
    } catch (err) {
      console.error('Failed to resolve handoff record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = handoffs.filter((h) => {
    const term = searchTerm.toLowerCase();
    return (
      h.request_id.toLowerCase().includes(term) ||
      h.question_summary.toLowerCase().includes(term) ||
      h.escalation_reason.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Human Review & Escalation Queue
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {handoffs.length} Total Escalations
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Operational review queue for queries escalated by safety guardrails or retrieval ambiguity.
          </p>
        </div>

        <button
          onClick={fetchHandoffs}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter escalations by prompt, reason, or request ID..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-xs"
        />
      </div>

      {/* Handoff Records Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading escalation handoffs...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-light dark:divide-border-dark">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-28">Status</th>
                  <th className="py-3 px-4 w-32">Request ID</th>
                  <th className="py-3 px-4">Sanitized Question Summary</th>
                  <th className="py-3 px-4 w-44">Escalation Reason</th>
                  <th className="py-3 px-4 w-36">Candidates</th>
                  <th className="py-3 px-4 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filtered.map((item) => (
                  <tr key={item.request_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          item.status === 'RESOLVED'
                            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                            : item.status === 'REVIEWED'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : item.status === 'DISMISSED'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.request_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-md">
                      {item.question_summary}
                      {item.reviewer_notes && (
                        <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-normal italic">
                          Staff Note: {item.reviewer_notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {item.escalation_reason}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {item.candidate_faq_ids.length > 0
                        ? item.candidate_faq_ids.join(', ')
                        : 'None'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenResolve(item)}
                        className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <FileEdit className="w-3 h-3" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">No escalated queries pending review in the queue.</p>
          </div>
        )}
      </div>

      {/* Review & Resolution Modal */}
      {selectedHandoff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Review Escalated Question
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {selectedHandoff.request_id} · {selectedHandoff.escalation_reason}
                </span>
              </div>
              <button
                onClick={() => setSelectedHandoff(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">User Enquiry:</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white p-3 rounded-lg bg-canvas-light dark:bg-canvas-dark border border-border-light dark:border-border-dark">
                  "{selectedHandoff.question_summary}"
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-400 block">
                  Staff Review Resolution Status:
                </label>
                <div className="flex space-x-2">
                  {(['REVIEWED', 'RESOLVED', 'DISMISSED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setResolutionStatus(st)}
                      className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors ${
                        resolutionStatus === st
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-400 block">
                  Admissions Staff Action Notes:
                </label>
                <textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Enter resolution notes, policy clarification, or student communication details..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-border-light dark:border-border-dark bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border-light dark:border-border-dark">
              <button
                onClick={() => setSelectedHandoff(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResolution}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Review Audit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
