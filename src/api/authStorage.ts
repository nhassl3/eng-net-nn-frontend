const KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;

export const authStorage = {
  getAccessToken: () => localStorage.getItem(KEYS.access),
  getRefreshToken: () => localStorage.getItem(KEYS.refresh),

  setTokens: (tokens: { access_token: string; refresh_token: string }) => {
    localStorage.setItem(KEYS.access, tokens.access_token);
    localStorage.setItem(KEYS.refresh, tokens.refresh_token);
  },

  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
  },
};
