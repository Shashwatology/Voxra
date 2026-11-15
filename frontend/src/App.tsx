import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerChat } from './pages/CustomerChat';
import { Overview } from './pages/Overview';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Evaluations } from './pages/Evaluations';
import { HandoffReview } from './pages/HandoffReview';
import { SecurityReliability } from './pages/SecurityReliability';
import { Documentation } from './pages/Documentation';
import { apiClient } from './services/api';
import { FaqItem, HealthResponse } from './types/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isFaqLoading, setIsFaqLoading] = useState<boolean>(true);

  // Sync dark class on html root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial health and FAQ knowledge base
  useEffect(() => {
    const initApp = async () => {
      try {
        const [h, f] = await Promise.all([
          apiClient.getHealth(),
          apiClient.getFaqs()
        ]);
        setHealth(h);
        setFaqs(f);
      } catch (err) {
        console.warn('Backend connection notice: Ensure backend is running at http://localhost:8000', err);
      } finally {
        setIsFaqLoading(false);
      }
    };
    initApp();
  }, []);

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        health={health}
      />

      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'chat' && <CustomerChat faqs={faqs} />}
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'knowledge' && <KnowledgeBase faqs={faqs} isLoading={isFaqLoading} />}
        {activeTab === 'evaluations' && <Evaluations />}
        {activeTab === 'handoffs' && <HandoffReview />}
        {activeTab === 'security' && <SecurityReliability health={health} />}
        {activeTab === 'docs' && <Documentation />}
      </main>
    </div>
  );
}

export default App;
