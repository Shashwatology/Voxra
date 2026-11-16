import React from 'react';
import { X, Lock, Tag, BookOpen, Layers } from 'lucide-react';
import { FaqItem } from '../types/api';

interface FaqDetailDrawerProps {
  faq: FaqItem | null;
  onClose: () => void;
}

export const FaqDetailDrawer: React.FC<FaqDetailDrawerProps> = ({ faq, onClose }) => {
  if (!faq) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark h-full shadow-2xl flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {faq.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {faq.category}
            </span>
            <span className="flex items-center space-x-1 text-xs text-amber-700 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
              <Lock className="w-3 h-3" />
              <span>Immutable</span>
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Canonical Question */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Canonical Question</span>
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
              {faq.canonical_question}
            </h3>
          </div>

          {/* Approved Answer Fact */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              <span>Approved Fact (Exact Answer String)</span>
            </span>
            <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              "{faq.approved_answer}"
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              Notice: This answer is delivered verbatim from verified institutional records without generative modification.
            </p>
          </div>

          {/* Alternative Phrasings */}
          {faq.alternative_questions && faq.alternative_questions.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Approved Query Variations ({faq.alternative_questions.length})</span>
              </span>
              <ul className="space-y-1.5">
                {faq.alternative_questions.map((alt, idx) => (
                  <li
                    key={idx}
                    className="text-xs p-2.5 rounded-lg bg-surface-elevatedLight dark:bg-surface-elevatedDark text-slate-700 dark:text-slate-300 border border-border-light dark:border-border-dark"
                  >
                    "{alt}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search Index Keywords */}
          {faq.keywords && faq.keywords.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Indexed Match Keywords</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {faq.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 flex justify-between items-center">
          <span>Authority: Northstar Admissions Board</span>
          <span>Version: 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

