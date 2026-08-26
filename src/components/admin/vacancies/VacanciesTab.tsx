import { useMemo, useState } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import {
  openResponds, openVacancyCreate, openVacancyDelete, openVacancyEdit,
  openVacancyView
} from '../../../store/slices/adminSlice'
import { AdminEmpty, AdminError, AdminLoading } from '../AdminState'
import { AdminToolbar } from '../AdminToolbar'
import { useAdminData } from '../adminData'
import { VacancyRow } from './VacancyRow'

export function VacanciesTab() {
  const dispatch = useAppDispatch();
  const { vacancies, responds } = useAdminData();
  const [search, setSearch] = useState('');

  // Отклики приходят одним списком — раскладываем по вакансиям на клиенте,
  // так фича не зависит от наличия пер-вакансионного эндпоинта.
  const respondsByVacancy = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of responds.data?.respond_vacancies ?? []) {
      map.set(r.vacancyId, (map.get(r.vacancyId) ?? 0) + 1);
    }
    return map;
  }, [responds.data]);

  const list = useMemo(() => vacancies.data ?? [], [vacancies.data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((v) =>
      v.name.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.skills?.some((s) => s.toLowerCase().includes(q)) ||
      v.jd_name?.toLowerCase().includes(q) ||
      v.jd_tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [list, search]);

  const createBtn = (
    <>
      <button type="button" className="btn btn-primary" onClick={() => dispatch(openVacancyCreate())}>
        Создать вакансию <span className="arrow" />
      </button>
    </>
  );

  return (
    <>
      <AdminToolbar
        count={list.length}
        countLabel="вакансий"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Поиск по названию или навыку"
        note={
          <span className="admin-badge muted" title="Публичная страница /vacancies пока использует статический список из src/data/vacancies.ts">
            данные API
          </span>
        }
        action={createBtn}
      />

      {vacancies.status === 'loading' && <AdminLoading label="Загружаем вакансии…" />}

      {vacancies.status === 'error' && (
        <AdminError message={vacancies.error ?? 'Не удалось загрузить вакансии'} onRetry={vacancies.reload} />
      )}

      {vacancies.status === 'success' && filtered.length === 0 && (
        <AdminEmpty
          title={search ? 'Ничего не найдено' : 'Вакансий пока нет'}
          description={search
            ? 'Попробуйте изменить запрос.'
            : 'Создайте первую вакансию — она появится в этом списке.'}
          action={search ? undefined : createBtn}
        />
      )}

      {vacancies.status === 'success' && filtered.length > 0 && (
        <div className="admin-list">
          {filtered.map((item) => (
            <VacancyRow
              key={item.uuid}
              item={item}
              respondCount={responds.status === 'success' ? (respondsByVacancy.get(item.uuid) ?? 0) : null}
              onView={() => dispatch(openVacancyView(item.uuid))}
              onResponds={() => dispatch(openResponds(item.uuid))}
              onEdit={() => dispatch(openVacancyEdit(item.uuid))}
              onDelete={() => dispatch(openVacancyDelete(item.uuid))}
            />
          ))}
        </div>
      )}
    </>
  );
}
