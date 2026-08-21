import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeVacancyView, openVacancyEdit } from '../../../store/slices/adminSlice'
import type { VacancyWithJd } from '../../../types/domain'
import { AdminModalShell } from '../AdminModalShell'
import { formatDate, formatExp, formatMoney } from '../format'

export function VacancyViewModal({ vacancies }: { vacancies: VacancyWithJd[] }) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.vacancyViewId);
  const vacancy = id === null ? undefined : vacancies.find((v) => v.uuid === id);

  const close = () => dispatch(closeVacancyView());

  return (
    <AdminModalShell
      open={id !== null}
      onClose={close}
      kicker="вакансия"
      title={vacancy?.name ?? 'Вакансия не найдена'}
      scroll
    >
      {!vacancy ? (
        <p className="qm-lede">Запись могла быть удалена. Обновите список.</p>
      ) : (
        <>
          <dl className="admin-kv">
            <dt>Зарплата</dt>
            <dd>{formatMoney(vacancy.pay_day)}</dd>

            <dt>Опыт</dt>
            <dd>{formatExp(vacancy.required_exp)}</dd>

            <dt>Создана</dt>
            <dd>{formatDate(vacancy.created_at)}</dd>

            <dt>Обновлена</dt>
            <dd>{formatDate(vacancy.updated_at)}</dd>

            <dt>Описание</dt>
            <dd className="long">{vacancy.description || '—'}</dd>
          </dl>

          {vacancy.skills?.length > 0 && (
            <div className="field">
              <label>Навыки</label>
              <div className="qm-chips">
                {vacancy.skills.map((s) => (
                  <span key={s} className="qm-chip">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Профиль работы — приходит слитно с вакансией из job_directions */}
          {vacancy.jd_name && (
            <>
              <span className="kicker" style={{ marginTop: 8, display: 'inline-block' }}>
                <span className="num">/ профиль работы</span>
              </span>
              <dl className="admin-kv">
                <dt>Название</dt>
                <dd>{vacancy.jd_name || '—'}</dd>

                <dt>Описание</dt>
                <dd className="long">{vacancy.jd_description || '—'}</dd>
              </dl>

              {vacancy.jd_tags?.length > 0 && (
                <div className="field">
                  <label>Теги профиля</label>
                  <div className="qm-chips">
                    {vacancy.jd_tags.map((t) => (
                      <span key={t} className="qm-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={close}>Закрыть</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { close(); dispatch(openVacancyEdit(vacancy.uuid)); }}
            >
              Изменить <span className="arrow" />
            </button>
          </div>
        </>
      )}
    </AdminModalShell>
  );
}
