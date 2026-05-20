// Works both client-side (relative /api/...) and can be overridden via env
const API_BASE = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || '/api');

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string | null;
}

async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', headers = {}, body, token } = options;

  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };

  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `API error: ${response.status}`);
  }

  return data;
}

export const propertiesApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient(`/properties${query}`);
  },
  get:     (id: string)             => apiClient(`/properties/${id}`),
  similar: (id: string, limit = '5') => apiClient(`/properties/${id}/similar?limit=${limit}`),
};

export const agentsApi = {
  list: ()           => apiClient('/agents'),
  get:  (id: string) => apiClient(`/agents/${id}`),
};

export const blogsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient(`/blogs${query}`);
  },
  get: (slug: string) => apiClient(`/blogs/${slug}`),
};

export const authApi = {
  verify: (idToken: string) => apiClient('/auth/verify', { method: 'POST', body: { idToken } }),
  me:     (token: string)   => apiClient('/auth/me', { token }),
};

export const usersApi = {
  profile:          (token: string)                       => apiClient('/users/profile', { token }),
  updateProfile:    (token: string, data: any)            => apiClient('/users/profile', { method: 'PUT', body: data, token }),
  savedProperties:  (token: string)                       => apiClient('/users/saved-properties', { token }),
  saveProperty:     (token: string, propertyId: number)   => apiClient('/users/saved-properties', { method: 'POST', body: { property_id: propertyId }, token }),
  unsaveProperty:   (token: string, propertyId: number)   => apiClient(`/users/saved-properties/${propertyId}`, { method: 'DELETE', token }),
};

export default apiClient;
