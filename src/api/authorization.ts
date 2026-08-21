import type { User } from '../types/domain'
import { authStorage } from './authStorage'
import { apiFetch } from './client'

interface CreateUserInput {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

interface LoginInput {
  username?: string;
  email?: string;
  id?: string;
  password: string;
}

export interface AuthResponse {
  tokens: { access_token: string; refresh_token: string };
  user: User;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  authStorage.setTokens(data.tokens);
  return data;
}

export async function register(input: CreateUserInput): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  authStorage.setTokens(data.tokens);
  return data;
}

export async function getMe(): Promise<User> {
  const data = await apiFetch<{ user: User }>('/api/me');
  return data.user;
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
