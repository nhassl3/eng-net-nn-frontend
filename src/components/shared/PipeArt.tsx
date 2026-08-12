import type { ReactElement } from 'react';
import type { ArtKind } from '../../data/services';

const arts: Record<string, ReactElement> = {
  water: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M10 30 H50 a8 8 0 0 1 8 8 V70 a8 8 0 0 0 8 8 H110" />
      <circle cx="58" cy="38" r="4" fill="currentColor" />
      <circle cx="66" cy="78" r="4" fill="currentColor" />
    </g>
  ),
  heat: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M20 80 Q 30 40, 50 60 T 90 40 T 130 60" />
      <path d="M20 100 Q 30 60, 50 80 T 90 60 T 130 80" opacity=".6" />
    </g>
  ),
  power: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M30 20 L 60 60 L 40 60 L 70 100" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="100" cy="80" r="14" />
    </g>
  ),
  gas: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="20" y="40" width="80" height="50" rx="4" />
      <circle cx="40" cy="65" r="6" />
      <circle cx="80" cy="65" r="6" />
      <path d="M100 50 H120" />
    </g>
  ),
  vent: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <circle cx="60" cy="60" r="22" />
      <path d="M60 38 V82 M38 60 H82" />
      <circle cx="60" cy="60" r="6" fill="currentColor" />
    </g>
  ),
};

export function PipeArt({ kind }: { kind: ArtKind }) {
  return (
    <svg className="pipe-art" viewBox="0 0 120 120" width="140" height="140">
      {arts[kind] ?? arts.water}
    </svg>
  );
}
