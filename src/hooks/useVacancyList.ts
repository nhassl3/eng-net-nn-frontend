import { useCallback } from 'react'
import { getAllVacancies } from '../api/vacancy'
import { VACANCIES } from '../data/vacancies'
import type { VacancyWithJd } from '../types/domain'
import { usePaginatedList } from './useAsync'

const PAGE_SIZE = 6;

export interface VacancyListResult {
  vacancies: VacancyWithJd[];
  hasMore: boolean;
  /** Первая загрузка: списка ещё нет — ни с сервера, ни из фолбэка */
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  /** true когда бэкенд недоступен и список отдан из статичного фолбэка */
  usingFallback: boolean;
}

/**
 * Постраничный список вакансий для публичной страницы (VacancyList/VacancyForm).
 * При ошибке первой загрузки (сервер выключен и т.п.) отдаёт статичный VACANCIES
 * вместо пустого списка — дальнейшая подгрузка в этом случае не нужна.
 */
export function useVacancyList(): VacancyListResult {
  // usePaginatedList ждёт { items }, а getAllVacancies отдаёт { vacancies } — адаптируем форму
  // ответа, как это уже делает src/pages/AdminPage.tsx для того же эндпоинта.
  const fetcher = useCallback(
    ({ limit, offset }: { limit: number; offset: number }) =>
      getAllVacancies({ limit, offset }).then((res) => ({ items: res.vacancies })),
    [],
  );
  const list = usePaginatedList<VacancyWithJd>(fetcher, PAGE_SIZE, [], (v) => v.uuid);

  const usingFallback = list.status === 'error' && list.items.length === 0;

  return {
    vacancies: usingFallback ? VACANCIES : list.items,
    hasMore: !usingFallback && list.hasMore,
    loading: list.status === 'loading' && list.items.length === 0,
    loadingMore: list.loadingMore,
    loadMore: list.loadMore,
    usingFallback,
  };
}
