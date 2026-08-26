import { useOutletContext } from 'react-router-dom'
import type { ApiResource } from '../../hooks/useAsync'
import type { Plans, Responds, VacancyJd, VacancyWithJd } from '../../types/domain'

/**
 * Данные грузит AdminPage, а не сами табы: модалки живут рядом с обёрткой
 * .app-shell (чтобы не попасть под blur), но им нужны те же списки.
 */
export interface AdminData {
  vacancies: ApiResource<VacancyWithJd[]>;
  vacanciesJd: ApiResource<VacancyJd[]>;
  responds: ApiResource<Responds>;
  plans: ApiResource<Plans>;
}

export const useAdminData = () => useOutletContext<AdminData>();
