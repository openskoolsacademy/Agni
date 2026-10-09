const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // Non-JSON response
    }
    throw new ApiError(errorMsg, response.status);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => request<any>('/auth/me'),

  // Bots
  getBots: () => request<{ bots: any[] }>('/bots'),
  createBot: (data: { name: string; description?: string }) =>
    request<any>('/bots', { method: 'POST', body: JSON.stringify(data) }),
  getBot: (id: string) => request<any>(`/bots/${id}`),
  updateBot: (id: string, data: any) => request<any>(`/bots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBot: (id: string) => request<any>(`/bots/${id}`, { method: 'DELETE' }),

  // Settings
  updateBotSettings: (botId: string, settings: any) =>
    request<any>(`/bots/${botId}/settings`, { method: 'PUT', body: JSON.stringify(settings) }),

  // Domains
  getAllowedDomains: (botId: string) => request<any>(`/bots/${botId}/domains`),
  addAllowedDomain: (botId: string, domain: string, allowLocalhost: boolean) =>
    request<any>(`/bots/${botId}/domains`, {
      method: 'POST',
      body: JSON.stringify({ domain, allowLocalhost }),
    }),
  deleteAllowedDomain: (botId: string, domainId: string) =>
    request<any>(`/bots/${botId}/domains/${domainId}`, { method: 'DELETE' }),

  // Knowledge
  uploadDocument: (botId: string, file: File) => {
    const formData = new FormData();
    formData.append('botId', botId);
    formData.append('file', file);
    return request<any>('/knowledge/upload', {
      method: 'POST',
      body: formData,
    });
  },
  addTextKnowledge: (data: { botId: string; title: string; content: string; category?: string }) =>
    request<any>('/knowledge/text', { method: 'POST', body: JSON.stringify(data) }),
  getDocuments: (botId: string) => request<{ documents: any[] }>(`/knowledge/${botId}`),
  deleteDocument: (docId: string) => request<any>(`/knowledge/documents/${docId}`, { method: 'DELETE' }),
  testSearch: (botId: string, query: string) =>
    request<any>('/knowledge/search', { method: 'POST', body: JSON.stringify({ botId, query }) }),

  // Conversations
  getConversations: (botId: string, limit = 50) =>
    request<{ conversations: any[] }>(`/conversations/${botId}?limit=${limit}`),
  getConversationDetail: (id: string) => request<any>(`/conversations/detail/${id}`),
  deleteConversation: (id: string) => request<any>(`/conversations/detail/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: (botId: string, days = 30) => request<any>(`/analytics/${botId}?days=${days}`),

  // Health
  getHealth: () => request<any>('/health'),
};
