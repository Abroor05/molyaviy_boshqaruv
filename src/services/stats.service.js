import api from './api.js';

const statsService = {
  // ── Get user statistics ──────────────────────────────────────────────────────
  // months: 3 | 6 | 12
  getUserStats: async (months = 6) => {
    const data = await api.get('/stats', { months });
    return data.data;
  },
};

export default statsService;
