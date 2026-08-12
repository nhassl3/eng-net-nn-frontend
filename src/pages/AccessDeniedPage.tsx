import { Link } from 'react-router-dom';
import { ErrorPage } from '../components/shared/ErrorPage';

const art = (
  <svg viewBox="0 0 280 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Left pipe */}
    <line x1="20" y1="118" x2="104" y2="118" />
    {/* Left flange */}
    <line x1="104" y1="100" x2="104" y2="136" strokeWidth="5" />

    {/* Right pipe */}
    <line x1="176" y1="118" x2="260" y2="118" />
    {/* Right flange */}
    <line x1="176" y1="100" x2="176" y2="136" strokeWidth="5" />

    {/* Gate valve housing */}
    <rect x="104" y="80" width="72" height="76" rx="3" />

    {/* Closed gate — X */}
    <line x1="120" y1="95" x2="160" y2="141" />
    <line x1="160" y1="95" x2="120" y2="141" />

    {/* Valve stem */}
    <line x1="140" y1="80" x2="140" y2="50" />

    {/* Handwheel */}
    <circle cx="140" cy="38" r="16" />
    <line x1="124" y1="38" x2="156" y2="38" />
    <line x1="140" y1="22" x2="140" y2="54" />
    <line x1="129" y1="27" x2="151" y2="49" opacity="0.55" />
    <line x1="151" y1="27" x2="129" y2="49" opacity="0.55" />
    <circle cx="140" cy="38" r="5" fill="currentColor" stroke="none" />
  </svg>
);

export function AccessDeniedPage() {
  return (
    <ErrorPage
      code="403"
      title="Доступ к объекту закрыт"
      description="У вас нет прав для просмотра этой страницы. Если вы считаете, что это ошибка — свяжитесь с администратором или вернитесь на главную."
      art={art}
      actions={
        <>
          <Link to="/" className="btn btn-primary">
            На главную <span className="arrow" />
          </Link>
          <a href="mailto:hello@ipbuilding.ru" className="btn btn-ghost">Написать нам</a>
        </>
      }
    />
  );
}
