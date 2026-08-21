import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closePlanView, openPlanReply } from '../../../store/slices/adminSlice'
import type { Plan } from '../../../types/domain'
import { AdminModalShell } from '../AdminModalShell'
import { formatDate, planDirectionLabel } from '../format'

export function PlanViewModal({ plans }: { plans: Plan[] }) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.planViewId);
  const plan = id === null ? undefined : plans.find((p) => p.uuid === id);

  const close = () => dispatch(closePlanView());

  return (
    <AdminModalShell
      open={id !== null}
      onClose={close}
      kicker="заявка КП"
      title={plan?.full_name ?? 'Заявка не найдена'}
      scroll
    >
      {!plan ? (
        <p className="qm-lede">Запись могла быть удалена. Обновите список.</p>
      ) : (
        <>
          <dl className="admin-kv">
            <dt>Направление</dt>
            <dd>{planDirectionLabel(plan.direction)}</dd>

            <dt>Email</dt>
            <dd><a href={`mailto:${plan.email_to_feedback}`}>{plan.email_to_feedback}</a></dd>

            <dt>Дата</dt>
            <dd>{formatDate(plan.created_at)}</dd>

            <dt>Задача</dt>
            <dd className="long">{plan.task_description}</dd>
          </dl>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={close}>Закрыть</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { close(); dispatch(openPlanReply(plan.uuid)); }}
            >
              Ответить <span className="arrow" />
            </button>
          </div>
        </>
      )}
    </AdminModalShell>
  );
}
