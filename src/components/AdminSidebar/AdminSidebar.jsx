import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdBarChart, MdSettings,
  MdLogout, MdClose, MdAdminPanelSettings,
} from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminSidebar.css';

const navItems = [
  { path: '/admin',          label: 'Dashboard',          Icon: MdDashboard,        end: true },
  { path: '/admin/users',    label: 'Foydalanuvchilar',   Icon: MdPeople },
  { path: '/admin/finance',  label: 'Moliyaviy Hisobot',  Icon: MdBarChart },
  { path: '/admin/settings', label: 'Sozlamalar',         Icon: MdSettings },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>

        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon">
              <MdAdminPanelSettings size={20} />
            </div>
            <div>
              <span className="admin-sidebar__logo-text">Admin Panel</span>
              <span className="admin-sidebar__logo-sub">FinanceApp</span>
            </div>
          </div>
          <button className="admin-sidebar__close" onClick={onClose}>
            <MdClose size={18} />
          </button>
        </div>

        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">
            {user?.avatar ? <img src={user.avatar} alt="" /> : <MdAdminPanelSettings size={18} />}
          </div>
          <div>
            <p className="admin-sidebar__user-name">{user?.fullName}</p>
            <span className="admin-sidebar__role-badge">Administrator</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <p className="admin-sidebar__nav-label">BOSHQARUV</p>
          {navItems.map(({ path, label, Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar__nav-item ${isActive ? 'admin-sidebar__nav-item--active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__footer-btn" onClick={toggleTheme}>
            {theme === 'light' ? <HiMoon size={16} /> : <HiSun size={16} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button className="admin-sidebar__footer-btn admin-sidebar__footer-btn--logout" onClick={handleLogout}>
            <MdLogout size={16} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
