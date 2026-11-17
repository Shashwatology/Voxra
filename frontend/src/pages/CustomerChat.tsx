import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  WifiOff,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  X,
  ChevronRight,
  Info
} from 'lucide-react';
import { apiClient, ApiError } from '../services/api';
import { ChatMessage, FaqItem } from '../types/api';
import { VoiceInputModal } from '../components/VoiceInputModal';

interface CustomerChatProps {
  onSelectFaq?: (faq: FaqItem) => void;
  faqs?: FaqItem[];
  onNavigateHome?: () => void;
  onNavigateOverview?: () => void;
}

export const CustomerChat: React.FC<CustomerChatProps> = ({
  onNavigateHome,
  onNavigateOverview: _onNavigateOverview,
  faqs = [],
  onSelectFaq: _onSelectFaq
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! Welcome to Northstar Learning Academy Admissions. I provide verified information regarding our Foundation (Classes 9-10) and JEE (Classes 11-12) programs, tuition fees, instalment plans, class schedules, and scholarship policies. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isFaqDrawerOpen, setIsFaqDrawerOpen] = useState<boolean>(false);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const curatedSuggestions = [
    { label: "JEE Tuition Fee", query: "What is the JEE Preparation Program tuition fee?", category: "fees" },
    { label: "Foundation Fee", query: "What is the Foundation Program tuition fee?", category: "fees" },
    { label: "JEE Class Schedule", query: "When are the JEE classes scheduled during the week?", category: "schedule" },
    { label: "Instalment Plan", query: "Can tuition fees be paid in instalments?", category: "fees" },
    { label: "Scholarships", query: "Does the institute offer scholarships?", category: "scholarships" },
    { label: "Batch Size Limit", query: "What is the maximum student capacity per batch?", category: "batches" },
    { label: "Weekend Batches", query: "Are weekend batches available?", category: "schedule" },
    { label: "Campus Location", query: "Where is Northstar Learning Academy located?", category: "location" },
    { label: "Tuition Refund Policy", query: "What is the tuition refund policy?", category: "policy" }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText !== undefined ? queryText : input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (queryText === undefined) {
      setInput('');
    }
    setIsLoading(true);
    setLastFailedQuery(null);

    try {
      const response = await apiClient.askQuestion(textToSend.trim());

      const assistantMessage: ChatMessage = {
        id: response.request_id || `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.answer || response.message || "I couldn't verify that from our approved information. The admissions team can assist you.",
        status: response.status as 'answered' | 'escalated',
        faq_id: response.faq_id || undefined,
        reason: response.reason || undefined,
        latency_ms: response.latency_ms,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setLastFailedQuery(textToSend.trim());

      let errorMsg = "Unable to reach the Northstar Admissions verification server. Please verify your connection.";
      if (err instanceof ApiError) {
        errorMsg = err.message;
      }

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: errorMsg,
        status: 'escalated',
        reason: 'CONNECTIVITY_ERROR',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetryLast = () => {
    if (lastFailedQuery) {
      handleSend(lastFailedQuery);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hello! Welcome to Northstar Learning Academy Admissions. I provide verified information regarding our Foundation (Classes 9-10) and JEE (Classes 11-12) programs, tuition fees, instalment plans, class schedules, and scholarship policies. What can I help you with today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastFailedQuery(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getReasonBadge = (reason?: string) => {
    switch (reason) {
      case 'UNSUPPORTED_QUESTION':
        return { label: 'Outside Knowledge Scope', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'AMBIGUOUS_QUERY':
        return { label: 'Clarification Needed', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'POLICY_VIOLATION':
        return { label: 'Policy Boundary', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'UNAUTHORIZED_DISCOUNT':
        return { label: 'Discount Negotiation Handoff', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'UNSUPPORTED_GUARANTEE':
        return { label: 'Rank Guarantee Policy', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'PROMPT_INJECTION_DETECTED':
        return { label: 'Security Guardrail Active', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'CONNECTIVITY_ERROR':
        return { label: 'Network Connection Issue', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { label: 'Counselor Handoff', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
  };

  // Filter approved FAQs for the drawer
  const filteredFaqs = faqs.filter((faq) => {
    const qMatch = faq.canonical_question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                   faq.approved_answer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                   faq.category.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return qMatch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-3 sm:py-4">
      {/* Editorial Assistant Sub-Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/80">
        <div className="flex items-center space-x-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1.5 text-xs text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-xs"
              title="Return to Public Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
                Northstar Admissions Assistant
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                100% Policy Grounded
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Campus: Andheri West, Mumbai • Fictional Coaching Simulation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Approved Knowledge Scope Button */}
          <button
            onClick={() => setIsFaqDrawerOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg shadow-xs transition-colors"
            title="Browse all 15 approved FAQ topics"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline font-medium">15 Approved FAQs</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={clearChat}
            className="flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-800 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAnswered = msg.status === 'answered';
          const isEscalated = msg.status === 'escalated';
          const isNetworkError = msg.reason === 'CONNECTIVITY_ERROR';
          const badge = getReasonBadge(msg.reason || undefined);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Message Bubble Container */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : isNetworkError
                    ? 'bg-rose-50 text-rose-950 border border-rose-200/90 rounded-bl-xs'
                    : isEscalated
                    ? 'bg-amber-50/70 text-stone-900 border border-amber-200/80 rounded-bl-xs'
                    : 'bg-white border border-stone-200/90 text-stone-900 rounded-bl-xs'
                }`}
              >
                {/* Text Content */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Helpful Guidance when Escalated */}
                {!isUser && isEscalated && !isNetworkError && (
                  <div className="mt-3 pt-2.5 border-t border-amber-200/70 text-xs text-stone-600 space-y-2">
                    <div className="flex items-start space-x-2 bg-white/70 p-2 rounded-xl border border-amber-200/60">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Northstar Scope Notice: </span>
                        <span>
                          Automated answers are restricted to official institute policies (Tuition fees, Class schedules, Batch size, Scholarships, Campus location, and Refund rules).
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-medium text-stone-500">Try asking:</span>
                      <button
                        onClick={() => handleSend("What is the JEE Preparation Program tuition fee?")}
                        className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full text-stone-700 transition-colors shadow-2xs"
                      >
                        JEE Tuition Fee
                      </button>
                      <button
                        onClick={() => handleSend("When are the JEE classes scheduled during the week?")}
                        className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full text-stone-700 transition-colors shadow-2xs"
                      >
                        JEE Timings
                      </button>
                      <button
                        onClick={() => handleSend("Does the institute offer scholarships?")}
                        className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full text-stone-700 transition-colors shadow-2xs"
                      >
                        Scholarships
                      </button>
                    </div>
                  </div>
                )}

                {/* Grounding & Verification Metadata */}
                {!isUser && (isAnswered || isEscalated) && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Status Pill */}
                    {isAnswered ? (
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved Policy Grounded: </span>
                        <span className="font-mono bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {msg.faq_id}
                        </span>
                      </div>
                    ) : isNetworkError ? (
                      <div className="flex items-center space-x-2 text-rose-800 font-medium">
                        <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                        <span>Network Connection Issue</span>
                        {lastFailedQuery && (
                          <button
                            onClick={handleRetryLast}
                            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry question</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-amber-900 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Staff Escalation: </span>
                        <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    )}

                    {/* Latency and Copy Actions */}
                    <div className="flex items-center space-x-2 text-stone-400">
                      {msg.latency_ms !== undefined && (
                        <span className="font-mono text-[11px] flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{msg.latency_ms}ms</span>
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-stone-700 p-0.5 rounded transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-stone-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-start space-x-2 animate-fade-in">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center space-x-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.3s]"></div>
              <span className="text-xs font-mono text-stone-500 ml-1">Verifying against 15 approved FAQs...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Persistent Quick Verified Prompts Bar */}
      <div className="pt-2 pb-1 border-t border-stone-200/70 mt-2">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium text-stone-700">Quick Verified Inquiries:</span>
          </div>
          <button
            onClick={() => setIsFaqDrawerOpen(true)}
            className="text-[11px] text-amber-700 hover:text-amber-800 font-medium underline underline-offset-2"
          >
            View all 15 FAQs &rarr;
          </button>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {curatedSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={isLoading}
              className="text-xs whitespace-nowrap bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-3 py-1.5 rounded-full transition-colors shadow-2xs hover:border-stone-400 flex items-center space-x-1 shrink-0"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Multiline Chat Composer */}
      <div className="pt-1">
        <div className="relative flex items-end bg-white border border-stone-300 rounded-2xl p-2 shadow-warm focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-amber-600/30 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about admissions, tuition fees, instalments, scholarships, or policies..."
            rows={2}
            className="flex-1 resize-none bg-transparent px-2.5 py-1 text-sm text-stone-900 placeholder-stone-400 focus:outline-none max-h-32 leading-relaxed"
            disabled={isLoading}
          />

          <div className="flex items-center space-x-1.5 ml-2 pb-0.5">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Voice Input (Microphone)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white transition-all shadow-sm flex items-center justify-center"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <p className="text-[11px] text-center text-stone-400 mt-2">
          Responses strictly grounded in approved Northstar Learning Academy knowledge base. Every answer accounted for.
        </p>
      </div>

      {/* Slide-Over Drawer: Approved Knowledge Scope (15 FAQs) */}
      {isFaqDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-stone-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-900">
                  Approved Knowledge Scope ({faqs.length || 15} FAQs)
                </h3>
              </div>
              <button
                onClick={() => setIsFaqDrawerOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-white border-b border-stone-200">
              <input
                type="text"
                placeholder="Search approved FAQ topics..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* FAQs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No approved FAQs match your search.
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs hover:border-amber-400/80 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        {faq.id}
                      </span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                        {faq.category}
                      </span>
                    </div>
                    <p className="font-semibold text-stone-900 mb-1 leading-snug">
                      {faq.canonical_question}
                    </p>
                    <p className="text-stone-600 mb-2.5 leading-relaxed">
                      {faq.approved_answer}
                    </p>
                    <button
                      onClick={() => {
                        setIsFaqDrawerOpen(false);
                        handleSend(faq.canonical_question);
                      }}
                      className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors border border-amber-200/60"
                    >
                      <span>Ask this question</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Only questions answering these 15 topics are approved for autonomous response.
            </div>
          </div>
        </div>
      )}

      {/* Voice Input Modal */}
      {isVoiceOpen && (
        <VoiceInputModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          onSubmit={(transcript) => {
            setIsVoiceOpen(false);
            handleSend(transcript);
          }}
        />
      )}
    </div>
  );
};
