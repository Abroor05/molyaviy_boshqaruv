import React, { useMemo, useState, useEffect } from 'react';
import {
  MdPeople, MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet,
  MdPersonAdd, MdSwapHoriz,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { formatCurrency, isCurrentMonth } from '../../../utils/helpers';
import { MonthlyBarChart } from '../../../components/ChartContainer/ChartContainer';
import { MONTHS } from '../../../utils/constants';
import { getMonthYear } from '../../../utils/helpers';
import adminService from '../../../services/admin.service.js';
import './AdminDashboard.css';

const USE_API = import.meta.env.VITE_USE_API === 'true';

const AdminDashboard = () => {
  const { users } = useAuth();
  const { incomes, expenses, transactions, totalIncome, totalExpense, balance } = useFinance();

  const [apiStats, setApiStats] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  // ── API mode: admin stats ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!USE_API) return;
    const fetchStats = async () => {
      setLoadingApi(true);
      try {
        const data = await adminService.getDashboardStats();
        setApiStats(data);
      } catch (err) {
        console.error('Admin stats error:', err);
      } finally {
        setLoadingApi(false);
      }
    };
    fetchStats();
  }, []);

  // ── LocalStorage mode ─────────────────────────────────────────────────────────
  const regularUsers = users.filter(u => u.role === 'user' || u.role === 'USER');
  const activeUsers  = regularUsers.filter(u => u.status === 'active' || u.status === 'ACTIVE');

  const monthlyIncome  = useMemo(() => incomes.filter(i => isCurrentMonth(i.date)).reduce((s, i) => s + i.amount, 0), [incomes]);
  const monthlyExpense = useMemo(() => expenses.filter(e => isCurrentMonth(e.date)).reduce((s, e) => s + e.amount, 0), [expenses]);

  const chartData = useMemo(() => {
    if (USE_API && apiStats?.monthlyChart) {
      return apiStats.monthlyChart.map(item => ({
        month: MONTHS[parseInt(item.month.split('-')[1]) - 1],
        income: item.income,
        expense: item.expense,
      }));
    }
    const map = {};
    incomes.forEach(i => {
      const k = getMonthYear(i.date);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      map[k].income += i.amount;
    });
    expenses.forEach(e => {
      const k = getMonthYear(e.date);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      map[k].expense += e.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => {
        const [, m] = key.split('-');
        return { month: MONTHS[parseInt(m) - 1], ...val };
      });
  }, [incomes, expenses, apiStats]);

  const topUsers = useMemo(() => {
    return regularUsers.map(u => {
      const inc = incomes.filter(i => i.userId === u.id).reduce((s, i) => s + i.amount, 0);
      const exp = expenses.filter(e => e.userId === u.id).reduce((s, e) => s + e.amount, 0);
      return { ...u, totalIncome: inc, totalExpense: exp, balance: inc - exp };
    }).sort((a, b) => b.totalIncome - a.totalIncome).slice(0, 5);
  }, [regularUsers, incomes, expenses]);

  // ── Summary cards data ────────────────────────────────────────────────────────
  const stats = USE_API && apiStats ? {
    totalUsers:    apiStats.users?.total        ?? 0,
    activeUsers:   apiStats.users?.active       ?? 0,
    newUsers:      apiStats.users?.newThisMonth ?? 0,
    totalIncome:   apiStats.finance?.totalIncome   ?? 0,
    totalExpense:  apiStats.finance?.totalExpense  ?? 0,
    balance:       apiStats.finance?.balance       ?? 0,
    monthlyIncome: apiStats.finance?.monthlyIncome ?? 0,
    monthlyExpense:apiStats.finance?.monthlyExpense?? 0,
    totalTx:       apiStats.finance?.totalTransactions ?? 0,
  } : {
    totalUsers:    regularUsers.length,
    activeUsers:   activeUsers.length,
    newUsers:      regularUsers.filter(u => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
    totalTx: transactions.length,
  };

  const summaryCards = [
    { title: 'Jami Foydalanuvchilar', value: stats.totalUsers,   sub: `${stats.activeUsers} ta faol`,                                Icon: MdPeople,               color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
    { title: 'Jami Daromad',          value: formatCurrency(stats.totalIncome),  sub: `Bu oy: ${formatCurrency(stats.monthlyIncome)}`,  Icon: MdTrendingUp,           color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { title: 'Jami Xarajat',          value: formatCurrency(stats.totalExpense), sub: `Bu oy: ${formatCurrency(stats.monthlyExpense)}`, Icon: MdTrendingDown,         color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { title: 'Umumiy Balans',          value: formatCurrency(stats.balance),      sub: 'Barcha userlar',                                 Icon: MdAccountBalanceWallet, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { title: 'Tranzaksiyalar',         value: stats.totalTx,                      sub: 'Jami yozuvlar',                                  Icon: MdSwapHoriz,            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { title: 'Yangi Userlar',          value: stats.newUsers,                     sub: "Bu oy ro'yxatdan o'tgan",                        Icon: MdPersonAdd,            color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-dashboard__welcome">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Tizimning umumiy holati va statistikasi</p>
        </div>
      </div>

      {loadingApi && (
        <div style={{ textAlign: 'center', padding: 16, color: 'var(--color-text-muted)', fontSize: 14 }}>
          Yuklanmoqda...
        </div>
      )}

      <div className="admin-summary-grid">
        {summaryCards.map(({ title, value, sub, Icon, color, bg }) => (
          <div key={title} className="admin-summary-card">
            <div className="admin-summary-card__icon" style={{ background: bg, color }}>
              <Icon size={22} />
            </div>
            <div className="admin-summary-card__body">
              <p className="admin-summary-card__title">{title}</p>
              <h3 className="admin-summary-card__value">{value}</h3>
              <p className="admin-summary-card__sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__chart-card">
        <h3>Oylik Daromad vs Xarajat (Barcha Userlar)</h3>
        <MonthlyBarChart data={chartData} />
      </div>

      <div className="admin-dashboard__table-card">
        <div className="admin-dashboard__table-head">
          <h3>Top Foydalanuvchilar</h3>
          <span>{regularUsers.length} ta user</span>
        </div>
        <div className="admin-top-users">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Foydalanuvchi</th>
                <th>Holat</th>
                <th>Daromad</th>
                <th>Xarajat</th>
                <th>Balans</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={u.id}>
                  <td className="admin-table__num">{i + 1}</td>
                  <td>
                    <div className="admin-table__user">
                      <div className="admin-table__avatar">
                        {u.avatar ? <img src={u.avatar} alt="" /> : u.fullName[0]}
                      </div>
                      <div>
                        <p className="admin-table__name">{u.fullName}</p>
                        <p className="admin-table__email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status-badge admin-status-badge--${(u.status || '').toLowerCase()}`}>
                      {u.status === 'active' || u.status === 'ACTIVE' ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="text-success">{formatCurrency(u.totalIncome)}</td>
                  <td className="text-danger">{formatCurrency(u.totalExpense)}</td>
                  <td className={u.balance >= 0 ? 'text-success' : 'text-danger'}>
                    {formatCurrency(u.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
