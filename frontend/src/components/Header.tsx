import React from 'react';
import { HealthResponse } from '../types/api';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  health
}) => {
  const tabs = [
    { id: 'landing', label: 'Landing Page' },
    { id: 'chat', label: 'Admissions Assistant' },
    { id: 'overview', label: 'Overview' },
    { id: 'knowledge', label: 'Knowledge Base' },
    { id: 'evaluations', label: 'Evaluations' },
    { id: 'handoffs', label: 'Review Queue' },
    { id: 'security', label: 'Security & Trust' },
    { id: 'docs', label: 'Documentation' }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#FDFBF7]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5v14M7 8v8M22 10v4M2 11v2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-900 tracking-tight text-base font-sans">
                  Voxra
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-amber-50 text-amber-900 border border-amber-200/80">
                  Northstar Admissions
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-normal">
                Every answer, accounted for.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator & Quick Demo */}
          <div className="flex items-center space-x-3">
            {health && (
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>15 FAQs Ready</span>
              </div>
            )}
            {activeTab !== 'chat' && (
              <button
                onClick={() => setActiveTab('chat')}
                className="text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-1.5 rounded-full shadow-xs transition-all"
              >
                Try live demo
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-stone-200/60 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
