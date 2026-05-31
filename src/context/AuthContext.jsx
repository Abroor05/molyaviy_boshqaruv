import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers } from '../utils/dummyData';
import { generateId } from '../utils/helpers';
import authService from '../services/auth.service.js';
import { getAccessToken, clearTokens } from '../services/api.js';

const AuthContext = createContext();

// API mode: VITE_USE_API=true bo'lsa real backend ishlatiladi
const USE_API = import.meta.env.VITE_USE_API === 'true';

// ── LocalStorage migration (eski data tozalash) ───────────────────────────────
const migrateStorage = () => {
  try {
    const storedUsers = localStorage.getItem('pfm_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      const hasOldData = parsed.some(u => !u.role);
      if (hasOldData) {
        localStorage.removeItem('pfm_users');
        localStorage.removeItem('pfm_user');
        localStorage.removeItem('pfm_incomes');
        localStorage.removeItem('pfm_expenses');
        sessionStorage.removeItem('pfm_user');
      }
    }
    const storedUser = localStorage.getItem('pfm_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (!parsed.role) {
        localStorage.removeItem('pfm_user');
        sessionStorage.removeItem('pfm_user');
      }
    }
  } catch {
    localStorage.removeItem('pfm_users');
    localStorage.removeItem('pfm_user');
  }
};

migrateStorage();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    if (USE_API) return [];
    const stored = localStorage.getItem('pfm_users');
    return stored ? JSON.parse(stored) : dummyUsers;
  });
  const [loading, setLoading] = useState(true);

  // ── Init: sessiyani tiklash ───────────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      if (USE_API) {
        // API mode: token bor bo'lsa getMe chaqir
        const token = getAccessToken();
        if (token) {
          try {
            const me = await authService.getMe();
            setUser(me);
          } catch {
            clearTokens();
          }
        }
      } else {
        // LocalStorage mode
        const ls = localStorage.getItem('pfm_user');
        const ss = sessionStorage.getItem('pfm_user');
        if (ls) setUser(JSON.parse(ls));
        else if (ss) setUser(JSON.parse(ss));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // LocalStorage sync (non-API mode)
  useEffect(() => {
    if (!USE_API) {
      localStorage.setItem('pfm_users', JSON.stringify(users));
    }
  }, [users]);

  // ── Login ─────────────────────────────────────────────────────────────────────
  const login = async (email, password, remember) => {
    if (USE_API) {
      try {
        const data = await authService.login(email, password);
        const loggedUser = data.data?.user;
        setUser(loggedUser);
        return { success: true, role: loggedUser?.role?.toLowerCase() };
      } catch (err) {
        return { success: false, message: err.message || "Email yoki parol noto'g'ri" };
      }
    } else {
      // LocalStorage mode
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) return { success: false, message: "Email yoki parol noto'g'ri" };
      if (found.status === 'inactive') return { success: false, message: "Hisobingiz bloklangan. Admin bilan bog'laning." };
      setUser(found);
      if (remember) localStorage.setItem('pfm_user', JSON.stringify(found));
      else sessionStorage.setItem('pfm_user', JSON.stringify(found));
      return { success: true, role: found.role };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────────
  const register = async (fullName, email, password) => {
    if (USE_API) {
      try {
        const data = await authService.register(fullName, email, password);
        const newUser = data.data?.user;
        setUser(newUser);
        return { success: true, role: newUser?.role?.toLowerCase() };
      } catch (err) {
        return { success: false, message: err.message || "Ro'yxatdan o'tishda xato" };
      }
    } else {
      const exists = users.find(u => u.email === email);
      if (exists) return { success: false, message: "Bu email allaqachon ro'yxatdan o'tgan" };
      const newUser = {
        id: generateId(),
        fullName,
        email,
        password,
        role: 'user',
        avatar: null,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      localStorage.setItem('pfm_user', JSON.stringify(newUser));
      return { success: true, role: 'user' };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (USE_API) {
      try { await authService.logout(); } catch { /* ignore */ }
    } else {
      localStorage.removeItem('pfm_user');
      sessionStorage.removeItem('pfm_user');
    }
    setUser(null);
  };

  // ── Update profile ────────────────────────────────────────────────────────────
  const updateProfile = async (updates) => {
    if (USE_API) {
      try {
        const updated = await authService.updateProfile(updates);
        setUser(updated);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('pfm_user', JSON.stringify(updated));
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updates } : u));
      return { success: true };
    }
  };

  // ── Change password ───────────────────────────────────────────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    if (USE_API) {
      try {
        await authService.changePassword(currentPassword, newPassword);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      if (user.password !== currentPassword) return { success: false, message: "Joriy parol noto'g'ri" };
      await updateProfile({ password: newPassword });
      return { success: true };
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────────
  const deleteAccount = async () => {
    if (!USE_API) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
    await logout();
  };

  // ── Admin: manage users (LocalStorage mode only) ──────────────────────────────
  const adminUpdateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const adminDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const adminCreateUser = (fullName, email, password, role = 'user') => {
    const exists = users.find(u => u.email === email);
    if (exists) return { success: false, message: "Bu email allaqachon mavjud" };
    const newUser = {
      id: generateId(),
      fullName,
      email,
      password,
      role,
      avatar: null,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';
  const isUser  = user?.role === 'user'  || user?.role === 'USER';

  return (
    <AuthContext.Provider value={{
      user, users, isAdmin, isUser, loading,
      login, register, logout,
      updateProfile, changePassword, deleteAccount,
      adminUpdateUser, adminDeleteUser, adminCreateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
