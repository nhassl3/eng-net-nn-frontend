import { useEffect } from 'react'
import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'
import { VacancyForm } from '../components/vacancies/VacancyForm'
import { VacancyHero } from '../components/vacancies/VacancyHero'
import { VacancyList } from '../components/vacancies/VacancyList'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { CursorBlob } from '../components/shared/CursorBlob';
import { useBackgroundEffects } from '../hooks/useBackgorundEffects';

export function VacanciesPage() {
  useBackgroundEffects();
  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute('data-style', 'b');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => { document.body.classList.remove('loaded'); };
  }, []);

  return (
    <>
      <Nav />
      <VacancyHero />
      <main>
        <section className="section-pad-sm" style={{ paddingTop: 24 }}>
          <div className="container">
            <div className="vac-grid">
              <VacancyList />
              <VacancyForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CursorBlob />
    </>
  );
}
