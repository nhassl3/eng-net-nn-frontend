import type { Plan } from '../../../types/domain'
import { formatDate, planDirectionLabel } from '../format'

interface Props {
  plan: Plan;
  onView: () => void;
  onReply: () => void;
}

export function PlanRow({ plan, onView, onReply }: Props) {
  return (
    <article className="admin-row">
      <div className="admin-row-main">
        <h3>{plan.full_name}</h3>
        <div className="admin-row-meta">
          <span className="admin-badge accent">{planDirectionLabel(plan.direction)}</span>
          <span>{plan.email_to_feedback}</span>
          <span>от {formatDate(plan.created_at)}</span>
        </div>
        <p className="admin-row-excerpt">{plan.task_description}</p>
      </div>

      <div className="admin-row-actions">
        <button type="button" className="icon-btn" onClick={onView}>Просмотр</button>
        <button type="button" className="icon-btn" onClick={onReply}>Ответить</button>
      </div>
    </article>
  );
}
