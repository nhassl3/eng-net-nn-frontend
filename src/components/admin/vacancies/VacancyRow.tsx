import type { Vacancy } from '../../../types/domain'
import { formatDate, formatExp, formatMoney } from '../format'

interface Props {
  vacancy: Vacancy;
  respondCount: number | null;
  onView: () => void;
  onResponds: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VacancyRow({ vacancy, respondCount, onView, onResponds, onEdit, onDelete }: Props) {
  return (
    <article className="admin-row">
      <div className="admin-row-main">
        <h3>{vacancy.name}</h3>
        <div className="admin-row-meta">
          <span>{formatMoney(vacancy.pay_day)}</span>
          <span>Опыт: {formatExp(vacancy.required_exp)}</span>
          <span>от {formatDate(vacancy.created_at)}</span>
          {respondCount !== null && respondCount > 0 && (
            <span className="admin-badge accent">{respondCount} откл.</span>
          )}
        </div>
        {vacancy.description && <p className="admin-row-excerpt">{vacancy.description}</p>}
      </div>

      <div className="admin-row-actions">
        <button type="button" className="icon-btn" onClick={onView}>Просмотр</button>
        <button type="button" className="icon-btn" onClick={onResponds}>
          Отклики{respondCount !== null && respondCount > 0 ? ` · ${respondCount}` : ''}
        </button>
        <button type="button" className="icon-btn" onClick={onEdit}>Изменить</button>
        <button type="button" className="icon-btn danger" onClick={onDelete}>Удалить</button>
      </div>
    </article>
  );
}
