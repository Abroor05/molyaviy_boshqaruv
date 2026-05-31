import React from 'react';
import {
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdTrendingDown,
  MdSavings,
} from 'react-icons/md';
import { formatCurrency } from '../../utils/helpers';
import './DashboardCards.css';

const cards = [
  {
    key: 'balance',
    title: 'Umumiy Balans',
    gradient: 'var(--card-balance-bg)',
    Icon: MdAccountBalanceWallet,
    change: '+5.2%',
    positive: true,
  },
  {
    key: 'income',
    title: 'Oylik Daromad',
    gradient: 'var(--card-income-bg)',
    Icon: MdTrendingUp,
    change: '+12.5%',
    positive: true,
  },
  {
    key: 'expense',
    title: 'Oylik Xarajat',
    gradient: 'var(--card-expense-bg)',
    Icon: MdTrendingDown,
    change: '+3.1%',
    positive: false,
  },
  {
    key: 'savings',
    title: 'Tejamkorlik',
    gradient: 'var(--card-savings-bg)',
    Icon: MdSavings,
    change: '+8.0%',
    positive: true,
  },
];

const DashboardCards = ({ balance, monthlyIncome, monthlyExpense }) => {
  const savings = Math.max(monthlyIncome - monthlyExpense, 0);
  const values = { balance, income: monthlyIncome, expense: monthlyExpense, savings };

  return (
    <div className="dashboard-cards">
      {cards.map(({ key, title, gradient, Icon, change, positive }) => (
        <div key={key} className="stat-card" style={{ background: gradient }}>
          <div className="stat-card__body">
            <p className="stat-card__title">{title}</p>
            <h2 className="stat-card__value">{formatCurrency(values[key])}</h2>
            <span className={`stat-card__change ${positive ? '' : 'stat-card__change--neg'}`}>
              {positive ? '↑' : '↑'} {change} o'tgan oyga nisbatan
            </span>
          </div>
          <div className="stat-card__icon-wrap">
            <Icon size={28} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
