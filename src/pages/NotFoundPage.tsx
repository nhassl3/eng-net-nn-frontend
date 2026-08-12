import { Link } from 'react-router-dom';
import { ErrorPage } from '../components/shared/ErrorPage';

const art = (
  <svg viewBox="0 0 280 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Left pipe */}
    <line x1="20" y1="90" x2="108" y2="90" />
    {/* Left flange */}
    <line x1="108" y1="70" x2="108" y2="110" strokeWidth="5" />
    <circle cx="108" cy="79" r="3.5" fill="none" strokeWidth="1.5" />
    <circle cx="108" cy="101" r="3.5" fill="none" strokeWidth="1.5" />

    {/* Right pipe */}
    <line x1="172" y1="90" x2="260" y2="90" />
    {/* Right flange */}
    <line x1="172" y1="70" x2="172" y2="110" strokeWidth="5" />
    <circle cx="172" cy="79" r="3.5" fill="none" strokeWidth="1.5" />
    <circle cx="172" cy="101" r="3.5" fill="none" strokeWidth="1.5" />

    {/* Ghost dashes across gap */}
    <line x1="113" y1="90" x2="167" y2="90" strokeDasharray="6 5" opacity="0.35" strokeWidth="2" />

    {/* Missing segment indicator */}
    <line x1="133" y1="78" x2="147" y2="102" />
    <line x1="147" y1="78" x2="133" y2="102" />

    {/* Decorative vertical branch + node */}
    <circle cx="56" cy="90" r="4" fill="currentColor" stroke="none" />
    <line x1="56" y1="86" x2="56" y2="54" />
    <line x1="56" y1="54" x2="86" y2="54" />
    <circle cx="86" cy="54" r="9" />
    <circle cx="86" cy="54" r="3.5" fill="currentColor" stroke="none" />

    {/* Small elbow on right pipe */}
    <circle cx="220" cy="90" r="4" fill="currentColor" stroke="none" />
    <line x1="220" y1="86" x2="220" y2="124" />
    <line x1="220" y1="124" x2="254" y2="124" opacity="0.4" strokeDasharray="5 4" />
  </svg>
);

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Маршрут не найден в схеме"
      description="Запрошенная страница не существует или была перемещена. Возможно, вы перешли по устаревшей ссылке — проверьте адрес или вернитесь на главную."
      art={art}
      actions={
        <>
          <Link to="/" className="btn btn-primary">
            На главную <span className="arrow" />
          </Link>
          <Link to="/#services" className="btn btn-ghost">Наши услуги</Link>
        </>
      }
    />
  );
}
