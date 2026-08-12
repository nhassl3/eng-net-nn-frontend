import { useAppDispatch } from '../../store/hooks';
import { openQuote } from '../../store/slices/modalSlice';

export function CTA() {
  const dispatch = useAppDispatch();

  return (
    <section id="contact" className="section-pad-sm reveal">
      <div className="container">
        <div className="cta-strip">
          <div>
            <span className="kicker" style={{ color: 'rgba(250,250,247,0.55)' }}>
              <span className="num">[06]</span> Связь
            </span>
            <h2>
              Расскажите про объект — <em>пришлём смету за 1 день</em>.
            </h2>
          </div>
          <div>
            <p>Опишите площадку, сроки и тип работ. Инженер свяжется в течение часа в рабочее время и согласует выезд.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(openQuote())}
            >
              Запросить КП <span className="arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
