import React from 'react';
import { MdMenu, MdNotificationsNone } from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import './AdminNavbar.css';

const AdminNavbar = ({ onMenuToggle, pageTitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="admin-navbar">
      <div className="admin-navbar__left">
        <button className="admin-navbar__menu-btn" onClick={onMenuToggle}>
          <MdMenu size={22} />
        </button>
        <div>
          <h1 className="admin-navbar__title">{pageTitle}</h1>
          <p className="admin-navbar__sub">Administrator paneli</p>
        </div>
      </div>
      <div className="admin-navbar__right">
        <button className="admin-navbar__icon-btn" onClick={toggleTheme}>
          {theme === 'light' ? <HiMoon size={18} /> : <HiSun size={18} />}
        </button>
        <button className="admin-navbar__icon-btn">
          <MdNotificationsNone size={20} />
        </button>
        <div className="admin-navbar__badge">ADMIN</div>
      </div>
    </header>
  );
};

export default AdminNavbar;
