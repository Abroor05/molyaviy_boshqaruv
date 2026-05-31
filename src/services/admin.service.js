import api from './api.js';

const adminService = {
  // ── Dashboard stats ──────────────────────────────────────────────────────────
  getDashboardStats: async () => {
    const data = await api.get('/admin/stats');
    return data.data;
  },

  // ── Get all transactions (barcha userlarniki) ────────────────────────────────
  getAllTransactions: async (params = {}) => {
    const data = await api.get('/admin/transactions', params);
    return data.data;
  },

  // ── Get all users ────────────────────────────────────────────────────────────
  getUsers: async (params = {}) => {
    const data = await api.get('/admin/users', params);
    return data.data;
  },

  // ── Get user by ID ───────────────────────────────────────────────────────────
  getUserById: async (id) => {
    const data = await api.get(`/admin/users/${id}`);
    return data.data;
  },

  // ── Create user ──────────────────────────────────────────────────────────────
  createUser: async (userData) => {
    const data = await api.post('/admin/users', userData);
    return data.data?.user;
  },

  // ── Update user ──────────────────────────────────────────────────────────────
  updateUser: async (id, updates) => {
    const data = await api.put(`/admin/users/${id}`, updates);
    return data.data?.user;
  },

  // ── Delete user ──────────────────────────────────────────────────────────────
  deleteUser: async (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  // ── Toggle user status (block/unblock) ───────────────────────────────────────
  toggleUserStatus: async (id) => {
    const data = await api.patch(`/admin/users/${id}/status`, {});
    return data.data?.user;
  },
};

export default adminService;
