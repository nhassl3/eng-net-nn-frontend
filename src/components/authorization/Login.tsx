import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ApiError, resolveErrorMessage } from '../../api/errors'
import { useAuth } from '../../context/AuthContext'

interface Props {
  onSwitch: () => void;
}

export function Login({ onSwitch }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userIn, setUserIn] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(userIn, password);
      navigate('/');
    } catch (err) {
      setError(resolveErrorMessage(err));
      if (err instanceof ApiError && err.status === 401) {
        setFailed(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-panel" key="login" onSubmit={handleSubmit} noValidate>
      {error && <p className="auth-error">{error}</p>}

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email-username">Username или Email</label>
        <input
          id="login-email-username"
          className="auth-input"
          type="text"
          placeholder="you@company.com | username"
          value={userIn}
          onChange={(e) => setUserIn(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">Пароль</label>
        <div className="auth-input-wrap">
          <input
            id="login-password"
            className="auth-input has-toggle"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="auth-toggle-vis"
            aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
            onClick={() => setShowPwd((v) => !v)}
          >
            {showPwd ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading && <span className="auth-spinner" />}
        {loading ? 'Входим...' : 'Войти'}
      </button>

      <p className="auth-switch">
        Нет аккаунта?{' '}
        <button type="button" onClick={onSwitch}>Зарегистрироваться</button>
      </p>

      {failed && (
        <p className="auth-forgot fade-up">
          Забыли пароль?{' '}
          <a href="/auth/forgot-password">Восстановить по email</a>
        </p>
      )}
    </form>
  );
}
