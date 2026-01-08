const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmoney.digitalhouse.com';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customToken?: string
  ): Promise<T> {
    const token = customToken || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Error en la solicitud',
      }));
      throw {
        message: error.message || 'Error en la solicitud',
        statusCode: response.status,
      };
    }

    // Si la respuesta es 204 No Content, retornar objeto vacío
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  },

  get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  },

  post<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  },

  patch<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  },

  delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  },
};
