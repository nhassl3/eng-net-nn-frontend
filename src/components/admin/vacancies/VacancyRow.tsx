import type { VacancyWithJd } from '../../../types/domain'
import { formatDate, formatExp, formatMoney } from '../format'

interface Props {
  item: VacancyWithJd;
  respondCount: number | null;
  onView: () => void;
  onResponds: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VacancyRow({ item: vacancy, respondCount, onView, onResponds, onEdit, onDelete }: Props) {
  return (
    <article className="admin-row" onClick={onView}>
      <div className="admin-row-main">
        <h3>{vacancy.name}</h3>
        <div className="admin-row-meta">
          {vacancy.jd_name && <span className="admin-badge accent">{vacancy.jd_name}</span>}
          <span>{formatMoney(vacancy.pay_day)}</span>
          <span>Опыт: {formatExp(vacancy.required_exp)}</span>
          <span>от {formatDate(vacancy.created_at)}</span>
          {respondCount !== null && respondCount > 0 && (
            <span className="admin-badge">{respondCount} откл.</span>
          )}
        </div>
        {vacancy.description && <p className="admin-row-excerpt">{vacancy.description}</p>}
        {vacancy.jd_description && (
          <p className="admin-row-excerpt" style={{ color: 'var(--fg-muted)' }}>{vacancy.jd_description}</p>
        )}
        {vacancy.jd_tags && vacancy.jd_tags.length > 0 && (
          <div className="qm-chips">
            {vacancy.jd_tags.map((t) => (
              <span key={t} className="qm-chip">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="admin-row-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn" onClick={onResponds}>
          Отклики{respondCount !== null && respondCount > 0 ? ` · ${respondCount}` : ''}
        </button>
        <button type="button" className="icon-btn" onClick={onEdit}>Изменить</button>
        <button type="button" className="icon-btn danger" onClick={onDelete}>Удалить</button>
      </div>
    </article>
  );
}
