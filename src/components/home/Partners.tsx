import type { ReactElement } from 'react';
import { PARTNER_BRANDS, type Partner } from '../../data/partners';

const BRAND_GLYPHS: Record<string, ReactElement> = {
  N: <g><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 19 L 9 9 L 19 19 L 19 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
  S: <g><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M18 10 a4 3 0 0 0 -8 0 a3 3 0 0 0 3 3 h2 a3 3 0 0 1 3 3 a4 3 0 0 1 -8 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
  П: <g><rect x="2" y="2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 20 L 8 8 L 20 8 L 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
  L: <g><polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M10 8 L 10 19 L 19 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
  Р: <g><rect x="2" y="2" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 20 L 9 8 L 15 8 a4 4 0 0 1 0 8 L 9 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
  A: <g><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="14" r="3" fill="currentColor"/><ellipse cx="14" cy="14" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2"/><ellipse cx="14" cy="14" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 14 14)"/><ellipse cx="14" cy="14" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 14 14)"/></g>,
  G: <g><rect x="2" y="2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M19 9 a6 6 0 1 0 0 10 L 19 14 L 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
  C: <g><polygon points="14,2 26,14 14,26 2,14" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M19 10 a5 5 0 1 0 0 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
  M: <g><rect x="2" y="2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 20 L 7 8 L 14 16 L 21 8 L 21 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
  O: <g><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.8"/></g>,
  У: <g><rect x="2" y="2" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 8 L 14 16 L 19 8 M 14 16 L 12 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
  E: <g><circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M19 8 L 9 8 L 9 14 L 17 14 L 9 14 L 9 20 L 19 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
};

function BrandLogo({ mark }: { mark: string }) {
  return (
    <svg className="brand-mark" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      {BRAND_GLYPHS[mark] ?? <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

function MarqueeRow({ brands, direction = 'left', speed = 60 }: { brands: Partner[]; direction?: 'left' | 'right'; speed?: number }) {
  const loop = [...brands, ...brands];
  return (
    <div className="marquee">
      <div
        className={`marquee-track${direction === 'right' ? ' marquee-rev' : ''}`}
        style={{ animationDuration: speed + 's' }}
      >
        {loop.map((b, i) => (
          <div className="marquee-chip" key={i}>
            <BrandLogo mark={b.mark} />
            <span>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Partners() {
  const rowA = PARTNER_BRANDS.slice(0, 6);
  const rowB = PARTNER_BRANDS.slice(6);

  return (
    <section className="section-pad-sm reveal">
      <div className="container">
        <div className="sec-head">
          <div>
            <span className="kicker"><span className="num">[05]</span> Партнёры</span>
            <h2>С кем мы работаем годами.</h2>
          </div>
          <p className="lede">
            Не однократные подряды, а долгие отношения с промышленными группами и девелоперами.
            Без NDA не покажем больше, но эти можно.
          </p>
        </div>
      </div>

      <div className="marquee-stage">
        <MarqueeRow brands={rowA} direction="left" speed={48} />
        <MarqueeRow brands={rowB} direction="right" speed={56} />
      </div>
    </section>
  );
}
