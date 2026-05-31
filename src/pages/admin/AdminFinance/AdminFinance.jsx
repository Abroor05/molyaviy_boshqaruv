import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { formatCurrency, getMonthYear } from '../../../utils/helpers';
import { MONTHS } from '../../../utils/constants';
import { MonthlyBarChart, ExpensePieChart } from '../../../components/ChartContainer/ChartContainer';
import adminService from '../../../services/admin.service.js';
import '../AdminDashboard/AdminDashboard.css';
import './AdminFinance.css';

const USE_API = import.meta.env.VITE_USE_API === 'true';

const AdminFinance = () => {
  // LocalStorage mode uchun
  const { users: localUsers } = useAuth();
  const { incomes: ctxIncomes, expenses: ctxExpenses } = useFinance();

  // API mode state
  const [apiUsers,    setApiUsers]    = useState([]);
  const [apiIncomes,  setApiIncomes]  = useState([]);
  const [apiExpenses, setApiExpenses] = useState([]);
  const [loading,     setLoading]     = useState(false);

  const [selectedUser, setSelectedUser] = useState('all');

  const fetchApiData = useCallback(async () => {
    if (!USE_API) return;
    setLoading(true);
    try {
      const [usersData, txData] = await Promise.all([
        adminService.getUsers({ limit: 100 }),
        adminService.getAllTransactions({ limit: 1000 }),
      ]);
      setApiUsers(usersData.users || []);
      setApiIncomes((txData.incomes  || []).map(i => ({ ...i, date: i.date ? i.date.split('T')[0] : i.date })));
      setApiExpenses((txData.expenses || []).map(e => ({ ...e, date: e.date ? e.date.split('T')[0] : e.date })));
    } catch (err) {
      console.error('AdminFinance fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApiData(); }, [fetchApiData]);

  // Qaysi ma'lumot ishlatilishini aniqlash
  const allUsers   = USE_API ? apiUsers.filter(u => (u.role || '').toLowerCase() !== 'admin') : localUsers.filter(u => u.role === 'user');
  const allIncomes  = USE_API ? apiIncomes  : ctxIncomes;
  const allExpenses = USE_API ? apiExpenses : ctxExpenses;

  // Tanlangan user bo'yicha filter
  const filteredIncomes  = selectedUser === 'all' ? allIncomes  : allIncomes.filter(i => i.userId === selectedUser);
  const filteredExpenses = selectedUser === 'all' ? allExpenses : allExpenses.filter(e => e.userId === selectedUser);

  const totalIncome  = filteredIncomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const balance      = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const map = {};
    filteredIncomes.forEach(i => {
      const k = getMonthYear(i.date);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      map[k].income += Number(i.amount);
    });
    filteredExpenses.forEach(e => {
      const k = getMonthYear(e.date);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      map[k].expense += Number(e.amount);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => {
        const [, m] = key.split('-');
        return { month: MONTHS[parseInt(m) - 1], ...val };
      });
  }, [filteredIncomes, filteredExpenses]);

  const pieData = useMemo(() => {
    const map = {};
    filteredExpenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // Per-user summary — allIncomes/allExpenses dan hisoblash
  const userSummary = useMemo(() => {
    return allUsers.map(u => {
      const inc = allIncomes.filter(i => i.userId === u.id).reduce((s, i) => s + Number(i.amount), 0);
      const exp = allExpenses.filter(e => e.userId === u.id).reduce((s, e) => s + Number(e.amount), 0);
      const txCount = allIncomes.filter(i => i.userId === u.id).length + allExpenses.filter(e => e.userId === u.id).length;
      return { ...u, totalIncome: inc, totalExpense: exp, balance: inc - exp, txCount };
    }).sort((a, b) => b.totalIncome - a.totalIncome);
  }, [allUsers, allIncomes, allExpenses]);

  const getStatusLabel = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'active' ? 'Faol' : 'Bloklangan';
  };

  return (
    <div className="admin-finance fade-in">
      <div className="admin-finance__header">
        <div>
          <h2>Moliyaviy Hisobot</h2>
          <p>Barcha foydalanuvchilarning moliyaviy ma'lumotlari</p>
        </div>
        <div className="admin-finance__filter">
          <label>Foydalanuvchi:</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="all">Barchasi</option>
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 16, color: 'var(--color-text-muted)', fontSize: 14 }}>
          Yuklanmoqda...
        </div>
      )}

      {/* Summary */}
      <div className="admin-finance__summary">
        <div className="admin-finance__sum-card admin-finance__sum-card--income">
          <p>Jami Daromad</p>
          <h3>{formatCurrency(totalIncome)}</h3>
        </div>
        <div className="admin-finance__sum-card admin-finance__sum-card--expense">
          <p>Jami Xarajat</p>
          <h3>{formatCurrency(totalExpense)}</h3>
        </div>
        <div className="admin-finance__sum-card admin-finance__sum-card--balance">
          <p>Balans</p>
          <h3>{formatCurrency(balance)}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="admin-finance__charts">
        <div className="admin-chart-card">
          <h3>Oylik Daromad vs Xarajat</h3>
          <MonthlyBarChart data={chartData} />
        </div>
        <div className="admin-chart-card">
          <h3>Xarajat Taqsimoti</h3>
          <ExpensePieChart data={pieData} />
        </div>
      </div>

      {/* Per-user table */}
      <div className="admin-dashboard__table-card">
        <div className="admin-dashboard__table-head">
          <h3>Foydalanuvchilar bo'yicha Hisobot</h3>
          <span>{allUsers.length} ta user</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Foydalanuvchi</th>
                <th>Tranzaksiyalar</th>
                <th>Daromad</th>
                <th>Xarajat</th>
                <th>Balans</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {userSummary.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    Ma'lumot topilmadi
                  </td>
                </tr>
              )}
              {userSummary.map((u, i) => (
                <tr key={u.id}>
                  <td className="admin-table__num">{i + 1}</td>
                  <td>
                    <div className="admin-table__user">
                      <div className="admin-table__avatar">
                        {u.avatar ? <img src={u.avatar} alt="" /> : u.fullName?.[0] || '?'}
                      </div>
                      <div>
                        <p className="admin-table__name">{u.fullName}</p>
                        <p className="admin-table__email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{u.txCount}</td>
                  <td className="text-success">{formatCurrency(u.totalIncome)}</td>
                  <td className="text-danger">{formatCurrency(u.totalExpense)}</td>
                  <td className={u.balance >= 0 ? 'text-success' : 'text-danger'}>
                    <strong>{formatCurrency(u.balance)}</strong>
                  </td>
                  <td>
                    <span className={`admin-status-badge admin-status-badge--${(u.status || '').toLowerCase()}`}>
                      {getStatusLabel(u.status)}
                    </span>
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

export default AdminFinance;
