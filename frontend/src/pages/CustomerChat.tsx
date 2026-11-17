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
  ArrowLeft
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
  onNavigateOverview
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! Welcome to Northstar Learning Academy Admissions. I provide verified information regarding our Foundation (Classes 9-10) and JEE (Classes 11-12) programs, tuition fees, instalment plans, schedules, and scholarship policies. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is the Foundation Program tuition fee?",
    "When are the JEE classes scheduled during the week?",
    "Can tuition fees be paid in instalments?",
    "Does the institute offer scholarships?",
    "What is the maximum student capacity per batch?",
    "Where is the campus located in Mumbai?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastFailedQuery(null);

    try {
      const response = await apiClient.askQuestion(q);

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: response.status === 'answered' && response.answer
          ? response.answer
          : response.message || "I couldn't verify that from our approved information. The admissions team can assist you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: response.status,
        faq_id: response.faq_id,
        category: response.category,
        reason: response.reason,
        latency_ms: response.latency_ms,
        request_id: response.request_id
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setLastFailedQuery(q);
      const isNet = err instanceof ApiError ? err.isNetworkError : true;

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isNet
          ? "We couldn't connect to the admissions service. Please verify your connection or try again."
          : err.message || "The admissions service encountered an issue. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'escalated',
        reason: isNet ? 'CONNECTIVITY_ERROR' : 'SERVICE_ERROR'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    if (lastFailedQuery) {
      handleSend(lastFailedQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Conversation cleared. What questions can I answer about Northstar Learning Academy programs and policies?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastFailedQuery(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-4 sm:py-6 text-stone-900">
      {/* Admissions Assistance Subheader */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
        <div className="flex items-center space-x-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 pr-2 border-r border-stone-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight flex items-center space-x-2">
              <span>Northstar Admissions Assistant</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 font-medium">
                Guarded
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Campus: Andheri West, Mumbai · Fictional Coaching Simulation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onNavigateOverview && (
            <button
              onClick={onNavigateOverview}
              className="hidden sm:inline-flex text-xs text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Ledger
            </button>
          )}
          <button
            onClick={clearChat}
            className="flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-800 px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors"
            title="Reset Chat"
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

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Message Bubble Container */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : isNetworkError
                    ? 'bg-rose-50 text-rose-950 border border-rose-200/90 rounded-bl-xs'
                    : isEscalated
                    ? 'bg-amber-50/80 text-stone-900 border border-amber-200/80 rounded-bl-xs'
                    : 'bg-white border border-stone-200/90 text-stone-900 rounded-bl-xs'
                }`}
              >
                {/* Text Content */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Grounding & Verification Metadata */}
                {!isUser && (isAnswered || isEscalated) && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Status Pill */}
                    {isAnswered ? (
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved Fact: </span>
                        <span className="font-mono bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {msg.faq_id}
                        </span>
                      </div>
                    ) : isNetworkError ? (
                      <div className="flex items-center space-x-2 text-rose-800 font-medium">
                        <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                        <span>Network issue</span>
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
                      <div className="flex items-center space-x-1.5 text-amber-800 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Escalated to Staff: </span>
                        <span className="font-mono text-[11px] bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded">
                          {msg.reason || 'UNVERIFIED_POLICY'}
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
              <span className="text-xs font-mono text-stone-500 ml-1">Verifying approved facts...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      {messages.length <= 2 && (
        <div className="pt-2 pb-1">
          <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Suggested verification queries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-3 py-1.5 rounded-full transition-colors text-left shadow-xs hover:border-stone-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Multiline Chat Composer */}
      <div className="pt-2">
        <div className="relative flex items-end bg-white border border-stone-300/90 rounded-2xl p-2 shadow-warm focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-amber-600/30 transition-all">
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
          Responses strictly grounded in approved Northstar Learning Academy knowledge base. All rights reserved.
        </p>
      </div>

      {/* Voice Input Modal */}
      {isVoiceOpen && (
        <VoiceInputModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          onSubmit={(transcript: string) => {
            setInput(transcript);
            setIsVoiceOpen(false);
          }}
        />
      )}
    </div>
  );
};
