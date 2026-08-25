import { authStorage } from './authStorage'
import { ApiError } from './errors'

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

async function requestRefresh(): Promise<boolean> {
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

/**
 * Single-flight: страница поднимает несколько запросов разом, и при протухшем access-токене
 * все они получат 401 одновременно. Если бэкенд ротирует refresh-токены, второй и последующие
 * обновления упадут на уже использованном токене и выкинут админа из сессии — поэтому
 * все конкуренты ждут один и тот же промис.
 */
let refreshing: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  refreshing ??= requestRefresh()
    .catch(() => false)
    .finally(() => { refreshing = null; });
  return refreshing;
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
    const body = (await res.json().catch(() => ({}))) as { message?: string; code?: string };
    throw new ApiError(res.status, body.code ?? null, body.message ?? null);
  }

  // 204 (DELETE) и другие пустые тела не парсятся как JSON
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
