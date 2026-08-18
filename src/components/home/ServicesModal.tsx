import { useEffect, useRef } from 'react'
import { SERVICES, SERVICES_LEARN_MORE } from '../../data/services'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeServiceModal, openQuote } from '../../store/slices/modalSlice'

export function ServicesModal() {
  const dispatch = useAppDispatch();
  const serviceIx = useAppSelector((s) => s.modal.serviceIx);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!serviceIx) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(closeServiceModal()); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [serviceIx, dispatch]);

  useEffect(() => {
    if (!serviceIx) return;
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el || !thumb || !track) return;

    const update = () => {
      const overflowing = el.scrollHeight > el.clientHeight + 1;
      track.style.display = overflowing ? 'block' : 'none';
      if (!overflowing) return;
      const thumbRatio = el.clientHeight / el.scrollHeight;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = maxScroll ? el.scrollTop / maxScroll : 0;
      thumb.style.height = thumbRatio * 100 + '%';
      thumb.style.top = ratio * (100 - thumbRatio * 100) + '%';
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [serviceIx]);

  if (!serviceIx) return null;

  const service = SERVICES.find((s) => s.ix === serviceIx);
  const detail = SERVICES_LEARN_MORE[serviceIx];
  if (!service || !detail) return null;

  const close = () => dispatch(closeServiceModal());

  const requestQuote = () => {
    dispatch(closeServiceModal());
    dispatch(openQuote(service.dir));
  };

  return (
    <div className="qm-overlay" onClick={close}>
      <div className="qm-shell sm-shell" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="qm-close" onClick={close} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="sm-scroll" ref={scrollRef}>
          <span className="kicker"><span className="num">/{service.ix}</span> · Услуга</span>
          <h2>{service.t}</h2>
          <p className="qm-lede">{detail.summary}</p>

          <div className="field">
            <label>Что входит в работу</label>
            <ul className="sm-list">
              {detail.scope.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="field">
            <label>Материалы и оборудование</label>
            <ul className="sm-list">
              {detail.materials.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="field">
            <label>Нормативная база</label>
            <div className="qm-chips">
              {detail.norms.map((n) => <span className="qm-chip" key={n}>{n}</span>)}
            </div>
          </div>

          <button type="button" className="btn-submit" onClick={requestQuote}>
            Запросить КП по направлению «{service.t}» <span className="arrow" />
          </button>
        </div>

        <div className="sm-scrollbar-track" ref={trackRef}>
          <div className="sm-scrollbar-thumb" ref={thumbRef} />
        </div>
      </div>
    </div>
  );
}
