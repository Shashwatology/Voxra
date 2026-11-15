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
  Sparkles
} from 'lucide-react';
import { apiClient } from '../services/api';
import { ChatMessage, FaqItem } from '../types/api';
import { VoiceInputModal } from '../components/VoiceInputModal';

interface CustomerChatProps {
  onSelectFaq?: (faq: FaqItem) => void;
  faqs?: FaqItem[];
}

export const CustomerChat: React.FC<CustomerChatProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! Welcome to Northstar Learning Academy Admissions. I provide verified information regarding our Foundation and JEE programs, tuition fees, payment instalments, schedules, and scholarship policies. What would you like to know today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is the Foundation Program tuition fee?",
    "When are the JEE classes scheduled during the week?",
    "Can tuition fees be paid in instalments?",
    "Does the institute offer scholarships?",
    "Are weekend batches available?",
    "What is the maximum student capacity per batch?"
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
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "We encountered a network issue connecting to the admissions service. Please verify your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'escalated',
        reason: 'NETWORK_ERROR'
      };
      setMessages((prev) => [...prev, errorMsg]);
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
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Admissions Assistance Subheader */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-light dark:border-border-dark">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Northstar Learning Academy — Admissions Assistance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fictional Demonstration Campus · Andheri West, Mumbai · Guarded FAQ System
          </p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAnswered = msg.status === 'answered';
          const isEscalated = msg.status === 'escalated';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Message Bubble Container */}
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-br-xs'
                    : isEscalated
                    ? 'bg-amber-50/80 text-slate-900 border border-amber-200/80 dark:bg-amber-950/20 dark:text-slate-200 dark:border-amber-900/60 rounded-bl-xs'
                    : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                {/* Text Content */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Grounding & Verification Metadata */}
                {!isUser && (isAnswered || isEscalated) && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Status Pill */}
                    {isAnswered ? (
                      <div className="flex items-center space-x-1.5 text-teal-700 dark:text-teal-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Approved Fact: </span>
                        <span className="font-mono bg-teal-100/60 dark:bg-teal-900/40 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {msg.faq_id}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Escalated to Staff: </span>
                        <span className="font-mono text-[11px] bg-amber-100/60 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                          {msg.reason || 'UNVERIFIED_POLICY'}
                        </span>
                      </div>
                    )}

                    {/* Latency and Copy Actions */}
                    <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                      {msg.latency_ms !== undefined && (
                        <span className="font-mono text-[11px] flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{msg.latency_ms}ms</span>
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-slate-700 dark:hover:text-slate-300 p-0.5 rounded transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-start space-x-2 animate-fade-in">
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl rounded-bl-xs px-4 py-3 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.3s]"></div>
              <span className="text-xs font-mono text-slate-400 ml-1">Verifying approved facts...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      {messages.length <= 2 && (
        <div className="pt-2 pb-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Suggested verification queries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-700 dark:hover:border-teal-400 dark:hover:text-teal-300 transition-all text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Composer */}
      <div className="pt-3">
        <div className="relative rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm focus-within:ring-2 focus-within:ring-teal-600 dark:focus-within:ring-teal-400 focus-within:border-transparent transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about tuition fees, JEE schedules, scholarships, batches, or refund policy..."
            rows={2}
            className="w-full text-sm p-3 pr-24 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 resize-none outline-none"
          />

          {/* Action buttons inside composer */}
          <div className="absolute right-2.5 bottom-2.5 flex items-center space-x-1.5">
            <button
              onClick={() => setIsVoiceOpen(true)}
              type="button"
              className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Speak question via microphone"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              title="Submit enquiry (Enter)"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Guarded by approved institutional facts</span>
        </div>
      </div>

      {/* Voice Recognition Modal */}
      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSubmit={(transcript) => handleSend(transcript)}
      />
    </div>
  );
};
