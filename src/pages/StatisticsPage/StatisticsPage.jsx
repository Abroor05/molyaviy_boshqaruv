import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import ChartContainer, { MonthlyBarChart, ExpensePieChart } from '../../components/ChartContainer/ChartContainer';
import { formatCurrency, getMonthYear } from '../../utils/helpers';
import { MONTHS } from '../../utils/constants';
import statsService from '../../services/stats.service.js';
import './StatisticsPage.css';

const USE_API = import.meta.env.VITE_USE_API === 'true';

const StatisticsPage = () => {
  const { user } = useAuth();
  const { getIncomesByUser, getExpensesByUser } = useFinance();

  const [period, setPeriod] = useState('6');
  const [apiData, setApiData] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  // ── API mode: statsService dan ma'lumot olish ─────────────────────────────────
  useEffect(() => {
    if (!USE_API) return;
    const fetchStats = async () => {
      setLoadingApi(true);
      try {
        const data = await statsService.getUserStats(parseInt(period));
        setApiData(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoadingApi(false);
      }
    };
    fetchStats();
  }, [period]);

  // ── LocalStorage mode: context dan hisoblash ──────────────────────────────────
  const incomes  = useMemo(() => getIncomesByUser(user.id),  [user.id, getIncomesByUser]);
  const expenses = useMemo(() => getExpensesByUser(user.id), [user.id, getExpensesByUser]);

  const monthlyData = useMemo(() => {
    if (USE_API && apiData) {
      return (apiData.monthly || []).map(m => ({
        ...m,
        key: m.month,
        month: MONTHS[parseInt(m.month.split('-')[1]) - 1],
        year: m.month.split('-')[0],
        net: m.net ?? (m.income - m.expense),
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
      .slice(-parseInt(period))
      .map(([key, val]) => {
        const [y, m] = key.split('-');
        return { key, month: MONTHS[parseInt(m) - 1], year: y, ...val, net: val.income - val.expense };
      });
  }, [incomes, expenses, period, apiData]);

  const pieData = useMemo(() => {
    if (USE_API && apiData) {
      return apiData.expenseByCategory || [];
    }
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [expenses, apiData]);

  const categoryReport = useMemo(() => {
    if (USE_API && apiData) {
      return (apiData.expenseByCategory || []).map(c => ({
        category: c.name,
        total: c.value,
        count: c.count || 1,
      }));
    }
    const map = {};
    expenses.forEach(e => {
      if (!map[e.category]) map[e.category] = { total: 0, count: 0 };
      map[e.category].total += e.amount;
      map[e.category].count += 1;
    });
    return Object.entries(map)
      .map(([cat, data]) => ({ category: cat, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, apiData]);

  const totalIncome  = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
  const maxExpense   = Math.max(...categoryReport.map(c => c.total), 1);

  return (
    <div className="statistics-page fade-in">
      <div className="statistics-page__header">
        <h2>Statistika va Hisobotlar</h2>
        <div className="statistics-page__period">
          <label>Davr:</label>
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="3">3 oy</option>
            <option value="6">6 oy</option>
            <option value="12">12 oy</option>
          </select>
        </div>
      </div>

      {loadingApi && (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
          Yuklanmoqda...
        </div>
      )}

      <div className="statistics-page__charts">
        <ChartContainer title="Oylik Daromad vs Xarajat">
          <MonthlyBarChart data={monthlyData} />
        </ChartContainer>
        <ChartContainer title="Xarajat Taqsimoti">
          <ExpensePieChart data={pieData} />
        </ChartContainer>
      </div>

      {/* Monthly Report */}
      <div className="statistics-page__card">
        <h3>Oylik Hisobot</h3>
        <div className="statistics-table-wrapper">
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Oy</th>
                <th>Daromad</th>
                <th>Xarajat</th>
                <th>Sof Balans</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(row => (
                <tr key={row.key}>
                  <td>{row.month} {row.year}</td>
                  <td className="text-success">{formatCurrency(row.income)}</td>
                  <td className="text-danger">{formatCurrency(row.expense)}</td>
                  <td className={row.net >= 0 ? 'text-success' : 'text-danger'}>
                    {row.net >= 0 ? '+' : ''}{formatCurrency(row.net)}
                  </td>
                  <td>
                    <span className={`badge ${row.net >= 0 ? 'badge-income' : 'badge-expense'}`}>
                      {row.net >= 0 ? 'Ijobiy' : 'Salbiy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="statistics-table__total">
                <td><strong>Jami</strong></td>
                <td className="text-success"><strong>{formatCurrency(totalIncome)}</strong></td>
                <td className="text-danger"><strong>{formatCurrency(totalExpense)}</strong></td>
                <td className={totalIncome - totalExpense >= 0 ? 'text-success' : 'text-danger'}>
                  <strong>{formatCurrency(totalIncome - totalExpense)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Category Report */}
      <div className="statistics-page__card">
        <h3>Kategoriya Hisoboti</h3>
        <div className="category-report">
          {categoryReport.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Xarajatlar mavjud emas</p>
          ) : categoryReport.map(cat => (
            <div key={cat.category} className="category-report__item">
              <div className="category-report__info">
                <span className="category-report__name">{cat.category}</span>
                <span className="category-report__count">{cat.count} ta</span>
              </div>
              <div className="category-report__bar-wrap">
                <div className="category-report__bar" style={{ width: `${(cat.total / maxExpense) * 100}%` }} />
              </div>
              <span className="category-report__amount text-danger">{formatCurrency(cat.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
