// Base API instance — native fetch wrapper
// Token localStorage dan olinadi, 401 da refresh qilinadi

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem('pfm_access_token');
export const getRefreshToken = () => localStorage.getItem('pfm_refresh_token');
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('pfm_access_token',  accessToken);
  localStorage.setItem('pfm_refresh_token', refreshToken);
};
export const clearTokens = () => {
  localStorage.removeItem('pfm_access_token');
  localStorage.removeItem('pfm_refresh_token');
};

// ── Refresh token ─────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
};

// ── Core request function ─────────────────────────────────────────────────────
const request = async (endpoint, options = {}, retry = true) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(url, config);

  // Token muddati tugagan — refresh qilish
  if (res.status === 401 && retry) {
    if (isRefreshing) {
      // Boshqa so'rov refresh kutmoqda
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then(newToken => {
        return request(endpoint, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        }, false);
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      isRefreshing = false;
      return request(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
      }, false);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;
      clearTokens();
      // Login sahifasiga yo'naltirish
      window.location.href = '/login';
      throw err;
    }
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Server xatosi');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ── HTTP methods ──────────────────────────────────────────────────────────────
export const api = {
  get: (endpoint, params) => {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return request(url, { method: 'GET' });
  },

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, { method: 'DELETE' }),
};

export default api;
