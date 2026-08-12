import { useAppDispatch } from '../../store/hooks';
import { openQuote } from '../../store/slices/modalSlice';

export function Hero() {
  const dispatch = useAppDispatch();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="fade-up">
            <span className="kicker">
              <span className="num">// 2008</span> · Нижний Новгород
            </span>
            <h1>
              Инженерные сети<br />
              для тех, кто строит <em>всерьёз</em>
            </h1>
          </div>
          <div className="hero-meta fade-up d2">
            <p>
              Проектирование, монтаж и пусконаладка инженерных коммуникаций для промышленных и гражданских объектов.
              Полный цикл, собственная техника, бригады с допусками СРО.
            </p>
            <div className="hero-cta-row">
              <a href="#cases" className="btn btn-primary">
                Смотреть проекты <span className="arrow" />
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => dispatch(openQuote())}
              >
                Запросить КП
              </button>
            </div>
          </div>
        </div>

        <div className="hero-marquee fade-up d4">
          <div className="item"><span className="label">Проектов</span><span className="val">240+</span></div>
          <div className="item"><span className="label">Допуск</span><span className="val">СРО · ISO 9001</span></div>
          <div className="item"><span className="label">География</span><span className="val">14 регионов РФ</span></div>
          <div className="item"><span className="label">Гарантия</span><span className="val">до 5 лет</span></div>
        </div>
      </div>
    </section>
  );
}
