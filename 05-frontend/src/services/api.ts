import { getToken, removeToken } from '@/utils/token';
import { history } from 'umi';

const BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let fullUrl = `${BASE_URL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) fullUrl += `?${qs}`;
  }

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> || {}),
  };

  const response = await fetch(fullUrl, { ...init, headers });

  if (response.status === 401) {
    removeToken();
    history.push('/login');
    throw new ApiError('未授权，请重新登录', 401);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || '请求失败', response.status);
  }

  return data;
}

export const api = {
  get: <T = any>(url: string, params?: Record<string, any>) =>
    request<T>(url, { method: 'GET', params }),

  post: <T = any>(url: string, body?: any) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(url: string, body?: any) =>
    request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export { ApiError };
