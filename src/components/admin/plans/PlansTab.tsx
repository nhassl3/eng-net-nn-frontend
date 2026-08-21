import { useMemo, useState } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import { openPlanReply, openPlanView } from '../../../store/slices/adminSlice'
import { AdminEmpty, AdminError, AdminLoading } from '../AdminState'
import { AdminToolbar } from '../AdminToolbar'
import { useAdminData } from '../adminData'
import { planDirectionLabel } from '../format'
import { PlanRow } from './PlanRow'

export function PlansTab() {
  const dispatch = useAppDispatch();
  const { plans } = useAdminData();
  const [search, setSearch] = useState('');

  const list = useMemo(() => plans.data?.plans ?? [], [plans.data]);

  // Свежие заявки сверху — бэкенд порядок не гарантирует
  const sorted = useMemo(
    () => [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [list],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((p) =>
      p.full_name.toLowerCase().includes(q) ||
      p.email_to_feedback.toLowerCase().includes(q) ||
      p.task_description.toLowerCase().includes(q) ||
      planDirectionLabel(p.direction).toLowerCase().includes(q)
    );
  }, [sorted, search]);

  return (
    <>
      <AdminToolbar
        count={list.length}
        countLabel="заявок"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Поиск по имени, почте или задаче"
      />

      {plans.status === 'loading' && <AdminLoading label="Загружаем заявки…" />}

      {plans.status === 'error' && (
        <AdminError message={plans.error ?? 'Не удалось загрузить заявки'} onRetry={plans.reload} />
      )}

      {plans.status === 'success' && filtered.length === 0 && (
        <AdminEmpty
          title={search ? 'Ничего не найдено' : 'Заявок пока нет'}
          description={search
            ? 'Попробуйте изменить запрос.'
            : 'Здесь появятся запросы КП, отправленные с сайта.'}
        />
      )}

      {plans.status === 'success' && filtered.length > 0 && (
        <div className="admin-list">
          {filtered.map((p) => (
            <PlanRow
              key={p.uuid}
              plan={p}
              onView={() => dispatch(openPlanView(p.uuid))}
              onReply={() => dispatch(openPlanReply(p.uuid))}
            />
          ))}
        </div>
      )}
    </>
  );
}
