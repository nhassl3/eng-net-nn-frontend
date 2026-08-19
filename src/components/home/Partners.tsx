import { useRef } from 'react';
import { PARTNER_BRANDS, type Partner } from '../../data/partners';

function PartnerItem({ partner, hidden }: { partner: Partner; hidden?: boolean }) {
  return (
    <li className="partner-item">
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : 0}
        aria-hidden={hidden || undefined}
      >
        {partner.logo ? (
          <img className="partner-logo" src={partner.logo} alt={partner.name} loading="lazy" width={120} height={40} />
        ) : (
          <span className="partner-logo partner-logo-text">{partner.name}</span>
        )}
        <span className="partner-name">{partner.name}</span>
      </a>
    </li>
  );
}

function MarqueeRow({ brands, reverse = false, speed = 60 }: { brands: Partner[]; reverse?: boolean; speed?: number }) {
  return (
    <div className="marquee">
      <div
        className={`marquee-track${reverse ? ' marquee-rev' : ''}`}
        style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}
      >
        <ul className="marquee-group">
          {brands.map((b) => (
            <PartnerItem key={b.slug} partner={b} />
          ))}
        </ul>
        <ul className="marquee-group" aria-hidden="true">
          {brands.map((b) => (
            <PartnerItem key={`${b.slug}-dup`} partner={b} hidden />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Partners() {
  const rowA = PARTNER_BRANDS.slice(0, 6);
  const rowB = PARTNER_BRANDS.slice(6);
  const stageRef = useRef<HTMLDivElement>(null);

  const pauseForSwipe = () => stageRef.current?.classList.add('marquee-swiping');
  const resumeAfterSwipe = () => stageRef.current?.classList.remove('marquee-swiping');

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

      <div className="marquee-wrap">
        <div
          className="marquee-stage"
          ref={stageRef}
          onPointerDown={pauseForSwipe}
          onPointerUp={resumeAfterSwipe}
          onPointerCancel={resumeAfterSwipe}
          onPointerLeave={resumeAfterSwipe}
        >
          <MarqueeRow brands={rowA} speed={48} />
          <MarqueeRow brands={rowB} reverse speed={56} />
        </div>
      </div>
    </section>
  );
}
