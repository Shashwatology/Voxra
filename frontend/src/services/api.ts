import {
  AskRequest,
  AskResponse,
  EvaluationResponse,
  FaqItem,
  HandoffRecord,
  HealthResponse,
  MetricsSummaryResponse
} from '../types/api';

const API_BASE = ''; // Uses Vite proxy in development or relative path in production

export const apiClient = {
  async askQuestion(question: string, session_id?: string): Promise<AskResponse> {
    const payload: AskRequest = { question, session_id };
    const res = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `API request failed with status ${res.status}`);
    }
    return res.json();
  },

  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health status');
    return res.json();
  },

  async getFaqs(): Promise<FaqItem[]> {
    const res = await fetch(`${API_BASE}/faq`);
    if (!res.ok) throw new Error('Failed to fetch canonical FAQs');
    return res.json();
  },

  async getMetrics(): Promise<MetricsSummaryResponse> {
    const res = await fetch(`${API_BASE}/metrics/summary`);
    if (!res.ok) throw new Error('Failed to fetch operational telemetry');
    return res.json();
  },

  async getEvaluationResults(): Promise<EvaluationResponse> {
    const res = await fetch(`${API_BASE}/evaluation/results`);
    if (!res.ok) throw new Error('Failed to fetch evaluation benchmark data');
    return res.json();
  },

  async getHandoffs(): Promise<HandoffRecord[]> {
    const res = await fetch(`${API_BASE}/handoffs`);
    if (!res.ok) throw new Error('Failed to fetch human handoff queue');
    return res.json();
  },

  async resolveHandoff(
    requestId: string,
    status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED',
    notes?: string
  ): Promise<HandoffRecord> {
    const res = await fetch(`${API_BASE}/handoffs/${requestId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution_status: status, reviewer_notes: notes })
    });
    if (!res.ok) throw new Error('Failed to update handoff record');
    return res.json();
  }
};

