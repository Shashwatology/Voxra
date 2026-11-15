import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { HealthResponse } from '../types/api';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  health
}) => {
  const tabs = [
    { id: 'chat', label: 'Admissions Chat' },
    { id: 'overview', label: 'Overview' },
    { id: 'knowledge', label: 'Knowledge Base' },
    { id: 'evaluations', label: 'Evaluations' },
    { id: 'handoffs', label: 'Review Queue' },
    { id: 'security', label: 'Security & Trust' },
    { id: 'docs', label: 'Documentation' }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center border border-border-light dark:border-border-dark shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <path d="M16 6V26M6 16H26" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                <path d="M10 13V19M13 10V22M16 7V25M19 10V22M22 13V19" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="2" fill="#F8FAFC"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-base">Enquiry Studio</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Northstar
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Every answer, accounted for.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Status Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Engine Status Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{health ? `${health.faq_count} FAQs Grounded` : '15 FAQs Grounded'}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle visual theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-border-light dark:border-border-dark scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs whitespace-nowrap font-medium rounded-md ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
