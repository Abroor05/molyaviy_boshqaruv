import api from './api.js';

const expenseService = {
  // ── Get expenses (with filters) ──────────────────────────────────────────────
  getExpenses: async (params = {}) => {
    const data = await api.get('/expenses', params);
    return data.data;
  },

  // ── Get expense stats ────────────────────────────────────────────────────────
  getStats: async () => {
    const data = await api.get('/expenses/stats');
    return data.data;
  },

  // ── Create expense ───────────────────────────────────────────────────────────
  createExpense: async (expenseData) => {
    const data = await api.post('/expenses', expenseData);
    return data.data?.expense;
  },

  // ── Update expense ───────────────────────────────────────────────────────────
  updateExpense: async (id, expenseData) => {
    const data = await api.put(`/expenses/${id}`, expenseData);
    return data.data?.expense;
  },

  // ── Delete expense ───────────────────────────────────────────────────────────
  deleteExpense: async (id) => {
    return api.delete(`/expenses/${id}`);
  },
};

export default expenseService;
