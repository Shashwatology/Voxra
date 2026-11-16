export interface AskRequest {
  question: string;
  session_id?: string;
  client_language?: string;
}

export interface AskResponse {
  status: 'answered' | 'escalated';
  answer?: string | null;
  faq_id?: string | null;
  source?: string | null;
  reason?: string | null;
  message?: string | null;
  request_id: string;
  latency_ms: number;
  confidence?: number | null;
  category?: string | null;
}

export interface FaqItem {
  id: string;
  category: string;
  canonical_question: string;
  approved_answer: string;
  alternative_questions: string[];
  keywords: string[];
  immutable: boolean;
}

export interface HealthResponse {
  status: string;
  ai_mode: string;
  gemini_configured: boolean;
  model_name: string;
  faq_count: number;
  faq_version: string;
  timestamp: string;
}

export interface MetricsSummaryResponse {
  total_requests: number;
  answered_requests: number;
  escalated_requests: number;
  answer_coverage_pct: number;
  mean_latency_ms: number;
  p95_latency_ms: number;
  category_distribution: Record<string, number>;
  reason_distribution: Record<string, number>;
  recent_decisions: Array<{
    request_id: string;
    timestamp: string;
    question_preview: string;
    status: string;
    faq_id?: string;
    category?: string;
    reason?: string;
    latency_ms: number;
    confidence?: number;
  }>;
}

export interface HandoffRecord {
  request_id: string;
  timestamp: string;
  question_summary: string;
  escalation_reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  candidate_faq_ids: string[];
  reviewer_notes?: string | null;
}

export interface EvaluationItem {
  id: string;
  question: string;
  category: string;
  test_type: string;
  expected_action: 'ANSWER' | 'ESCALATE';
  expected_faq_id?: string | null;
  actual_status: string;
  actual_faq_id?: string | null;
  actual_reason?: string | null;
  passed: boolean;
  latency_ms: number;
  confidence?: number | null;
}

export interface EvaluationSummary {
  timestamp: string;
  ai_mode: string;
  model: string;
  total_questions: number;
  answerable_count: number;
  escalation_count: number;
  overall_accuracy: number;
  overall_accuracy_pct: number;
  answer_accuracy: number;
  answer_accuracy_pct: number;
  escalation_accuracy: number;
  escalation_accuracy_pct: number;
  false_answer_rate: number;
  false_answer_rate_pct: number;
  latency_metrics: {
    mean_ms: number;
    median_ms: number;
    p95_ms: number;
    min_ms: number;
    max_ms: number;
  };
  category_breakdown: Record<string, {
    total: number;
    correct: number;
    accuracy_pct: number;
  }>;
}

export interface EvaluationResponse {
  status: string;
  message?: string;
  summary: EvaluationSummary | null;
  results: EvaluationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  status?: 'answered' | 'escalated';
  faq_id?: string | null;
  category?: string | null;
  reason?: string | null;
  latency_ms?: number;
  request_id?: string;
  isStreaming?: boolean;
}

