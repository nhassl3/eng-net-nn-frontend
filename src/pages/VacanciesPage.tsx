import { useEffect } from 'react'
import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'
import { VacancyForm } from '../components/vacancies/VacancyForm'
import { VacancyHero } from '../components/vacancies/VacancyHero'
import { VacancyList } from '../components/vacancies/VacancyList'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useVacancyList } from '../hooks/useVacancyList'

export function VacanciesPage() {
  useScrollReveal();
  const { vacancies, hasMore, loading, loadingMore, loadMore } = useVacancyList();

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
              <VacancyList vacancies={vacancies} hasMore={hasMore} loading={loading} loadingMore={loadingMore} loadMore={loadMore} />
              <VacancyForm vacancies={vacancies} loading={loading} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
