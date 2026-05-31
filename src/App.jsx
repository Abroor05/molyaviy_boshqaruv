import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider }       from './context/ThemeContext';
import { AuthProvider }        from './context/AuthContext';
import { FinanceProvider }     from './context/FinanceContext';
import { NotificationProvider } from './context/NotificationContext';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute    from './routes/PublicRoute';
import AdminRoute     from './routes/AdminRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import AdminLayout     from './layouts/AdminLayout/AdminLayout';

// Public pages
import LandingPage  from './pages/LandingPage/LandingPage';
import LoginPage    from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

// User pages
import DashboardPage    from './pages/DashboardPage/DashboardPage';
import IncomePage       from './pages/IncomePage/IncomePage';
import ExpensePage      from './pages/ExpensePage/ExpensePage';
import TransactionsPage from './pages/TransactionsPage/TransactionsPage';
import StatisticsPage   from './pages/StatisticsPage/StatisticsPage';
import ProfilePage      from './pages/ProfilePage/ProfilePage';
import SettingsPage     from './pages/SettingsPage/SettingsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers/AdminUsers';
import AdminFinance   from './pages/admin/AdminFinance/AdminFinance';
import AdminSettings  from './pages/admin/AdminSettings/AdminSettings';

import './styles/variables.css';
import './styles/global.css';

// 404
const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16,
    background: 'var(--color-bg)', color: 'var(--color-text-primary)',
  }}>
    <span style={{ fontSize: 72, fontWeight: 800, color: 'var(--color-primary)' }}>404</span>
    <p style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>Sahifa topilmadi</p>
    <a href="/" style={{
      padding: '12px 28px', background: 'var(--color-primary)', color: '#fff',
      borderRadius: 10, fontWeight: 600, textDecoration: 'none',
    }}>Bosh sahifaga qaytish</a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FinanceProvider>
            <NotificationProvider>
              <Routes>

                {/* ── Public ─────────────────────────────────────────── */}
                <Route path="/" element={<LandingPage />} />

                {/* Login/Register — logged-in users redirect by role */}
                <Route element={<PublicRoute />}>
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* ── User Dashboard ─────────────────────────────────── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard"    element={<DashboardPage />} />
                    <Route path="/income"       element={<IncomePage />} />
                    <Route path="/expense"      element={<ExpensePage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/statistics"   element={<StatisticsPage />} />
                    <Route path="/profile"      element={<ProfilePage />} />
                    <Route path="/settings"     element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* ── Admin Panel ────────────────────────────────────── */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin"          element={<AdminDashboard />} />
                    <Route path="/admin/users"    element={<AdminUsers />} />
                    <Route path="/admin/finance"  element={<AdminFinance />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                {/* ── 404 ───────────────────────────────────────────── */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </NotificationProvider>
          </FinanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
