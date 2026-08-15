import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '../api/authorization'
import { authStorage } from '../api/authStorage'
import type { User } from '../types/domain'

const CACHED_USER_KEY = 'ipb_cached_user';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!authStorage.getAccessToken()) return null;
    const cached = localStorage.getItem(CACHED_USER_KEY);
    return cached ? (JSON.parse(cached) as User) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const cacheUser = useCallback((u: User | null) => {
    if (u) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = authStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then((u) => {
        if (!cancelled) { setUser(u); cacheUser(u); }
      })
      .catch(() => {
        if (!cancelled) {
          authStorage.clear();
          setUser(null);
          cacheUser(null);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [cacheUser]);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      cacheUser(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, [cacheUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    cacheUser(data.user);
  }, [cacheUser]);

  const register = useCallback(async (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => {
    const data = await apiRegister(name, username, email, password);
    setUser(data.user);
    cacheUser(data.user);
  }, [cacheUser]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    cacheUser(null);
  }, [cacheUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
