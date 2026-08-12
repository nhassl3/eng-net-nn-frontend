import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveVacancy } from '../../store/slices/vacancySlice';
import { VACANCIES } from '../../data/vacancies';

export function VacancyList() {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.vacancy.activeId);

  return (
    <div>
      <span className="kicker" style={{ marginBottom: 16, display: 'inline-block' }}>
        <span className="num">[01]</span> Открытые позиции · {VACANCIES.length}
      </span>
      <div className="vac-list">
        {VACANCIES.map((v) => (
          <div
            key={v.id}
            className={`vac-item${v.id === activeId ? ' active' : ''}`}
            onClick={() => dispatch(setActiveVacancy(v.id))}
          >
            <div className="row1">
              <h3>{v.title}</h3>
              <span className="salary">{v.salary}</span>
            </div>
            <div className="meta">
              <span>{v.dept}</span>
              <span>·</span>
              <span>{v.location}</span>
              <span>·</span>
              <span>{v.type}</span>
            </div>
            {v.id === activeId && (
              <div style={{ marginTop: 12, color: 'var(--fg-soft)', fontSize: 14 }}>
                {v.desc}
                <ul style={{ margin: '12px 0 0', paddingLeft: 16, fontSize: 13, lineHeight: 1.65 }}>
                  {v.requirements.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
        <span className="kicker"><span className="num">/ нет подходящей?</span></span>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--fg-soft)' }}>
          Пришлите резюме на{' '}
          <a href="mailto:hr@ipbuilding.ru" style={{ color: 'var(--accent)' }}>hr@ipbuilding.ru</a>{' '}
          — мы расширяем команду круглый год.
        </p>
      </div>
    </div>
  );
}
