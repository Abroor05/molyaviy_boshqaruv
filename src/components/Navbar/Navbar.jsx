import React from 'react';
import { MdMenu, MdNotificationsNone } from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onMenuToggle, pageTitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuToggle} aria-label="Menu">
          <MdMenu size={22} />
        </button>
        <h1 className="navbar__title">{pageTitle}</h1>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-btn" onClick={toggleTheme} title="Tema">
          {theme === 'light' ? <HiMoon size={18} /> : <HiSun size={18} />}
        </button>
        <button className="navbar__icon-btn" title="Bildirishnomalar">
          <MdNotificationsNone size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
