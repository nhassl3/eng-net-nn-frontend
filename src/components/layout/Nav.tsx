import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoMark } from '../shared/LogoMark';
import { useAppDispatch } from '../../store/hooks';
import { openQuote } from '../../store/slices/modalSlice';

export function Nav() {
  const progRef = useRef<HTMLSpanElement>(null);
  const dispatch = useAppDispatch();
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="nav-logo" to="/" aria-label="IPBuilding">
          <LogoMark />
        </Link>
        <nav className="nav-links">
          <Link to="/#services" className={isActive('/') ? '' : ''}>Услуги</Link>
          <Link to="/#cases">Кейсы</Link>
          <Link to="/#about">О компании</Link>
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
