import { useMemo } from 'react'
import type { AsyncStatus } from '../../../hooks/useAsync'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeResponds, openRespondReply } from '../../../store/slices/adminSlice'
import type { Respond, VacancyWithJd } from '../../../types/domain'
import { AdminModalShell } from '../AdminModalShell'
import { AdminError, AdminLoading } from '../AdminState'
import { formatDate } from '../format'

interface Props {
  vacancies: VacancyWithJd[];
  responds: Respond[];
  state: { status: AsyncStatus; error: string | null; reload: () => void };
}

export function RespondsModal({ vacancies, responds, state }: Props) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.respondsVacancyId);
  const vacancy = id === null ? undefined : vacancies.find((v) => v.uuid === id);

  // Фильтруем на клиенте — пер-вакансионного эндпоинта пока нет
  const list = useMemo(
    () => (id === null ? [] : responds.filter((r) => r.vacancyId === id)),
    [responds, id],
  );

  return (
    <AdminModalShell
      open={id !== null}
      onClose={() => dispatch(closeResponds())}
      kicker="отклики"
      title={vacancy?.name ?? 'Отклики'}
      lede={state.status === 'success' ? `Откликов: ${list.length}` : undefined}
      scroll
    >
      {state.status === 'loading' && <AdminLoading label="Загружаем отклики…" />}

      {state.status === 'error' && (
        <AdminError message={state.error ?? 'Не удалось загрузить отклики'} onRetry={state.reload} />
      )}

      {state.status === 'success' && list.length === 0 && (
        <p className="qm-lede">На эту вакансию пока никто не откликнулся.</p>
      )}

      {state.status === 'success' && list.length > 0 && (
        <div className="admin-responds">
          {list.map((r) => (
            <article key={r.uuid} className="admin-respond">
              <div className="row1">
                <h4>{r.fullName}</h4>
                <span className="admin-badge muted">{formatDate(r.created_at)}</span>
              </div>

              <dl className="admin-kv">
                <dt>Email</dt>
                <dd><a href={`mailto:${r.email}`}>{r.email}</a></dd>

                <dt>Телефон</dt>
                <dd><a href={`tel:${r.phoneNumber}`}>{r.phoneNumber}</a></dd>

                <dt>Город</dt>
                <dd>{r.city || '—'}</dd>

                <dt>Опыт</dt>
                <dd>{r.exp || '—'}</dd>

                {r.description && (
                  <>
                    <dt>О себе</dt>
                    <dd className="long">{r.description}</dd>
                  </>
                )}

                {r.resumeUrl && (
                  <>
                    <dt>Резюме</dt>
                    <dd>
                      <a href={r.resumeUrl} target="_blank" rel="noreferrer noopener">
                        Открыть файл
                      </a>
                    </dd>
                  </>
                )}
              </dl>

              <button
                type="button"
                className="icon-btn"
                onClick={() => dispatch(openRespondReply(r.uuid))}
              >
                Ответить
              </button>
            </article>
          ))}
        </div>
      )}
    </AdminModalShell>
  );
}
