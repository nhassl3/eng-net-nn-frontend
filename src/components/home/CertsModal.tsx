import { useEffect, useRef } from 'react'
import { CERTS, CERTS_DETAIL } from '../../data/certs'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeCertsModal } from '../../store/slices/modalSlice'

export function CertsModal() {
  const dispatch = useAppDispatch();
  const certsIdx = useAppSelector((s) => s.modal.certsIdx);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!certsIdx) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(closeCertsModal()); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [certsIdx, dispatch]);

  useEffect(() => {
    if (!certsIdx) return;
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
  }, [certsIdx]);

  if (!certsIdx) return null;

  const cert = CERTS.find((c) => c.idx === certsIdx);
  const detail = CERTS_DETAIL[certsIdx];
  if (!cert || !detail) return null;

  const close = () => dispatch(closeCertsModal());

  return (
    <div className="qm-overlay" onClick={close}>
      <div className="qm-shell sm-shell" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="qm-close" onClick={close} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="sm-scroll" ref={scrollRef}>
          <span className="kicker"><span className="num">/{cert.idx}</span> · Сертификат</span>
          <h2>{cert.t}</h2>
          <p className="qm-lede">{detail.scope[0]}</p>

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
        </div>

        <div className="sm-scrollbar-track" ref={trackRef}>
          <div className="sm-scrollbar-thumb" ref={thumbRef} />
        </div>
      </div>
    </div>
  );
}
