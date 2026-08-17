import { useEffect, useRef } from 'react'

const supportsHover = typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, .vac-item, .marquee-chip, .service, .cert, .case-arrows button, .case-dots button, .seg button, .qm-chip';

// Below this distance (px) the blob/dot are considered to have caught up —
// the rAF loop stops instead of running forever at 60fps while idle.
const SETTLE_EPSILON = 0.1;

export function CursorBlob() {
  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supportsHover) return;

    document.body.classList.add('has-cursor');
    const blob = blobRef.current;
    const dot = dotRef.current;
    if (!blob || !dot) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blobEase = reducedMotion ? 1 : 0.16;
    const dotEase = reducedMotion ? 1 : 0.45;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2; // mouse position
    let bx = mx, by = my; // blob position
    let dx = mx, dy = my; // dot position
    let lastBx = NaN, lastBy = NaN, lastDx = NaN, lastDy = NaN;

    let raf = 0;
    let running = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onDown = () => blob.classList.add('press');
    const onUp = () => blob.classList.remove('press');

    let isHovering = false;
    const onOver = (e: MouseEvent) => {
      const hovering = (e.target as Element | null)?.closest(INTERACTIVE_SELECTOR) != null;
      if (hovering === isHovering) return;
      isHovering = hovering;
      blob.classList.toggle('hover', hovering);
      dot.classList.toggle('hover', hovering);
      if (!hovering) {
        // Dot was frozen while hidden during hover — snap it to the cursor
        // (not the blob) so it reappears exactly where it would have settled.
        dx = mx; dy = my;
        const rdx = Math.round(dx * 10) / 10, rdy = Math.round(dy * 10) / 10;
        dot.style.translate = `${rdx}px ${rdy}px`;
        lastDx = rdx; lastDy = rdy;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    function tick() {
      bx += (mx - bx) * blobEase;
      by += (my - by) * blobEase;
      dx += (mx - dx) * dotEase;
      dy += (my - dy) * dotEase;

      const rbx = Math.round(bx * 10) / 10, rby = Math.round(by * 10) / 10;
      const rdx = Math.round(dx * 10) / 10, rdy = Math.round(dy * 10) / 10;
      if (rbx !== lastBx || rby !== lastBy) {
        blob!.style.translate = `${rbx}px ${rby}px`;
        lastBx = rbx; lastBy = rby;
      }
      if (rdx !== lastDx || rdy !== lastDy) {
        dot!.style.translate = `${rdx}px ${rdy}px`;
        lastDx = rdx; lastDy = rdy;
      }

      const settled = Math.abs(mx - bx) < SETTLE_EPSILON && Math.abs(my - by) < SETTLE_EPSILON &&
        Math.abs(mx - dx) < SETTLE_EPSILON && Math.abs(my - dy) < SETTLE_EPSILON;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    running = true;
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  if (!supportsHover) return null;

  return (
    <>
      <div ref={blobRef} className="cursor-blob" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
