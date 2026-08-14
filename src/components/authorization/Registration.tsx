import { useState } from 'react';
import { register } from '../../api/authorization';

interface Props {
  onSwitch: () => void;
}

export function Registration({ onSwitch }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // TODO: store token / redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  }

  const eyeIcon = (visible: boolean) =>
    visible ? (
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
    );

  return (
    <form className="auth-panel" key="register" onSubmit={handleSubmit} noValidate>
      {error && <p className="auth-error">{error}</p>}

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-name">Имя</label>
        <input
          id="reg-name"
          className="auth-input"
          type="text"
          autoComplete="name"
          placeholder="Иван Иванов"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-password">Пароль</label>
        <div className="auth-input-wrap">
          <input
            id="reg-password"
            className="auth-input has-toggle"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
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
            {eyeIcon(showPwd)}
          </button>
        </div>
        <p className="auth-hint">Минимум 8 символов</p>
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-confirm">Повтор пароля</label>
        <div className="auth-input-wrap">
          <input
            id="reg-confirm"
            className="auth-input has-toggle"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
      </div>

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading && <span className="auth-spinner" />}
        {loading ? 'Регистрируем...' : 'Создать аккаунт'}
      </button>

      <p className="auth-switch">
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onSwitch}>Войти</button>
      </p>
    </form>
  );
}
