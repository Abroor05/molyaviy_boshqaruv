import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { formatCurrency, getMonthYear } from '../../../utils/helpers';
import { MONTHS } from '../../../utils/constants';
import { MonthlyBarChart, ExpensePieChart } from '../../../components/ChartContainer/ChartContainer';
import '../AdminDashboard/AdminDashboard.css';
import './AdminFinance.css';

const AdminFinance = () => {
  const { users } = useAuth();
  const { incomes, expenses } = useFinance();
  const [selectedUser, setSelectedUser] = useState('all');

  const regularUsers = users.filter(u => u.role === 'user');

  const filteredIncomes  = selectedUser === 'all' ? incomes  : incomes.filter(i => i.userId === selectedUser);
  const filteredExpenses = selectedUser === 'all' ? expenses : expenses.filter(e => e.userId === selectedUser);

  const totalIncome  = filteredIncomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const balance      = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const map = {};
    filteredIncomes.forEach(i => {
      const k = getMonthYear(i.date);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      map[k].income += i.amount;
    });
    filteredExpenses.forEach(e => {
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
  }, [filteredIncomes, filteredExpenses]);

  const pieData = useMemo(() => {
    const map = {};
    filteredExpenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // Per-user summary
  const userSummary = useMemo(() => {
    return regularUsers.map(u => {
      const inc = incomes.filter(i => i.userId === u.id).reduce((s, i) => s + i.amount, 0);
      const exp = expenses.filter(e => e.userId === u.id).reduce((s, e) => s + e.amount, 0);
      const txCount = incomes.filter(i => i.userId === u.id).length + expenses.filter(e => e.userId === u.id).length;
      return { ...u, totalIncome: inc, totalExpense: exp, balance: inc - exp, txCount };
    }).sort((a, b) => b.totalIncome - a.totalIncome);
  }, [regularUsers, incomes, expenses]);

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
            {regularUsers.map(u => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>
      </div>

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
              {userSummary.map((u, i) => (
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
                  <td style={{ fontWeight: 600 }}>{u.txCount}</td>
                  <td className="text-success">{formatCurrency(u.totalIncome)}</td>
                  <td className="text-danger">{formatCurrency(u.totalExpense)}</td>
                  <td className={u.balance >= 0 ? 'text-success' : 'text-danger'}>
                    <strong>{formatCurrency(u.balance)}</strong>
                  </td>
                  <td>
                    <span className={`admin-status-badge admin-status-badge--${u.status}`}>
                      {u.status === 'active' ? 'Faol' : 'Bloklangan'}
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
