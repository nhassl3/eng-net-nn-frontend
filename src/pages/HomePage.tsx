import { useEffect } from 'react'
import { Cases } from '../components/home/Cases'
import { Certs } from '../components/home/Certs'
import { CertsModal } from '../components/home/CertsModal'
import { CTA } from '../components/home/CTA'
import { Hero } from '../components/home/Hero'
import { Partners } from '../components/home/Partners'
import { QuoteModal } from '../components/home/QuoteModal'
import { Services } from '../components/home/Services'
import { ServicesModal } from '../components/home/ServicesModal'
import { Stats } from '../components/home/Stats'
import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAppSelector } from '../store/hooks'

export function HomePage() {
  useScrollReveal();
  const quoteOpen = useAppSelector((s) => s.modal.quoteOpen);
  const serviceIx = useAppSelector((s) => s.modal.serviceIx);
  const certsIdx = useAppSelector((s) => s.modal.certsIdx);

  useEffect(() => {
    document.documentElement.setAttribute('data-style', 'b');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => { document.body.classList.remove('loaded'); };
  }, []);

  return (
    <>
      <div className={`app-shell${quoteOpen || serviceIx !== null || certsIdx !== null ? ' app-blur' : ''}`}>
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
      <ServicesModal />
      <CertsModal />
    </>
  );
}
