import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setNetworkType, setLength } from '../../store/slices/calculatorSlice';
import { NETWORK_INFO } from '../../data/calculator';

function SmoothSlider({ min, max, step, value, onChange }: {
  min: number; max: number; step: number; value: number; onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef(value);
  const [display, setDisplay] = useState(value);
  const [drag, setDrag] = useState(false);

  useEffect(() => { targetRef.current = value; }, [value]);

  useEffect(() => {
    let last = display;
    const tick = () => {
      const t = targetRef.current;
      const next = last + (t - last) * 0.18;
      if (Math.abs(t - next) < 0.5) { last = t; setDisplay(t); rafRef.current = 0; return; }
      last = next;
      setDisplay(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (display !== value) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const fromClient = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    let v = min + p * (max - min);
    v = Math.round(v / step) * step;
    return Math.max(min, Math.min(max, v));
  };

  const onDown = (e: React.MouseEvent) => {
    setDrag(true);
    onChange(fromClient(e.clientX));
    e.preventDefault();
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e: MouseEvent) => onChange(fromClient(e.clientX));
    const up = () => setDrag(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [drag]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct = ((display - min) / (max - min)) * 100;

  return (
    <div className="smooth-slider" ref={trackRef} onMouseDown={onDown}>
      <div className="ss-track" />
      <div className="ss-fill" style={{ width: pct + '%' }} />
      <div className="ss-thumb" style={{ left: pct + '%' }}>
        <div className="ss-thumb-dot" />
      </div>
    </div>
  );
}

export function Calculator() {
  const dispatch = useAppDispatch();
  const { networkType, length } = useAppSelector((s) => s.calculator);
  const [hoverType, setHoverType] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const info = NETWORK_INFO[networkType];
  const hovered = hoverType ? NETWORK_INFO[hoverType] : null;
  const total = Math.round((info.rate * length) / 1000) * 1000;
  const fmt = (n: number) => n.toLocaleString('ru-RU');

  const onSegEnter = (k: string) => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoverType(k), 450);
  };
  const onSegLeave = () => { clearTimeout(hoverTimerRef.current); setHoverType(null); };

  return (
    <section id="calc" className="section-pad">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[04]</span> Расчёт стоимости</span>
            <h2>Ориентировочная смета за 30 секунд.</h2>
          </div>
          <p className="lede">
            Не финальная цифра, но первая разумная. Точная стоимость — после выезда инженера и согласования объёма работ.
          </p>
        </div>

        <div className="calc">
          <div className="calc-form">
            <h3>Параметры объекта</h3>

            <div className="calc-field">
              <div className="label">Тип сети</div>
              <div className="seg">
                {([['water', 'Вода'], ['heat', 'Тепло'], ['gas', 'Газ']] as const).map(([k, l]) => (
                  <button
                    key={k}
                    className={networkType === k ? 'active' : ''}
                    onClick={() => dispatch(setNetworkType(k))}
                    onMouseEnter={() => onSegEnter(k)}
                    onMouseLeave={onSegLeave}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className={`net-tip${hovered ? ' show' : ''}`}>
                {hovered && (
                  <>
                    <div className="net-tip-head">
                      <h4>{hovered.label}</h4>
                      <span className="net-tip-rate">от {fmt(hovered.rate)} ₽/м</span>
                    </div>
                    <div className="net-tip-row">
                      <span className="net-tip-key">Материал</span>
                      <span className="net-tip-val">{hovered.material}</span>
                    </div>
                    <div className="net-tip-row net-tip-row-col">
                      <span className="net-tip-key">Что влияет на цену</span>
                      <ul className="net-tip-list">
                        {hovered.factors.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="calc-field">
              <div className="label">
                <span>Протяжённость, м</span>
                <span className="value-tag">{fmt(length)} м</span>
              </div>
              <SmoothSlider min={50} max={5000} step={50} value={length} onChange={(v) => dispatch(setLength(v))} />
            </div>
          </div>

          <div className="calc-out">
            <div>
              <div className="out-label">Ориентировочная стоимость</div>
              <div className="out-price" style={{ marginTop: 8 }}>
                {fmt(total)}<small>₽</small>
              </div>
            </div>

            <div className="breakdown">
              <div><span>Тип сети</span><span>{info.label}</span></div>
              <div><span>Базовая ставка</span><span>{fmt(info.rate)} ₽/м</span></div>
              <div><span>Объём работ</span><span>{fmt(length)} м</span></div>
            </div>

            <button className="btn-out">
              Получить точный расчёт <span className="arrow" style={{ background: 'currentColor' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
