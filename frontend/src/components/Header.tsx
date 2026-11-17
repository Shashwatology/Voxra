import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Database,
  BarChart2,
  FileCheck2,
  BookOpen,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { HealthResponse } from '../types/api';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  health
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Sticky header transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsResourcesOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const resourceItems = [
    {
      id: 'overview',
      label: 'Workspace',
      description: 'Analytics, coverage metrics & live telemetry',
      icon: LayoutDashboard,
      badge: 'Metrics'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      description: '15 approved canonical FAQs & lexical triggers',
      icon: Database,
      badge: `${health?.faq_count || 15} FAQs`
    },
    {
      id: 'evaluations',
      label: 'Evaluations',
      description: 'Reproducible 20-question benchmark suite',
      icon: BarChart2,
      badge: '100% Pass'
    },
    {
      id: 'handoffs',
      label: 'Review Queue',
      description: 'Human-in-the-loop escalation ledger',
      icon: FileCheck2
    },
    {
      id: 'docs',
      label: 'Documentation',
      description: 'System specifications, API schema & runbooks',
      icon: BookOpen
    }
  ];

  const isResourceActive = ['overview', 'knowledge', 'evaluations', 'handoffs', 'docs'].includes(activeTab);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F8F7F4]/90 backdrop-blur-md border-b border-stone-200/90 shadow-warm-sm py-2.5'
          : 'bg-[#F8F7F4]/75 backdrop-blur-sm border-b border-stone-200/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ─────────────────────────────────────────────────────────────────
              LEFT: Voxra Brand Mark & Wordmark
          ───────────────────────────────────────────────────────────────── */}
          <div
            onClick={() => handleNavigateSection('')}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            {/* Minimalist Voice Waveform / Stellar Brand Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#171C24] text-[#C1A37A] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg
                className="w-4 h-4 text-[#C1A37A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5v14M7 8v8M22 10v4M2 11v2" />
              </svg>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#171C24] tracking-tight text-lg font-sans">
                voxra<span className="text-[#C1A37A]">.</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#DCE5DD]/50 text-[#2C3E35] border border-[#DCE5DD]">
                Northstar
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              CENTER: Primary Floating Navigation
          ───────────────────────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'landing' && !window.location.hash
                  ? 'text-[#171C24] font-semibold bg-stone-200/60'
                  : 'text-stone-600 hover:text-[#171C24] hover:bg-stone-100/80'
              }`}
            >
              Home
            </button>

            {/* Product */}
            <button
              onClick={() => handleNavigateSection('product')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-[#171C24] hover:bg-stone-100/80 transition-all"
            >
              Product
            </button>

            {/* How It Works */}
            <button
              onClick={() => handleNavigateSection('how-it-works')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-[#171C24] hover:bg-stone-100/80 transition-all"
            >
              How It Works
            </button>

            {/* Trust & Safety */}
            <button
              onClick={() => handleNavigateSection('trust')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'security'
                  ? 'text-[#171C24] font-semibold bg-stone-200/60'
                  : 'text-stone-600 hover:text-[#171C24] hover:bg-stone-100/80'
              }`}
            >
              Trust & Safety
            </button>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                aria-expanded={isResourcesOpen}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isResourceActive || isResourcesOpen
                    ? 'text-[#171C24] font-semibold bg-stone-200/60'
                    : 'text-stone-600 hover:text-[#171C24] hover:bg-stone-100/80'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-warm-lg border border-stone-200/90 p-2 animate-fade-in z-50">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-3 py-1.5">
                    Platform Tools & Documentation
                  </div>
                  <div className="space-y-1">
                    {resourceItems.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsResourcesOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start space-x-3 transition-colors ${
                            isItemActive
                              ? 'bg-stone-100 text-[#171C24]'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700 shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-stone-900 truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 leading-snug line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ─────────────────────────────────────────────────────────────────
              RIGHT: Launch Demo Primary CTA & Mobile Toggle
          ───────────────────────────────────────────────────────────────── */}
          <div className="flex items-center space-x-3">
            {/* Live FAQ Telemetry Pill */}
            {health && (
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>15 FAQs Grounded</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`inline-flex items-center space-x-1.5 font-medium text-xs px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[#171C24] hover:bg-stone-800 text-white'
              }`}
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            MOBILE NAVIGATION DRAWER
        ───────────────────────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-stone-200/70 mt-3 animate-fade-in space-y-1">
            <button
              onClick={() => {
                setActiveTab('landing');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigateSection('product')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              Product
            </button>
            <button
              onClick={() => handleNavigateSection('how-it-works')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavigateSection('trust')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
            >
              Trust & Safety
            </button>

            <div className="pt-2 border-t border-stone-200/60">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-3">
                Platform Resources
              </span>
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 px-2">
                {resourceItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left p-2 rounded-lg text-xs font-medium border ${
                      activeTab === item.id
                        ? 'bg-stone-200/70 border-stone-300 text-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
