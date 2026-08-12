import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoMark } from '../shared/LogoMark';
import { useAppDispatch } from '../../store/hooks';
import { openQuote } from '../../store/slices/modalSlice';

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Nav() {
  const progRef = useRef<HTMLSpanElement>(null);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, max ? window.scrollY / max : 0));
      if (progRef.current) progRef.current.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to hash anchor after navigation from another page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Wait for page to render before scrolling
      const t = setTimeout(() => scrollToSection(id), 50);
      return () => clearTimeout(t);
    }
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="nav-logo" to="/" aria-label="IPBuilding">
          <LogoMark />
        </Link>
        <nav className="nav-links">
          <a href="/#services" onClick={(e) => handleSectionClick(e, 'services')}>Услуги</a>
          <a href="/#cases" onClick={(e) => handleSectionClick(e, 'cases')}>Кейсы</a>
          <a href="/#about" onClick={(e) => handleSectionClick(e, 'about')}>О компании</a>
          <Link to="/vacancies" className={isActive('/vacancies') ? 'active' : ''}>Вакансии</Link>
        </nav>
        <button
          type="button"
          className="nav-cta"
          onClick={() => dispatch(openQuote())}
        >
          <span className="dot" />
          Получить КП
        </button>
        <span ref={progRef} className="nav-progress" />
      </div>
    </header>
  );
}
