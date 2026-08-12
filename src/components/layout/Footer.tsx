import { Link } from 'react-router-dom';
import { LogoMark } from '../shared/LogoMark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <LogoMark />
            <p className="lede">Инженерные сети и коммуникации полного цикла. Проектирование, монтаж и пусконаладка с 2008 года.</p>
          </div>
          <div>
            <h5>Компания</h5>
            <ul>
              <li><Link to="/#about">О нас</Link></li>
              <li><Link to="/#cases">Проекты</Link></li>
              <li><Link to="/vacancies">Вакансии</Link></li>
              <li><a href="#">Сертификаты</a></li>
            </ul>
          </div>
          <div>
            <h5>Услуги</h5>
            <ul>
              <li><a href="#">Водоснабжение</a></li>
              <li><a href="#">Отопление</a></li>
              <li><a href="#">Газоснабжение</a></li>
              <li><a href="#">Вентиляция</a></li>
            </ul>
          </div>
          <div>
            <h5>Контакты</h5>
            <ul>
              <li><a href="tel:+78000000000">+7 (800) 000-00-00</a></li>
              <li><a href="mailto:hello@ipbuilding.ru">hello@ipbuilding.ru</a></li>
              <li>Нижний Новгород, ул. Большая Печёрская, 32</li>
              <li>Пн–Пт 9:00 — 19:00</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2008–2026 IPBuilding</span>
          <span>СРО-С-262-26072013</span>
        </div>
      </div>
    </footer>
  );
}
