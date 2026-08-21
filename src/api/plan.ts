import type { Plan, Plans, UserPlan } from '../types/domain'
import { apiFetch } from './client'

// Admin management API for plans
export interface RequestPlan {
	full_name: string;
	direction: number;
	task_description: string;
	email_to_feedback: string;
}

export async function getAllPlans(): Promise<Plans> {
	const data = await apiFetch<Plans | Plan[]>('/api/admin/plans/');
	// Бэкенд отдаёт обёртку {plans,total}; массив принимаем на случай смены контракта
	return Array.isArray(data) ? { plans: data, total: data.length } : data;
}

export async function getPlan(id: string): Promise<Plan> {
	const data = await apiFetch<Plan>(`/api/admin/plans/${id}`);
	return data;
}

// Plan API

export async function requestPlan(input: RequestPlan): Promise<Plan> {
	const data = await apiFetch<Plan>('/api/plans/', {
		method: 'POST',
		body: JSON.stringify(input),
	});
	return data;
}

// getResponseFromRequest require user token provided in the request header
export async function getResponseFromRequest(id: string): Promise<UserPlan> {
	const data = await apiFetch<UserPlan>(`/api/plans/${id}`);
	return data;
}

// Ответ администратора на заявку КП

export interface PlanReplyInput {
	plan_id: string;
	subject: string;
	message: string;
}

export interface PlanReplyResult {
	id: string;
	sent_at: string;
}

/**
 * ЗАГЛУШКА — письмо никуда не уходит.
 *
 * TODO(backend): заменить тело на реальный вызов, снаружи менять ничего не нужно:
 *   return apiFetch<PlanReplyResult>('/api/admin/plans/respond/', {
 *     method: 'POST',
 *     body: JSON.stringify(input),
 *   });
 */
export async function respondToPlan(input: PlanReplyInput): Promise<PlanReplyResult> {
	await new Promise((r) => setTimeout(r, 900));
	if (!input.message.trim()) throw new Error('Сообщение не может быть пустым');
	return { id: crypto.randomUUID(), sent_at: new Date().toISOString() };
}