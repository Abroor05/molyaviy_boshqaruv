import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { MONTHS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import './ChartContainer.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MonthlyBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
      <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="income" name="Daromad" fill="#10b981" radius={[4, 4, 0, 0]} />
      <Bar dataKey="expense" name="Xarajat" fill="#ef4444" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const ExpensePieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelLine={false}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => formatCurrency(value)} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const MonthlyLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
      <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="income" name="Daromad" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="expense" name="Xarajat" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);

const ChartContainer = ({ title, children }) => (
  <div className="chart-container">
    <h3 className="chart-container__title">{title}</h3>
    <div className="chart-container__body">{children}</div>
  </div>
);

export default ChartContainer;
