import React, { useState } from 'react';
import { MdPalette, MdNotifications, MdAdminPanelSettings, MdSave } from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import './AdminSettings.css';

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="settings-toggle">
    <div>
      <p className="settings-toggle__label">{label}</p>
      {desc && <p className="settings-toggle__desc">{desc}</p>}
    </div>
    <button
      className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle-switch__thumb" />
    </button>
  </div>
);

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [notifs, setNotifs] = useState({ system: true, email: false, reports: true });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ fullName: profileForm.fullName, email: profileForm.email });
    setProfileMsg('Admin profili yangilandi!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  return (
    <div className="admin-settings fade-in">
      {/* Theme */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-head">
          <div className="admin-settings__section-icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <MdPalette size={18} />
          </div>
          <div>
            <h3>Tema Sozlamalari</h3>
            <p>Admin panel ko'rinishini sozlang</p>
          </div>
        </div>
        <div className="admin-settings__section-body">
          <div className="theme-options">
            <button
              className={`theme-option ${theme === 'light' ? 'theme-option--active' : ''}`}
              onClick={() => theme === 'dark' && toggleTheme()}
            >
              <HiSun size={20} />
              <span>Light Mode</span>
              {theme === 'light' && <span className="theme-option__check">✓</span>}
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'theme-option--active' : ''}`}
              onClick={() => theme === 'light' && toggleTheme()}
            >
              <HiMoon size={20} />
              <span>Dark Mode</span>
              {theme === 'dark' && <span className="theme-option__check">✓</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-head">
          <div className="admin-settings__section-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)' }}>
            <MdNotifications size={18} />
          </div>
          <div>
            <h3>Bildirishnomalar</h3>
            <p>Admin bildirishnomalarini sozlang</p>
          </div>
        </div>
        <div className="admin-settings__section-body">
          <Toggle checked={notifs.system}  onChange={v => setNotifs(p => ({ ...p, system: v }))}
            label="Tizim bildirishnomalari" desc="Yangi foydalanuvchi ro'yxatdan o'tganda xabar" />
          <Toggle checked={notifs.email}   onChange={v => setNotifs(p => ({ ...p, email: v }))}
            label="Email bildirishnomalari" desc="Muhim hodisalar haqida emailga xabar" />
          <Toggle checked={notifs.reports} onChange={v => setNotifs(p => ({ ...p, reports: v }))}
            label="Haftalik hisobotlar" desc="Haftalik moliyaviy hisobotlarni oling" />
        </div>
      </div>

      {/* Admin Profile */}
      <div className="admin-settings__section">
        <div className="admin-settings__section-head">
          <div className="admin-settings__section-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
            <MdAdminPanelSettings size={18} />
          </div>
          <div>
            <h3>Admin Profili</h3>
            <p>Administrator ma'lumotlarini yangilang</p>
          </div>
        </div>
        <div className="admin-settings__section-body">
          {profileMsg && (
            <div className="admin-settings__success">{profileMsg}</div>
          )}
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-field">
              <label>To'liq ism</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={e => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
                placeholder="Admin ismi"
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@example.com"
              />
            </div>
            <button type="submit" className="admin-settings__save-btn">
              <MdSave size={16} /> Saqlash
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
