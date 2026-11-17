import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { CustomerChat } from './pages/CustomerChat';
import { Overview } from './pages/Overview';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Evaluations } from './pages/Evaluations';
import { HandoffReview } from './pages/HandoffReview';
import { SecurityReliability } from './pages/SecurityReliability';
import { Documentation } from './pages/Documentation';
import { FaqDetailDrawer } from './components/FaqDetailDrawer';
import { apiClient } from './services/api';
import { FaqItem, HealthResponse } from './types/api';

export function App() {
  // Determine initial active tab from window pathname
  const getInitialTab = (): string => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/demo') return 'chat';
    if (path === '/overview' || path === '/app') return 'overview';
    if (path === '/knowledge' || path === '/kb') return 'knowledge';
    if (path === '/evaluations' || path === '/eval') return 'evaluations';
    if (path === '/handoffs') return 'handoffs';
    if (path === '/security') return 'security';
    if (path === '/docs' || path === '/documentation') return 'docs';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isFaqLoading, setIsFaqLoading] = useState<boolean>(true);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  // Sync tab changes with browser URL history
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    let newPath = '/';
    if (tabId === 'chat') newPath = '/demo';
    else if (tabId === 'landing') newPath = '/';
    else newPath = `/${tabId}`;

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial health and canonical FAQs
  useEffect(() => {
    const initApp = async () => {
      try {
        const [h, f] = await Promise.all([
          apiClient.getHealth().catch(() => null),
          apiClient.getFaqs().catch(() => [])
        ]);
        if (h) setHealth(h);
        if (f) setFaqs(f);
      } catch (err) {
        console.warn('Backend connection notice: Ensure backend is running.', err);
      } finally {
        setIsFaqLoading(false);
      }
    };
    initApp();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Warm Editorial Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        health={health}
      />

      {/* Main Tab Views */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateDemo={() => handleTabChange('chat')}
            onNavigateTab={(tab) => handleTabChange(tab)}
          />
        )}
        {activeTab === 'chat' && (
          <CustomerChat
            onSelectFaq={(faq) => setSelectedFaq(faq)}
            faqs={faqs}
            onNavigateHome={() => handleTabChange('landing')}
            onNavigateOverview={() => handleTabChange('overview')}
          />
        )}
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'knowledge' && (
          <KnowledgeBase
            faqs={faqs}
            isLoading={isFaqLoading}
          />
        )}
        {activeTab === 'evaluations' && <Evaluations />}
        {activeTab === 'handoffs' && <HandoffReview />}
        {activeTab === 'security' && <SecurityReliability health={health} />}
        {activeTab === 'docs' && <Documentation />}
      </main>

      {/* Slide-over FAQ Detail Drawer */}
      {selectedFaq && (
        <FaqDetailDrawer
          faq={selectedFaq}
          onClose={() => setSelectedFaq(null)}
        />
      )}
    </div>
  );
}

export default App;
