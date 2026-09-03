import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveVacancy } from '../../store/slices/vacancySlice';
import type { VacancyWithJd } from '../../types/domain';
import { useInfiniteScroll } from '../admin/useInfiniteScroll';

interface VacancyListProps {
  vacancies: VacancyWithJd[];
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => void;
}

const salaryFormatter = new Intl.NumberFormat('ru-RU');

export function VacancyList({ vacancies, hasMore, loading, loadingMore, loadMore }: VacancyListProps) {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.vacancy.activeId);

  // callback-ref вместо useRef: элемент появляется после первого рендера, а observer в
  // useInfiniteScroll должен пересоздаться именно в момент, когда .vac-list смонтирован.
  const [listEl, setListEl] = useState<HTMLDivElement | null>(null);
  const sentinelRef = useInfiniteScroll(hasMore && !loadingMore, loadMore, listEl);

  useEffect(() => {
    if (!activeId && vacancies.length > 0) dispatch(setActiveVacancy(vacancies[0].uuid));
  }, [activeId, vacancies, dispatch]);

  return (
    <div>
      <span className="kicker" style={{ marginBottom: 16, display: 'inline-block' }}>
        <span className="num">[01]</span> Открытые позиции · {vacancies.length}{hasMore ? '+' : ''}
      </span>
      <div className="vac-list" ref={setListEl}>
        {vacancies.map((v) => (
          <div
            key={v.uuid}
            className={`vac-item${v.uuid === activeId ? ' active' : ''}`}
            onClick={() => dispatch(setActiveVacancy(v.uuid))}
          >
            <div className="row1">
              <h3>{v.name}</h3>
              <span className="salary">от {salaryFormatter.format(v.pay_day)} ₽</span>
            </div>
            <div className="meta">
              <span>{v.jd_name}</span>
              <span>·</span>
              <span>{v.required_exp}</span>
            </div>
            {v.uuid === activeId && (
              <div style={{ marginTop: 12, color: 'var(--fg-soft)', fontSize: 14 }}>
                {v.description}
                <ul style={{ margin: '12px 0 0', paddingLeft: 16, fontSize: 13, lineHeight: 1.65 }}>
                  {v.skills.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}

        {loading && <p className="vac-load-more">Загружаем вакансии…</p>}
        {!loading && vacancies.length === 0 && <p className="vac-load-more">Открытых позиций сейчас нет.</p>}

        {hasMore && (
          <div ref={sentinelRef} className="vac-load-more">
            {loadingMore && 'Загружаем ещё…'}
          </div>
        )}
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
