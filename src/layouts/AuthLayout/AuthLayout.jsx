import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import './AuthLayout.css';

function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="auth-layout__brand">
          <Link to="/" className="auth-layout__logo">
            <span className="auth-layout__logo-icon">💰</span>
            <span className="auth-layout__logo-text">FinanceManager</span>
          </Link>
        </div>
        <div className="auth-layout__hero">
          <h1 className="auth-layout__hero-title">
            Take Control of Your <span>Finances</span>
          </h1>
          <p className="auth-layout__hero-desc">
            Track income, manage expenses, and gain insights with beautiful charts and reports.
          </p>
          <div className="auth-layout__features">
            {[
              { icon: '📊', text: 'Real-time dashboard' },
              { icon: '📈', text: 'Income & expense tracking' },
              { icon: '🔒', text: 'Secure & private' },
              { icon: '📱', text: 'Works on all devices' },
            ].map((f) => (
              <div key={f.text} className="auth-layout__feature">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-layout__right">
        <div className="auth-layout__top-bar">
          <button
            className="auth-layout__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <div className="auth-layout__form-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
