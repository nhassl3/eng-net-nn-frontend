import { SERVICES } from '../../data/services';
import { PipeArt } from '../shared/PipeArt';

export function Services() {
  return (
    <section id="services" className="section-pad reveal">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[01]</span> Услуги</span>
            <h2>Четыре направления — один подрядчик.</h2>
          </div>
          <p className="lede">
            Закрываем весь инженерный пакет от проектирования до сдачи в эксплуатацию.
            Ни одного субподряда, который бы вы не контролировали через нас.
          </p>
        </div>

        <div className="services">
          {SERVICES.map((s) => (
            <div className="service" key={s.ix}>
              <div>
                <span className="ix">/{s.ix}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              <div className="reveal">
                Подробнее{' '}
                <span
                  className="arrow"
                  style={{ width: 12, height: 12, background: 'currentColor', display: 'inline-block' }}
                />
              </div>
              <PipeArt kind={s.art} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
