import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe } from '../api/authorization'
import { authStorage, EXPIRY_SKEW_MS } from '../api/authStorage'
import { refreshSession } from '../api/client'
import { ADMIN_ROLE, type User } from '../types/domain'

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Access-токен живёт только в памяти, поэтому на старте сессии нет по
  // определению — её поднимает bootstrap ниже.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Поднимает сессию по httpOnly-куке: refresh даёт access-токен, /api/me —
   * актуального пользователя вместе с ролью. Роль берём только с сервера:
   * кешировать её на клиенте нельзя, её правят через devtools.
   */
  const restore = useCallback(async (): Promise<User | null> => {
    if (!(await refreshSession())) return null;
    return getMe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    restore()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => {
        if (!cancelled) {
          authStorage.clear();
          setUser(null);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [restore]);

  useEffect(() => {
    const handleExpired = () => {
      authStorage.clear();
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, []);

  /**
   * Проактивное обновление за минуту до истечения: без него вкладка, которая
   * просто открыта и ничего не запрашивает, узнаёт о протухшем токене только
   * при следующем клике — и первый же запрос уходит в 401.
   */
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    const schedule = () => {
      const delay = Math.max(authStorage.msUntilExpiry() - EXPIRY_SKEW_MS, 1_000);
      timerRef.current = window.setTimeout(async () => {
        if (await refreshSession()) {
          schedule();
        } else {
          window.dispatchEvent(new Event('auth:session-expired'));
        }
      }, delay);
    };

    // Вкладка могла спать в фоне — её таймеры браузер тормозит, поэтому при
    // возврате проверяем срок отдельно.
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !authStorage.isExpiringSoon()) return;
      refreshSession().then((ok) => {
        if (!ok) window.dispatchEvent(new Event('auth:session-expired'));
      });
    };

    schedule();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user]);

  // Кука общая на все вкладки, поэтому вход и выход в одной должны отражаться в остальных.
  useEffect(() => authStorage.subscribe((kind) => {
    if (kind === 'logout') {
      authStorage.clear();
      setUser(null);
      return;
    }
    restore().then(setUser).catch(() => setUser(null));
  }), [restore]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    setUser(data.user);
    authStorage.broadcast('login');
  }, []);

  const register = useCallback(async (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => {
    const data = await apiRegister({ full_name: name, username: username, email: email, password: password });
    setUser(data.user);
    authStorage.broadcast('login');
  }, []);

  const logout = useCallback(async () => {
    // Сервер мог отозвать токены раньше нас — из сессии уходим в любом случае.
    try { await apiLogout(); } catch { /* empty */ }
    authStorage.clear();
    setUser(null);
    authStorage.broadcast('logout');
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === ADMIN_ROLE,
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
