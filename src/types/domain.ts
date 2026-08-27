export const ADMIN_ROLE = 'admin';

export type UserRole = 'admin' | 'user';

export interface User {
  uuid: string;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
} 

export interface Vacancy {
  uuid: string;
  name: string;
  description: string;
  required_exp: string;
  skills: string[];
  pay_day: number;
  created_at: string;
  updated_at: string;
}

export interface VacancyJd {
  id: number;
  jd_name: string;
  jd_description: string;
  jd_tags: string[];
}

// Профиль работы (job_directions) приходит слитно с вакансией — inner join на бэкенде
export interface VacancyWithJd extends Vacancy, VacancyJd {}

export interface VacanciesWithJd {
  vacancies: VacancyWithJd[];
}

export interface Vacancies {
  vacancies: Vacancy[];
}

export interface Respond {
  uuid: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  exp: string;
  description: string;
  resumeUrl: string;
  vacancyId: string;
  created_at: string;
}

export interface Responds {
  respond_vacancies: Respond[];
}

export interface Plan {
  uuid: string; 
  full_name: string;
  direction: number;
  task_description: string;
  email_to_feedback: string; 
  created_at: string;
}

export interface Plans {
  plans: Plan[];
  total: number;
}

export interface UserPlan {
  user?: User;
  plan?: Plan;
}