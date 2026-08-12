import { useEffect, useRef } from 'react';

export function CursorBlob() {
  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.body.classList.add('has-cursor');
    const blob = blobRef.current;
    const dot = dotRef.current;
    if (!blob || !dot) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let bx = mx, by = my;
    let dx = mx, dy = my;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onDown = () => blob.classList.add('press');
    const onUp = () => blob.classList.remove('press');

    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false;
      if (el.matches('a, button, input, textarea, select, .vac-item, .marquee-chip, .service, .cert, .case-arrows button, .case-dots button, .seg button, .qm-chip')) return true;
      return false;
    };

    const onOver = (e: MouseEvent) => {
      let el = e.target as Element | null;
      while (el && el !== document.body) {
        if (isInteractive(el)) { blob.classList.add('hover'); return; }
        el = el.parentElement;
      }
      blob.classList.remove('hover');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    let raf: number;
    const tick = () => {
      bx += (mx - bx) * 0.16;
      by += (my - by) * 0.16;
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      blob.style.transform = `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
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

  return (
    <>
      <div ref={blobRef} className="cursor-blob" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
