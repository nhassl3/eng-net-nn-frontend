import { useEffect, useState } from 'react'
import { Login } from '../components/authorization/Login'
import { Registration } from '../components/authorization/Registration'
import { Nav } from '../components/layout/Nav'
import '../styles/authorization.css'

type Mode = 'login' | 'register';

export function AuthorizationPage() {
  const [mode, setMode] = useState<Mode>('login');

  useEffect(() => {
    document.documentElement.setAttribute('data-style', 'b');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => { document.body.classList.remove('loaded'); };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <section className="auth-page">
          <div className="auth-card">
            <div className="auth-card-inner">
              <div className="auth-kicker">
                <span className="auth-kicker-dot" />
                IPBuilding / {mode === 'login' ? 'Вход' : 'Регистрация'}
              </div>

              <div
                className="auth-tabs"
                role="tablist"
                aria-label="Режим авторизации"
              >
                <button
                  role="tab"
                  aria-selected={mode === 'login'}
                  className={`auth-tab${mode === 'login' ? ' active' : ''}`}
                  onClick={() => setMode('login')}
                >
                  Войти
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={`auth-tab${mode === 'register' ? ' active' : ''}`}
                  onClick={() => setMode('register')}
                >
                  Регистрация
                </button>
              </div>

              {mode === 'login' ? (
                <Login key="login" onSwitch={() => setMode('register')} />
              ) : (
                <Registration key="register" onSwitch={() => setMode('login')} />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
