import { TOKEN_KEY, USER_KEY } from './constants';
export const storage = {
  setToken: (t) => t && localStorage.setItem(TOKEN_KEY, t),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  setUser: (u) => u && localStorage.setItem(USER_KEY, JSON.stringify(u)),
  getUser: () => { const d = localStorage.getItem(USER_KEY); return d ? JSON.parse(d) : null; },
  removeUser: () => localStorage.removeItem(USER_KEY),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
};
