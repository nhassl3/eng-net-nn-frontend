import { useEffect } from 'react'
import { Cases } from '../components/home/Cases'
import { Certs } from '../components/home/Certs'
import { CTA } from '../components/home/CTA'
import { Hero } from '../components/home/Hero'
import { Partners } from '../components/home/Partners'
import { QuoteModal } from '../components/home/QuoteModal'
import { Services } from '../components/home/Services'
import { Stats } from '../components/home/Stats'
import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAppSelector } from '../store/hooks'

export function HomePage() {
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
    </>
  );
}
