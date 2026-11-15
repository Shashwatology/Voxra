import React, { useState } from 'react';
import { Search, Lock, ExternalLink, BookOpen } from 'lucide-react';
import { FaqItem } from '../types/api';
import { FaqDetailDrawer } from '../components/FaqDetailDrawer';

interface KnowledgeBaseProps {
  faqs: FaqItem[];
  isLoading: boolean;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ faqs, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      faq.id.toLowerCase().includes(term) ||
      faq.canonical_question.toLowerCase().includes(term) ||
      faq.approved_answer.toLowerCase().includes(term) ||
      faq.keywords.some((k) => k.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Approved Knowledge Repository
            </h1>
            <span className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
              <Lock className="w-3 h-3" />
              <span>Immutable Knowledge Base</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exactly 15 canonical institutional facts for Northstar Learning Academy. Ground truth for all automated responses.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-3 py-1.5 rounded-lg shadow-xs">
          Version: 1.0.0 · Status: Verified
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search approved FAQ facts, programs, fees, schedules, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center overflow-x-auto space-x-1 pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading approved knowledge base...</div>
        ) : filteredFaqs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-light dark:divide-border-dark">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-24">FAQ ID</th>
                  <th className="py-3 px-4 w-28">Category</th>
                  <th className="py-3 px-4 w-1/3">Canonical Question</th>
                  <th className="py-3 px-4">Approved Answer Fact</th>
                  <th className="py-3 px-4 text-right w-20">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredFaqs.map((faq) => (
                  <tr
                    key={faq.id}
                    onClick={() => setSelectedFaq(faq)}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-teal-700 dark:text-teal-400">
                      {faq.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {faq.canonical_question}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      "{faq.approved_answer}"
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">No matching approved FAQs found for query "{searchTerm}".</p>
          </div>
        )}
      </div>

      {/* Drawer */}
      <FaqDetailDrawer faq={selectedFaq} onClose={() => setSelectedFaq(null)} />
    </div>
  );
};
