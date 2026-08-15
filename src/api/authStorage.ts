import type { User } from '../types/domain';

const KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
  user: 'ipb_user',
} as const;

export const authStorage = {
  getAccessToken: () => localStorage.getItem(KEYS.access),
  getRefreshToken: () => localStorage.getItem(KEYS.refresh),

  getUser: (): User | null => {
    const raw = localStorage.getItem(KEYS.user);
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  },

  setTokens: (tokens: { access_token: string; refresh_token: string }) => {
    localStorage.setItem(KEYS.access, tokens.access_token);
    localStorage.setItem(KEYS.refresh, tokens.refresh_token);
  },

  setUser: (user: User) => {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    localStorage.removeItem(KEYS.user);
  },
};
