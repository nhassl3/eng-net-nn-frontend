import { authStorage } from './authStorage'
import { apiFetch } from './client'

export interface AuthResponse {
  tokens: { access_token: string; refresh_token: string };
  user: { id: string; username: string; full_name: string; email: string };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  authStorage.set(data.tokens, data.user);
  return data;
}

export async function register(
  name: string,
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, username, email, password }),
  });
  authStorage.set(data.tokens, data.user);
  return data;
}

export function refresh(refresh_token: string): Promise<{ access_token: string; refresh_token: string }> {
  return apiFetch<{ access_token: string; refresh_token: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token }),
  });
}

export function logout(): void {
  authStorage.clear();
}
