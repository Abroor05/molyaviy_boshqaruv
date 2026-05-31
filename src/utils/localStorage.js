/**
 * LocalStorage utility functions
 */

const KEYS = {
  USER: 'pfm_user',
  USERS: 'pfm_users',
  TRANSACTIONS: 'pfm_transactions',
  THEME: 'pfm_theme',
  SETTINGS: 'pfm_settings',
  AUTH_TOKEN: 'pfm_auth_token',
};

export { KEYS };

export function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearAll() {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}

// Specific helpers
export function getTheme() {
  return getItem(KEYS.THEME) || 'light';
}

export function setTheme(theme) {
  return setItem(KEYS.THEME, theme);
}

export function getCurrentUser() {
  return getItem(KEYS.USER);
}

export function setCurrentUser(user) {
  return setItem(KEYS.USER, user);
}

export function removeCurrentUser() {
  return removeItem(KEYS.USER);
}

export function getUsers() {
  return getItem(KEYS.USERS) || [];
}

export function setUsers(users) {
  return setItem(KEYS.USERS, users);
}

export function getTransactions() {
  return getItem(KEYS.TRANSACTIONS) || [];
}

export function setTransactions(transactions) {
  return setItem(KEYS.TRANSACTIONS, transactions);
}

export function getSettings() {
  return getItem(KEYS.SETTINGS) || {
    notifications: true,
    emailNotifications: false,
    currency: 'USD',
    language: 'en',
  };
}

export function setSettings(settings) {
  return setItem(KEYS.SETTINGS, settings);
}
