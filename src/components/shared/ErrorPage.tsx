import { useEffect, type ReactNode } from 'react'
import { Footer } from '../layout/Footer'
import { Nav } from '../layout/Nav'

interface Props {
  code: string;
  title: string;
  description: string;
  art: ReactNode;
  actions: ReactNode;
}

export function ErrorPage({ code, title, description, art, actions }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute('data-style', 'b');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => { document.body.classList.remove('loaded'); };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <section className="error-page">
          <div className="container">
            <div className="error-content">
              <div>
                <span className="kicker">
                  <span className="num">// ОШИБКА {code}</span>
                </span>
                <h1 className="error-title">{title}</h1>
                <p className="error-desc">{description}</p>
                <div className="error-actions">{actions}</div>
              </div>
              <div className="error-art" aria-hidden="true">{art}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
