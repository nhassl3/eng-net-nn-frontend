import type { VacancyJd } from '../../../types/domain'

interface Props {
  item: VacancyJd;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VacancyJdRow({ item: vacancy, onView, onEdit, onDelete }: Props) {
  return (
    <article className="admin-row" onClick={onView}>
      <div className="admin-row-main">
        <h3>{vacancy.jd_name}</h3>
        {vacancy.jd_description && <p className="admin-row-excerpt">{vacancy.jd_description}</p>}
        {vacancy.jd_tags && vacancy.jd_tags.length > 0 && (
          <div className="qm-chips">
            {vacancy.jd_tags.map((t) => (
              <span key={t} className="qm-chip">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="admin-row-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn" onClick={onEdit}>Изменить</button>
        <button type="button" className="icon-btn danger" onClick={onDelete}>Удалить</button>
      </div>
    </article>
  );
}
