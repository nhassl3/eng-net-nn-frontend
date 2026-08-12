import { useEffect } from 'react';

export function useBackgroundEffects() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mx', x + '%');
      document.documentElement.style.setProperty('--my', y + '%');
    };
    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty('--scroll', y + 'px');
      const max = document.body.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, max ? y / max : 0));
      document.documentElement.style.setProperty('--scroll-progress', (p * 100) + '%');
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
