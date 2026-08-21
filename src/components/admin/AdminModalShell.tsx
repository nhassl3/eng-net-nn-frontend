import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useModalChrome } from '../../hooks/useModalChrome'

interface Props {
  open: boolean;
  onClose: () => void;
  kicker: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Прокручиваемое тело — для длинных списков и детальных карточек */
  scroll?: boolean;
  /** Модалка открыта поверх другой (ответ поверх списка откликов) */
  stacked?: boolean;
}

/**
 * Общий каркас модалок админки.
 * Повторяет разметку QuoteModal/ServicesModal и добавляет то, чего им не хватает:
 * aria-labelledby, фокус при открытии и возврат фокуса при закрытии.
 */
export function AdminModalShell({
  open, onClose, kicker, title, lede, children, footer, scroll, stacked,
}: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useModalChrome(open, onClose);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { restoreRef.current?.focus?.(); };
  }, [open]);

  if (!open) return null;

  const body = (
    <>
      <span className="kicker"><span className="num">/ {kicker}</span> · IPBuilding</span>
      <h2 id={titleId}>{title}</h2>
      {lede && <p className="qm-lede">{lede}</p>}
      {children}
      {footer}
    </>
  );

  return (
    <div
      className={`qm-overlay${stacked ? ' qm-stacked' : ''}`}
      onClick={onClose}
    >
      <div
        className={`qm-shell${scroll ? ' sm-shell' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button ref={closeRef} className="qm-close" onClick={onClose} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        {scroll ? <div className="sm-scroll">{body}</div> : body}
      </div>
    </div>
  );
}
