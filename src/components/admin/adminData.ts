import { useOutletContext } from 'react-router-dom'
import type { ApiResource, PaginatedList } from '../../hooks/useAsync'
import type { Plans, Responds, VacancyJd, VacancyWithJd } from '../../types/domain'

/**
 * Данные грузит AdminPage, а не сами табы: модалки живут рядом с обёрткой
 * .app-shell (чтобы не попасть под blur), но им нужны те же списки.
 * Вакансии и профили работ грузятся постранично (см. usePaginatedList) — таб
 * доскроллил до конца текущих items → loadMore тянет следующую страницу; подгрузка
 * прекращается, когда сервер вернул неполную страницу — общего числа записей API не отдаёт.
 * Важно, что список один на страницу: модалки ищут запись по id именно в нём,
 * так что свой независимый список в табе означал бы «запись не найдена».
 */
export interface AdminData {
  vacancies: PaginatedList<VacancyWithJd>;
  vacanciesJd: PaginatedList<VacancyJd>;
  responds: ApiResource<Responds>;
  plans: ApiResource<Plans>;
}

export const useAdminData = () => useOutletContext<AdminData>();
