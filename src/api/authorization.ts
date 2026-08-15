import type { User } from '../types/domain'
import { authStorage } from './authStorage'
import { apiFetch } from './client'

export interface AuthResponse {
  tokens: { access_token: string; refresh_token: string };
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  authStorage.setTokens(data.tokens);
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
  authStorage.setTokens(data.tokens);
  return data;
}

export function getMe(): Promise<User> {
  return apiFetch<User>('/api/me');
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
