const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string | null;
}

async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', headers = {}, body, token } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || `API error: ${response.status}`);
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out - backend may be unavailable');
    }
    throw err;
  }
}

// Properties
export const propertiesApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient(`/properties${query}`);
  },
  get: (id: string) => apiClient(`/properties/${id}`),
  similar: (id: string, limit = '5') => apiClient(`/properties/${id}/similar?limit=${limit}`),
};

// Agents
export const agentsApi = {
  list: () => apiClient('/agents'),
  get: (id: string) => apiClient(`/agents/${id}`),
};

// Blogs
export const blogsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient(`/blogs${query}`);
  },
  get: (slug: string) => apiClient(`/blogs/${slug}`),
};

// Auth
export const authApi = {
  verify: (idToken: string) => apiClient('/auth/verify', { method: 'POST', body: { idToken } }),
  me: (token: string) => apiClient('/auth/me', { token }),
};

// Users
export const usersApi = {
  profile: (token: string) => apiClient('/users/profile', { token }),
  updateProfile: (token: string, data: any) => apiClient('/users/profile', { method: 'PUT', body: data, token }),
  savedProperties: (token: string) => apiClient('/users/saved-properties', { token }),
  saveProperty: (token: string, propertyId: number) => apiClient('/users/saved-properties', { method: 'POST', body: { property_id: propertyId }, token }),
  unsaveProperty: (token: string, propertyId: number) => apiClient(`/users/saved-properties/${propertyId}`, { method: 'DELETE', token }),
};

export default apiClient;
