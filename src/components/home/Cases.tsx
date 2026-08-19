import { useEffect } from 'react'
import { CASES } from '../../data/cases'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { next, prev, setIndex } from '../../store/slices/casesSlice'

const SLIDE_DELAY = 3000;

export function Cases() {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((s) => s.cases.activeIndex);

  useEffect(() => {
    const id = setInterval(() => dispatch(next()), SLIDE_DELAY);
    return () => clearInterval(id);
  }, [activeIndex, dispatch]);

  return (
    <section id="cases" className="section-pad reveal">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[02]</span> Кейсы</span>
            <h2>Объекты, на которых мы стояли в касках.</h2>
          </div>
          <p className="lede">
            Промышленность, медицина, логистика, жильё. Каждый проект — это согласование сроков, бюджетов и людей.
            Часто работаем без остановки производства заказчика.
          </p>
        </div>

        <div className="cases-stage">
          <div
            className="cases-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {CASES.map((c, i) => (
              <div className="case" key={i}>
                <div className="case-vis">
                  <div className="placeholder">
                    <img src={c.photo} alt={c.label} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                  </div>
                </div>
                <div className="case-info">
                  <div>
                    <span className="kicker">
                      <span className="num">
                        {String(i + 1).padStart(2, '0')}/{String(CASES.length).padStart(2, '0')}
                      </span>
                    </span>
                    <h3>{c.title}</h3>
                    <p className="desc">{c.desc}</p>
                  </div>
                  <div>
                    <div className="case-stats">
                      {c.stats.map((s, j) => (
                        <div className="case-stat" key={j}>
                          <div className="v">{s.v}</div>
                          <div className="l">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="case-controls">
                      <div className="case-dots">
                        {CASES.map((_, j) => (
                          <button
                            key={j}
                            className={j === activeIndex ? 'active' : ''}
                            onClick={() => dispatch(setIndex(j))}
                            aria-label={`Кейс ${j + 1}`}
                          />
                        ))}
                      </div>
                      <div className="case-arrows">
                        <button className="left" onClick={() => dispatch(prev())} aria-label="Назад">
                          <span className="arrow" />
                        </button>
                        <button onClick={() => dispatch(next())} aria-label="Вперёд">
                          <span className="arrow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
