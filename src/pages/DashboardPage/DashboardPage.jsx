import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdArrowForward } from 'react-icons/md';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import DashboardCards from '../../components/DashboardCards/DashboardCards';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import ChartContainer, { MonthlyBarChart, MonthlyLineChart } from '../../components/ChartContainer/ChartContainer';
import { isCurrentMonth, getMonthYear } from '../../utils/helpers';
import { MONTHS } from '../../utils/constants';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getIncomesByUser, getExpensesByUser, deleteIncome, deleteExpense } = useFinance();

  // Faqat shu userning ma'lumotlari
  const incomes  = useMemo(() => getIncomesByUser(user.id),  [user.id, getIncomesByUser]);
  const expenses = useMemo(() => getExpensesByUser(user.id), [user.id, getExpensesByUser]);

  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const balance      = totalIncome - totalExpense;

  const monthlyIncome  = useMemo(() => incomes.filter(i => isCurrentMonth(i.date)).reduce((s, i) => s + i.amount, 0), [incomes]);
  const monthlyExpense = useMemo(() => expenses.filter(e => isCurrentMonth(e.date)).reduce((s, e) => s + e.amount, 0), [expenses]);

  const transactions = useMemo(() => [
    ...incomes.map(i  => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [incomes, expenses]);

  const recentTransactions = transactions.slice(0, 5);

  const chartData = useMemo(() => {
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
  }, [incomes, expenses]);

  const handleDelete = (id, type) => {
    if (type === 'income') deleteIncome(id);
    else deleteExpense(id);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Xayrli tong' : hour < 17 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-page__welcome">
        <div>
          <h2>{greeting}, {user?.fullName?.split(' ')[0]}!</h2>
          <p>Moliyaviy holatingiz quyida ko'rsatilgan</p>
        </div>
        <div className="dashboard-page__actions">
          <Link to="/income"  className="dash-btn dash-btn--income">  <MdAdd size={17} /> Daromad </Link>
          <Link to="/expense" className="dash-btn dash-btn--expense"> <MdAdd size={17} /> Xarajat </Link>
        </div>
      </div>

      <DashboardCards
        balance={balance}
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
      />

      <div className="dashboard-page__charts">
        <ChartContainer title="Oylik Daromad vs Xarajat">
          <MonthlyBarChart data={chartData} />
        </ChartContainer>
        <ChartContainer title="Trend Grafigi">
          <MonthlyLineChart data={chartData} />
        </ChartContainer>
      </div>

      <div className="dashboard-page__recent">
        <div className="dashboard-page__section-head">
          <h3>Oxirgi Tranzaksiyalar</h3>
          <Link to="/transactions" className="dashboard-page__view-all">
            Barchasini ko'rish <MdArrowForward size={15} />
          </Link>
        </div>
        <div className="dashboard-page__table-card">
          <TransactionTable transactions={recentTransactions} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
