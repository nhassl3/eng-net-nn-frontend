import { Link } from 'react-router-dom';
import { ErrorPage } from '../components/shared/ErrorPage';

const art = (
  <svg viewBox="0 0 280 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Left pipe */}
    <line x1="20" y1="110" x2="108" y2="110" />
    {/* Right pipe */}
    <line x1="172" y1="110" x2="260" y2="110" />

    {/* Burst / rupture */}
    <path d="M108 110 L116 86 L124 116 L132 78 L140 110 L148 78 L156 116 L164 86 L172 110" />

    {/* Warning triangle */}
    <path d="M140 22 L164 62 L116 62 Z" />
    <line x1="140" y1="34" x2="140" y2="50" />
    <circle cx="140" cy="56" r="2.5" fill="currentColor" stroke="none" />

    {/* Pressure gauge on left pipe */}
    <circle cx="64" cy="110" r="16" />
    <line x1="64" y1="110" x2="73" y2="99" />
    <line x1="64" y1="94" x2="64" y2="98" opacity="0.6" />
    <line x1="80" y1="110" x2="84" y2="110" opacity="0.5" />
    <line x1="48" y1="110" x2="44" y2="110" opacity="0.5" />
    <circle cx="64" cy="110" r="3" fill="currentColor" stroke="none" />

    {/* Pressure gauge on right pipe */}
    <circle cx="216" cy="110" r="12" />
    <line x1="216" y1="110" x2="222" y2="102" />
    <circle cx="216" cy="110" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Внутренний сбой в системе"
      description="На сервере произошла непредвиденная ошибка. Наши специалисты уже работают над устранением неисправности — попробуйте обновить страницу или вернитесь позже."
      art={art}
      actions={
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Обновить страницу <span className="arrow" />
          </button>
          <Link to="/" className="btn btn-ghost">На главную</Link>
        </>
      }
    />
  );
}
