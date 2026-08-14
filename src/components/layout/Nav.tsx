import { useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); }, [location.pathname]);

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

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const t = setTimeout(() => scrollToSection(id), 50);
      return () => clearTimeout(t);
    }
  }, [location]);

  const close = () => setOpen(false);
  const isActive = (path: string) => location.pathname === path;

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    close();
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleCTA = () => { close(); dispatch(openQuote()); };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="nav-logo" to="/" aria-label="IPBuilding" onClick={close}>
          <LogoMark />
        </Link>
        <nav className="nav-links">
          <a href="/#services" onClick={(e) => handleSectionClick(e, 'services')}>Услуги</a>
          <a href="/#cases" onClick={(e) => handleSectionClick(e, 'cases')}>Кейсы</a>
          <a href="/#about" onClick={(e) => handleSectionClick(e, 'about')}>О компании</a>
          <Link to="/vacancies" className={isActive('/vacancies') ? 'active' : ''}>Вакансии</Link>
        </nav>
        <Link to="/auth" className={`nav-auth${isActive('/auth') ? ' active' : ''}`}>Войти</Link>
        <button type="button" className="nav-cta" onClick={handleCTA}>
          <span className="dot" />
          Получить КП
        </button>
        <button
          type="button"
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav-mobile${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="nav-mobile-inner">
          <a href="/#services" onClick={(e) => handleSectionClick(e, 'services')}>Услуги</a>
          <a href="/#cases" onClick={(e) => handleSectionClick(e, 'cases')}>Кейсы</a>
          <a href="/#about" onClick={(e) => handleSectionClick(e, 'about')}>О компании</a>
          <Link to="/vacancies" className={isActive('/vacancies') ? 'active' : ''} onClick={close}>
            Вакансии
          </Link>
          <Link to="/auth" className={isActive('/auth') ? 'active' : ''} onClick={close}>
            Войти
          </Link>
          <div className="nav-mobile-cta">
            <button type="button" className="nav-cta" onClick={handleCTA}>
              <span className="dot" />
              Получить КП
            </button>
          </div>
        </div>
      </div>

      <span ref={progRef} className="nav-progress" />
    </header>
  );
}
