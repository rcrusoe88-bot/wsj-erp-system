const BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

let cachedToken: string | null = null;

export async function request<T = any>(
  method: string,
  path: string,
  body?: any,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cachedToken) {
    headers['Authorization'] = `Bearer ${cachedToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json() as ApiResponse<T>;
  return json;
}

export async function loginAsAdmin(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '123456' }),
  });
  const json = await res.json() as ApiResponse<{ accessToken: string }>;
  cachedToken = json.data.accessToken;
  return cachedToken!;
}

export function getToken(): string | null {
  return cachedToken;
}

export function clearToken(): void {
  cachedToken = null;
}
