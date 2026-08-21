import type { Respond, Responds, Vacancy, VacancyWithJd } from '../types/domain'
import { apiFetch } from './client'

export interface RespondInput	{
	vacancy_id: string;
	fullName: string;
	phoneNumber: string;
	email: string;
	city: string;
	exp: string;
	description: string;
}

export interface CreateVacancyInput {
	/** FK на таблицу job_directions (профиль работы) */
	jd: number;
	name: string;
	description: string;
	required_exp?: string;
	skills: string[];
	pay_day?: number;
}

export interface UpdateVacancyInput {
	jd?: number;
	name?: string;
	description?: string;
	required_exp?: string;
	skills?: string[];
	pay_day?: number;
}

// Vacancy API
// list и get отдают вакансию вместе с профилем работы (inner join на job_directions)

export async function getAllVacancies(): Promise<VacancyWithJd[]> {
	const data = await apiFetch<VacancyWithJd[] | { vacancies: VacancyWithJd[] }>('/api/vacancies/');
	// Принимаем и голый массив, и обёртку {vacancies,total} — контракт не зафиксирован
	return Array.isArray(data) ? data : (data.vacancies ?? []);
}

export async function getVacancy(id: string): Promise<VacancyWithJd> {
	const data = await apiFetch<VacancyWithJd>(`/api/vacancies/${id}`);
	return data;
}

// Admin panel vacancy management API

export async function createVacancy(input: CreateVacancyInput): Promise<Vacancy> {
	const data = await apiFetch<Vacancy>('/api/admin/vacancies/', {
		method: 'POST',
		body: JSON.stringify(input),
	});
	return data;
}

export async function updateVacancy(id: string, input: UpdateVacancyInput): Promise<Vacancy> {
	const data = await apiFetch<Vacancy>(`/api/admin/vacancies/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	});
	return data;
}

export async function deleteVacancy(id: string): Promise<void> {
	await apiFetch<void>(`/api/admin/vacancies/${id}`, {
		method: 'DELETE',
	});
}

// Respond to a vacancy API

export async function respond(input: RespondInput): Promise<string> {
	const data = await apiFetch<string>('/api/vacancy/respond', {
		method: 'POST',
		body: JSON.stringify(input),
	});
	return data;
}

// Admin panel vacancy responses API

export async function getVacancyResponses(): Promise<Responds> {
	const data = await apiFetch<Responds | Respond[]>('/api/admin/vacancies/');
	return Array.isArray(data)
		? { respond_vacancies: data, total: data.length }
		: { ...data, respond_vacancies: data.respond_vacancies ?? [] };
}

export async function getVacancyResponse(id: string): Promise<Respond> {
	const data = await apiFetch<Respond>(`/api/admin/vacancies/${id}`);
	return data;
}

// Ответ администратора кандидату

export interface RespondReplyInput {
	respond_id: string;
	subject: string;
	message: string;
}

export interface RespondReplyResult {
	id: string;
	sent_at: string;
}

/**
 * ЗАГЛУШКА — письмо никуда не уходит.
 *
 * TODO(backend): заменить тело на реальный вызов, снаружи менять ничего не нужно:
 *   return apiFetch<RespondReplyResult>('/api/admin/vacancies/respond/', {
 *     method: 'POST',
 *     body: JSON.stringify(input),
 *   });
 */
export async function respondToCandidate(input: RespondReplyInput): Promise<RespondReplyResult> {
	await new Promise((r) => setTimeout(r, 900));
	if (!input.message.trim()) throw new Error('Сообщение не может быть пустым');
	return { id: crypto.randomUUID(), sent_at: new Date().toISOString() };
}