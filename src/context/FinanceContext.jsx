import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dummyIncomes, dummyExpenses } from '../utils/dummyData';
import { generateId } from '../utils/helpers';
import incomeService from '../services/income.service.js';
import expenseService from '../services/expense.service.js';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

const USE_API = import.meta.env.VITE_USE_API === 'true';

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();

  const [incomes, setIncomes] = useState(() => {
    if (USE_API) return [];
    const stored = localStorage.getItem('pfm_incomes');
    return stored ? JSON.parse(stored) : dummyIncomes;
  });

  const [expenses, setExpenses] = useState(() => {
    if (USE_API) return [];
    const stored = localStorage.getItem('pfm_expenses');
    return stored ? JSON.parse(stored) : dummyExpenses;
  });

  const [loadingIncomes,  setLoadingIncomes]  = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [error, setError] = useState(null);

  // ── LocalStorage sync (non-API mode) ─────────────────────────────────────────
  useEffect(() => {
    if (!USE_API) {
      localStorage.setItem('pfm_incomes', JSON.stringify(incomes));
    }
  }, [incomes]);

  useEffect(() => {
    if (!USE_API) {
      localStorage.setItem('pfm_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // ── API mode: user login bo'lganda ma'lumotlarni yuklash ─────────────────────
  const fetchIncomes = useCallback(async () => {
    if (!USE_API || !user) return;
    setLoadingIncomes(true);
    try {
      const data = await incomeService.getIncomes({ limit: 200 });
      // API dan kelgan date string → local format
      const mapped = (data.incomes || []).map(i => ({
        ...i,
        date: i.date ? i.date.split('T')[0] : i.date,
        userId: i.userId || user.id,
      }));
      setIncomes(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingIncomes(false);
    }
  }, [user]);

  const fetchExpenses = useCallback(async () => {
    if (!USE_API || !user) return;
    setLoadingExpenses(true);
    try {
      const data = await expenseService.getExpenses({ limit: 200 });
      const mapped = (data.expenses || []).map(e => ({
        ...e,
        date: e.date ? e.date.split('T')[0] : e.date,
        userId: e.userId || user.id,
      }));
      setExpenses(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingExpenses(false);
    }
  }, [user]);

  useEffect(() => {
    if (USE_API && user) {
      fetchIncomes();
      fetchExpenses();
    }
  }, [user, fetchIncomes, fetchExpenses]);

  // ── User-scoped helpers ───────────────────────────────────────────────────────
  const getIncomesByUser  = useCallback((userId) => incomes.filter(i => i.userId === userId), [incomes]);
  const getExpensesByUser = useCallback((userId) => expenses.filter(e => e.userId === userId), [expenses]);

  // ── Add income ────────────────────────────────────────────────────────────────
  const addIncome = async (data, userId) => {
    if (USE_API) {
      try {
        const created = await incomeService.createIncome({
          ...data,
          date: data.date,
        });
        const mapped = {
          ...created,
          date: created.date ? created.date.split('T')[0] : created.date,
          userId: created.userId || userId,
        };
        setIncomes(prev => [mapped, ...prev]);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      setIncomes(prev => [{ ...data, id: generateId(), userId }, ...prev]);
      return { success: true };
    }
  };

  // ── Delete income ─────────────────────────────────────────────────────────────
  const deleteIncome = async (id) => {
    if (USE_API) {
      try {
        await incomeService.deleteIncome(id);
        setIncomes(prev => prev.filter(i => i.id !== id));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      setIncomes(prev => prev.filter(i => i.id !== id));
      return { success: true };
    }
  };

  // ── Add expense ───────────────────────────────────────────────────────────────
  const addExpense = async (data, userId) => {
    if (USE_API) {
      try {
        const created = await expenseService.createExpense({
          ...data,
          date: data.date,
        });
        const mapped = {
          ...created,
          date: created.date ? created.date.split('T')[0] : created.date,
          userId: created.userId || userId,
        };
        setExpenses(prev => [mapped, ...prev]);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      setExpenses(prev => [{ ...data, id: generateId(), userId }, ...prev]);
      return { success: true };
    }
  };

  // ── Delete expense ────────────────────────────────────────────────────────────
  const deleteExpense = async (id) => {
    if (USE_API) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      setExpenses(prev => prev.filter(e => e.id !== id));
      return { success: true };
    }
  };

  // ── Global totals (admin) ─────────────────────────────────────────────────────
  const totalIncome  = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const balance      = totalIncome - totalExpense;

  const transactions = [
    ...incomes.map(i  => ({ ...i, type: 'income'  })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <FinanceContext.Provider value={{
      incomes, expenses, transactions,
      totalIncome, totalExpense, balance,
      loadingIncomes, loadingExpenses, error,
      getIncomesByUser, getExpensesByUser,
      addIncome, deleteIncome,
      addExpense, deleteExpense,
      refetchIncomes: fetchIncomes,
      refetchExpenses: fetchExpenses,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
