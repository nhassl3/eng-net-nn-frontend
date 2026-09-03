import type { Respond, Responds, VacanciesWithJd, Vacancy, VacancyJd, VacancyWithJd } from '../types/domain'
import { apiFetch } from './client'

export interface RespondInput	{
	vacancy_id: string;
	fullName?: string;
	phoneNumber?: string;
	email: string;
	city: string;
	exp?: string;
	description?: string;
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

interface CreateVacancyJdInput {
	name: string;
	tags: string[];
	description: string;
}

interface UpdateVacanctInput {
	name?: string;
	tags?: string[];
	description?: string;
}

export interface VacancyJdList {
	job_directions: VacancyJd[];
}

export interface ListParams {
	limit?: number;
	offset?: number;
}

/** Размер страницы списков в админке — одинаковый для вакансий и профилей работ */
export const ADMIN_PAGE_SIZE = 20;

// Дефолт для вызовов без явных параметров
const DEFAULT_LIST_LIMIT = ADMIN_PAGE_SIZE;

// Vacancy API
// list и get отдают вакансию вместе с профилем работы (inner join на job_directions)

export async function getAllVacancies({ limit = DEFAULT_LIST_LIMIT, offset = 0 }: ListParams = {}): Promise<VacanciesWithJd> {
	const data = await apiFetch<VacanciesWithJd>(`/api/vacancies?limit=${limit}&offset=${offset}`);
	return { vacancies: data.vacancies ?? [] };
}

export async function getVacancy(id: string): Promise<VacancyWithJd> {
	const data = await apiFetch<VacancyWithJd>(`/api/vacancies/${id}`);
	return data;
}

export async function getAllVacanciesJd({ limit = DEFAULT_LIST_LIMIT, offset = 0 }: ListParams = {}): Promise<VacancyJdList> {
	const data = await apiFetch<VacancyJdList | VacancyJd[]>(`/api/admin/job_directions?limit=${limit}&offset=${offset}`);
	return Array.isArray(data) ? { job_directions: data } : { job_directions: data.job_directions ?? [] };
}

export async function getVacancyJd(id: number): Promise<VacancyJd> {
	const data = await apiFetch<VacancyJd>(`/api/admin/job_directions/${id}`);
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

export async function createVacancyJd(input: CreateVacancyJdInput): Promise<VacancyJd> {
	const data = await apiFetch<VacancyJd>('/api/admin/job_directions/', {
		method: 'POST',
		body: JSON.stringify(input),
	});
	return data;
}

export async function updateVacancyJd(id: number, input: UpdateVacanctInput): Promise<VacancyJd> {
	const data = await apiFetch<VacancyJd>(`/api/admin/job_directions/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	});
	return data;
}

export async function deleteVacancyJd(id: number): Promise<void> {
	await apiFetch<void>(`/api/admin/job_directions/${id}`, {
		method: "DELETE",
	});
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

export interface RespondResult {
	message: string;
}

/** Лимиты совпадают с бэкендом (pkg/minio/minio.go) — клиентская проверка лишь режет заведомо плохой файл раньше отправки. */
export const MAX_RESUME_SIZE = 10 * 1024 * 1024;
export const RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];

/**
 * multipart/form-data: поле `json` (строка с RespondInput) и поле `file` (резюме, обязательно) —
 * не JSON-body, так ждёт бэкенд (см. internal/transport/gin-http/vacancies.go: respond).
 */
export async function respond(input: RespondInput, resume: File): Promise<RespondResult> {
	const form = new FormData();
	form.append('json', JSON.stringify(input));
	form.append('file', resume);
	const data = await apiFetch<RespondResult>('/api/vacancies/respond', {
		method: 'POST',
		body: form,
	});
	return data;
}

// Admin panel vacancy responses API

export async function getVacancyResponses(): Promise<Responds> {
	const data = await apiFetch<Responds | Respond[]>('/api/admin/vacancies/');
	return Array.isArray(data)
		? { respond_vacancies: data }
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