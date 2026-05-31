import React from 'react';
import { formatCurrency } from '../../utils/formatters.js';
import './StatisticsCard.css';

function StatisticsCard({ title, value, subtitle, icon, color = '#6366f1', isCurrency = true }) {
  return (
    <div className="statistics-card" style={{ '--stat-color': color }}>
      <div className="statistics-card__icon" style={{ backgroundColor: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="statistics-card__content">
        <p className="statistics-card__title">{title}</p>
        <h4 className="statistics-card__value">
          {isCurrency ? formatCurrency(value) : value}
        </h4>
        {subtitle && <p className="statistics-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatisticsCard;
