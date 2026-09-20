import type { User } from '../types/domain'
import { apiFetch } from './client'

export type AssignableRole = 'admin' | 'partner';

/** Точный поиск по username — GET /api/admin/users?username=... */
export async function searchUserByUsername(username: string): Promise<User> {
	const data = await apiFetch<User>(`/api/admin/users?username=${encodeURIComponent(username)}`);
	return data;
}

export async function assignRole(userId: string, role: AssignableRole): Promise<void> {
	const path = role === 'admin' ? `/api/admin/add_admin/${userId}` : `/api/admin/add_partner/${userId}`;
	await apiFetch<void>(path, { method: 'POST' });
}
