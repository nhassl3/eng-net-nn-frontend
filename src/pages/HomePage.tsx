import { useEffect } from 'react';
import { BlueprintBackground } from '../components/layout/BlueprintBackground';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { Services } from '../components/home/Services';
import { Cases } from '../components/home/Cases';
import { Stats } from '../components/home/Stats';
import { Certs } from '../components/home/Certs';
import { Partners } from '../components/home/Partners';
import { CTA } from '../components/home/CTA';
import { QuoteModal } from '../components/home/QuoteModal';
import { CursorBlob } from '../components/shared/CursorBlob';
import { useBackgroundEffects } from '../hooks/useBackgroundEffects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAppSelector } from '../store/hooks';

export function HomePage() {
  useBackgroundEffects();
  useScrollReveal();
  const quoteOpen = useAppSelector((s) => s.modal.quoteOpen);

  useEffect(() => {
    document.documentElement.setAttribute('data-style', 'b');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => { document.body.classList.remove('loaded'); };
  }, []);

  return (
    <>
      <div className={quoteOpen ? 'app-blur' : ''}>
        <BlueprintBackground />
        <Nav />
        <main>
          <Hero />
          <Services />
          <Cases />
          <Stats />
          <Certs />
          <Partners />
          <CTA />
        </main>
        <Footer />
      </div>
      <QuoteModal />
      <CursorBlob />
    </>
  );
}
