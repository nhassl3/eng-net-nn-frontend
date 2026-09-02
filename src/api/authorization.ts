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

/**
 * Refresh-токена в ответе нет: бэкенд кладёт его в httpOnly-куку.
 * В теле приходит только access-токен и его время жизни.
 */
export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  authStorage.setSession(data);
  return data;
}

export async function register(input: CreateUserInput): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  authStorage.setSession(data);
  return data;
}

export async function getMe(): Promise<User> {
  const data = await apiFetch<{ user: User }>('/api/me');
  return data.user;
}

/**
 * Отзывает на сервере и access-, и refresh-токен и гасит куку. Обновление
 * access-токена живёт в client.refreshSession — здесь его дублировать не нужно.
 */
export function logout(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/logout', { method: 'POST' });
}
