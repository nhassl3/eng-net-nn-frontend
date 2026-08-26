import { authStorage } from './authStorage'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

function buildHeaders(extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extra as Record<string, string>),
  };
  const token = authStorage.getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function rawFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(options?.headers),
  });
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return false;

  const tokens = (await res.json()) as { access_token: string; refresh_token: string };
  authStorage.setTokens(tokens);
  return true;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res = await rawFetch(path, options);

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawFetch(path, options);
    } else {
      authStorage.clear();
      window.dispatchEvent(new Event('auth:session-expired'));
      throw new Error('SESSION_EXPIRED');
    }
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }

  // 204 (DELETE) и другие пустые тела не парсятся как JSON
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
