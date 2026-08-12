import { STATS } from '../../data/stats';

export function Stats() {
  return (
    <section id="about" className="section-pad-sm reveal">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[03]</span> О компании</span>
            <h2>Цифры, которые проще проверить, чем оспорить.</h2>
          </div>
          <p className="lede">
            Мы не считаем себя гигантом. Мы — инженерное бюро с собственной строительной службой.
            Достаточно большое, чтобы взять промышленный объект, и достаточно гибкое, чтобы не прятаться за регламентами.
          </p>
        </div>
      </div>
      <div className="container">
        <div className="stats">
          {STATS.map((s, i) => (
            <div className="stat" key={i}>
              <div className="v">
                {s.v}
                {s.sup && <sup>{s.sup}</sup>}
              </div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
