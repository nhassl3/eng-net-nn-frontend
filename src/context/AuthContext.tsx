import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe } from '../api/authorization'
import { authStorage } from '../api/authStorage'
import { ADMIN_ROLE, type User } from '../types/domain'

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!authStorage.getAccessToken()) return null;
    return authStorage.getUser();
  });
  const [isLoading, setIsLoading] = useState(() => !!authStorage.getAccessToken());

  useEffect(() => {
    let cancelled = false;
    const token = authStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then((u) => {
        if (!cancelled) {
          authStorage.setUser(u);
          setUser(u);
        }
      })
      .catch(() => {
        if (!cancelled) {
          authStorage.clear();
          setUser(null);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    authStorage.setUser(data.user);
    setUser(data.user);
  }, []);

  const register = useCallback(async (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => {
    const data = await apiRegister({ full_name: name, username: username, email: email, password: password });
    authStorage.setUser(data.user);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, isAdmin: user?.role === ADMIN_ROLE, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
