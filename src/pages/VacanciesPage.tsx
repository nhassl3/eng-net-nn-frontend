import { useEffect } from 'react';
import { BlueprintBackground } from '../components/layout/BlueprintBackground';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { VacancyHero } from '../components/vacancies/VacancyHero';
import { VacancyList } from '../components/vacancies/VacancyList';
import { VacancyForm } from '../components/vacancies/VacancyForm';
import { CursorBlob } from '../components/shared/CursorBlob';
import { useBackgroundEffects } from '../hooks/useBackgroundEffects';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
      <BlueprintBackground />
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
