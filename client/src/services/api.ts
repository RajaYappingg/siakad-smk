import { ApiResponse } from '../types';

const BASE_URL = '/api';

class ApiError extends Error {
  override message: string;
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.message = message;
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('siakad_token');

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: 'Gagal memproses respons server.',
  }));

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || 'Terjadi kesalahan sistem.', response.status, data);
  }

  return (data.data !== undefined ? data.data : data) as T;
}

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    return request<T>(url, { method: 'GET' });
  },

  post: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete: <T = any>(endpoint: string) => {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
