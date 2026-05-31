import api, { setTokens, clearTokens } from './api.js';

const authService = {
  // ── Register ────────────────────────────────────────────────────────────────
  register: async (fullName, email, password) => {
    const data = await api.post('/auth/register', { fullName, email, password });
    if (data.data?.accessToken) {
      setTokens(data.data.accessToken, data.data.refreshToken);
    }
    return data;
  },

  // ── Login ───────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.data?.accessToken) {
      setTokens(data.data.accessToken, data.data.refreshToken);
    }
    return data;
  },

  // ── Logout ──────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      clearTokens();
    }
  },

  // ── Get current user ─────────────────────────────────────────────────────────
  getMe: async () => {
    const data = await api.get('/auth/me');
    return data.data?.user;
  },

  // ── Update profile ───────────────────────────────────────────────────────────
  updateProfile: async (updates) => {
    const data = await api.put('/auth/profile', updates);
    return data.data?.user;
  },

  // ── Change password ──────────────────────────────────────────────────────────
  changePassword: async (currentPassword, newPassword) => {
    return api.put('/auth/change-password', { currentPassword, newPassword });
  },
};

export default authService;
