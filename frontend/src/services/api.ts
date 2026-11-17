import {
  AskRequest,
  AskResponse,
  EvaluationResponse,
  FaqItem,
  HandoffRecord,
  HealthResponse,
  MetricsSummaryResponse
} from '../types/api';

// Resolves API base URL:
// - Uses VITE_API_URL if configured in environment variables
// - Otherwise falls back to relative path '' which is proxied by Vite in dev or routed by vercel.json in prod
const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/+$/, '');

export class ApiError extends Error {
  isNetworkError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    options: {
      isNetworkError?: boolean;
      isValidationError?: boolean;
      isServerError?: boolean;
      statusCode?: number;
      details?: any;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.isNetworkError = options.isNetworkError || false;
    this.isValidationError = options.isValidationError || false;
    this.isServerError = options.isServerError || false;
    this.statusCode = options.statusCode;
    this.details = options.details;
  }
}

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new ApiError(
      "We couldn't connect to the admissions service. Please verify your internet connection or try again.",
      { isNetworkError: true }
    );
  }

  // Check if server returned HTML error page instead of JSON API response
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError(
        `Admissions API endpoint unavailable (${res.status} ${res.statusText}).`,
        { isServerError: true, statusCode: res.status }
      );
    }
  }

  if (!res.ok) {
    let errBody: any = null;
    try {
      errBody = await res.json();
    } catch {
      errBody = { message: res.statusText };
    }

    if (res.status === 422) {
      throw new ApiError(
        errBody.message || "Invalid question input. Please ask a clearer question between 3 and 500 characters.",
        { isValidationError: true, statusCode: 422, details: errBody.details }
      );
    }

    if (res.status === 429) {
      throw new ApiError(
        "Rate limit exceeded. Please wait a moment before asking another question.",
        { isServerError: false, statusCode: 429 }
      );
    }

    throw new ApiError(
      errBody.message || `Service request failed with HTTP ${res.status}.`,
      { isServerError: res.status >= 500, statusCode: res.status, details: errBody }
    );
  }

  return res.json();
}

export const apiClient = {
  async askQuestion(question: string, session_id?: string): Promise<AskResponse> {
    const payload: AskRequest = { question, session_id };
    return safeFetch<AskResponse>('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async getHealth(): Promise<HealthResponse> {
    return safeFetch<HealthResponse>('/health');
  },

  async getFaqs(): Promise<FaqItem[]> {
    return safeFetch<FaqItem[]>('/faq');
  },

  async getMetrics(): Promise<MetricsSummaryResponse> {
    return safeFetch<MetricsSummaryResponse>('/metrics/summary');
  },

  async getEvaluationResults(): Promise<EvaluationResponse> {
    return safeFetch<EvaluationResponse>('/evaluation/results');
  },

  async getHandoffs(): Promise<HandoffRecord[]> {
    return safeFetch<HandoffRecord[]>('/handoffs');
  },

  async resolveHandoff(
    requestId: string,
    status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED',
    notes?: string
  ): Promise<HandoffRecord> {
    return safeFetch<HandoffRecord>(`/handoffs/${requestId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution_status: status, reviewer_notes: notes })
    });
  }
};
