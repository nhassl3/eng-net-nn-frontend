import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resolveErrorMessage } from '../../api/errors'
import { useAuth } from '../../context/AuthContext'
import { resolveNext } from './redirect'

interface Props {
  onSwitch: () => void;
}

interface RegistrationForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirm: string;
}

const initialForm: RegistrationForm = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirm: '',
};

type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;

function validate(form: RegistrationForm): RegistrationErrors {
  const er: RegistrationErrors = {};
  if (form.fullName.trim().length < 2) er.fullName = 'Укажите имя';
  if (!usernameRegex.test(form.username)) er.username = 'От 3 до 30 символов: буквы, цифры, _ и -';
  if (!emailRegex.test(form.email)) er.email = 'Введите корректный email';
  if (form.password.length < 8) er.password = 'Пароль должен содержать минимум 8 символов';
  if (form.confirm !== form.password) er.confirm = 'Пароли не совпадают';
  return er;
}

export function Registration({ onSwitch, embedded }: Props & { embedded?: boolean }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<RegistrationErrors>({});

  function updateField<K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const er = validate(form);
    setErrors(er);
    if (Object.keys(er).length) return;

    const { fullName, username, email, password } = form;
    setLoading(true);
    try {
      await register(fullName, username, email, password);
      if (!embedded) navigate(resolveNext(search), { replace: true });
    } catch (err) {
      setError(resolveErrorMessage(err));
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
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          required
        />
        {errors.fullName && <div className="err">{errors.fullName}</div>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-username">Username</label>
        <input
          id="reg-username"
          className="auth-input"
          type="text"
          autoComplete="username"
          placeholder="ivan_ivanov"
          value={form.username}
          onChange={(e) => updateField('username', e.target.value)}
          required
        />
        {errors.username && <div className="err">{errors.username}</div>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
        {errors.email && <div className="err">{errors.email}</div>}
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
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
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
        {errors.password ? <div className="err">{errors.password}</div> : <p className="auth-hint">Минимум 8 символов</p>}
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
            value={form.confirm}
            onChange={(e) => updateField('confirm', e.target.value)}
            required
          />
        </div>
        {errors.confirm && <div className="err">{errors.confirm}</div>}
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
