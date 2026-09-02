import { authStorage } from './authStorage'
import { ApiError } from './errors'

/**
 * Только origin API — путь целиком задаёт вызывающий (`/api/...`, `/auth/...`).
 * Пусто = тот же origin, что и фронтенд (вариант с reverse proxy).
 */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

/**
 * Бэкенд требует этот заголовок на эндпоинтах, которые аутентифицируются одной
 * лишь refresh-кукой (см. middleware.RequireRequestedWith). Заголовок
 * non-safelisted, поэтому браузер обязан сделать preflight — а его он для
 * чужого origin не пропустит. Форма с чужого сайта такой заголовок не выставит.
 */
const REQUESTED_WITH = 'fetch';

/**
 * На этих путях 401 — это ответ по существу («неверный пароль», «нет сессии»),
 * а не протухший access-токен. Пропускать их через refresh-интерцептор нельзя:
 * неудачный вход обнулял бы живую сессию и показывал «Сессия истекла».
 */
const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/refresh'];

function buildHeaders(extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': REQUESTED_WITH,
    ...(extra as Record<string, string>),
  };
  const token = authStorage.getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function rawFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    // Без этого refresh-кука не поедет на кросс-доменный API.
    credentials: 'include',
    headers: buildHeaders(options?.headers),
  });
}

async function requestRefresh(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-Requested-With': REQUESTED_WITH },
  });

  if (!res.ok) return false;

  const session = (await res.json()) as { access_token: string; expires_in: number };
  authStorage.setSession(session);
  return true;
}

/**
 * Single-flight: страница поднимает несколько запросов разом, и при протухшем access-токене
 * все они получат 401 одновременно. Бэкенд ротирует refresh-токены и блэклистит старый,
 * поэтому второе и последующие обновления упадут на уже отозванном токене и выкинут
 * админа из сессии — все конкуренты ждут один и тот же промис.
 */
let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  refreshing ??= requestRefresh()
    .catch(() => false)
    .finally(() => { refreshing = null; });
  return refreshing;
}

function endSession(): never {
  authStorage.clear();
  window.dispatchEvent(new Event('auth:session-expired'));
  throw new Error('SESSION_EXPIRED');
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const isAuthPath = AUTH_PATHS.some((p) => path.startsWith(p));

  // Проактивное обновление: PASETO для клиента непрозрачен, но бэкенд отдаёт
  // expires_in, так что 401 можно не дожидаться.
  if (!isAuthPath && authStorage.isExpiringSoon() && !(await refreshSession())) {
    endSession();
  }

  let res = await rawFetch(path, options);

  // Страховка на случай, когда expires_in разошёлся с реальностью: часы клиента
  // врут, вкладка спала, токен отозвали через logout в другой вкладке.
  if (res.status === 401 && !isAuthPath) {
    if (!(await refreshSession())) endSession();
    res = await rawFetch(path, options);
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
