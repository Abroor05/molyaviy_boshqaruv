import api from './api.js';

const incomeService = {
  // ── Get incomes (with filters) ───────────────────────────────────────────────
  getIncomes: async (params = {}) => {
    const data = await api.get('/incomes', params);
    return data.data;
  },

  // ── Get income stats ─────────────────────────────────────────────────────────
  getStats: async () => {
    const data = await api.get('/incomes/stats');
    return data.data;
  },

  // ── Create income ────────────────────────────────────────────────────────────
  createIncome: async (incomeData) => {
    const data = await api.post('/incomes', incomeData);
    return data.data?.income;
  },

  // ── Update income ────────────────────────────────────────────────────────────
  updateIncome: async (id, incomeData) => {
    const data = await api.put(`/incomes/${id}`, incomeData);
    return data.data?.income;
  },

  // ── Delete income ────────────────────────────────────────────────────────────
  deleteIncome: async (id) => {
    return api.delete(`/incomes/${id}`);
  },
};

export default incomeService;
