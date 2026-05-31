import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdTrendingUp,
  MdTrendingDown,
  MdSwapHoriz,
  MdBarChart,
  MdPerson,
  MdSettings,
  MdLogout,
  MdClose,
  MdAccountBalanceWallet,
} from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',      Icon: MdDashboard },
  { path: '/income',       label: 'Daromadlar',     Icon: MdTrendingUp },
  { path: '/expense',      label: 'Xarajatlar',     Icon: MdTrendingDown },
  { path: '/transactions', label: 'Tranzaksiyalar', Icon: MdSwapHoriz },
  { path: '/statistics',   label: 'Statistika',     Icon: MdBarChart },
  { path: '/profile',      label: 'Profil',         Icon: MdPerson },
  { path: '/settings',     label: 'Sozlamalar',     Icon: MdSettings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <MdAccountBalanceWallet size={20} />
            </div>
            <span className="sidebar__logo-text">FinanceApp</span>
          </div>
          <button className="sidebar__close-btn" onClick={onClose} aria-label="Yopish">
            <MdClose size={18} />
          </button>
        </div>

        {/* User */}
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.avatar
              ? <img src={user.avatar} alt={user.fullName} />
              : <span>{initials}</span>
            }
          </div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.fullName}</p>
            <p className="sidebar__user-email">{user?.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          <p className="sidebar__nav-label">ASOSIY</p>
          {navItems.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} className="sidebar__nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <button className="sidebar__footer-btn" onClick={toggleTheme}>
            {theme === 'light'
              ? <HiMoon size={17} />
              : <HiSun size={17} />
            }
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button className="sidebar__footer-btn sidebar__footer-btn--logout" onClick={handleLogout}>
            <MdLogout size={17} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
