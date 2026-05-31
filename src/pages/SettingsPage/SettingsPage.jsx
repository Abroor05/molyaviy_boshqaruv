import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPalette, MdNotifications, MdManageAccounts, MdDeleteForever } from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import './SettingsPage.css';

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

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { notifications, updateNotifications } = useNotification();
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [emailForm, setEmailForm] = useState({ email: user?.email || '' });
  const [emailMsg, setEmailMsg] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleEmailSave = (e) => {
    e.preventDefault();
    if (!emailForm.email) return;
    updateProfile({ email: emailForm.email });
    setEmailMsg('Email muvaffaqiyatli yangilandi!');
    setTimeout(() => setEmailMsg(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "O'CHIRISH") return;
    deleteAccount();
    navigate('/');
  };

  return (
    <div className="settings-page fade-in">
      {/* Theme */}
      <div className="settings-section">
        <div className="settings-section__head">
          <div className="settings-section__icon settings-section__icon--purple">
            <MdPalette size={18} />
          </div>
          <div>
            <h3>Tema Sozlamalari</h3>
            <p>Ilova ko'rinishini sozlang</p>
          </div>
        </div>
        <div className="settings-section__body">
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
      <div className="settings-section">
        <div className="settings-section__head">
          <div className="settings-section__icon settings-section__icon--blue">
            <MdNotifications size={18} />
          </div>
          <div>
            <h3>Bildirishnoma Sozlamalari</h3>
            <p>Qaysi bildirishnomalarni olishni tanlang</p>
          </div>
        </div>
        <div className="settings-section__body">
          <Toggle checked={notifications.enabled} onChange={v => updateNotifications({ enabled: v })}
            label="Ilova bildirishnomalari" desc="Yangi tranzaksiyalar haqida xabar oling" />
          <Toggle checked={notifications.sound} onChange={v => updateNotifications({ sound: v })}
            label="Ovozli bildirishnomalar" desc="Bildirishnomalar uchun ovoz yoqing" />
          <Toggle checked={notifications.email} onChange={v => updateNotifications({ email: v })}
            label="Email bildirishnomalari" desc="Oylik hisobotlarni emailga oling" />
        </div>
      </div>

      {/* Account */}
      <div className="settings-section">
        <div className="settings-section__head">
          <div className="settings-section__icon settings-section__icon--green">
            <MdManageAccounts size={18} />
          </div>
          <div>
            <h3>Hisob Sozlamalari</h3>
            <p>Email va hisob boshqaruvi</p>
          </div>
        </div>
        <div className="settings-section__body">
          {emailMsg && <div className="settings-success">{emailMsg}</div>}
          <form onSubmit={handleEmailSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-field">
              <label>Email manzil</label>
              <input type="email" value={emailForm.email}
                onChange={e => setEmailForm({ email: e.target.value })}
                placeholder="email@example.com" />
            </div>
            <button type="submit" className="settings-btn settings-btn--primary">
              Emailni Yangilash
            </button>
          </form>

          <div className="settings-divider" />

          <div className="settings-danger-zone">
            <div>
              <h4><MdDeleteForever size={16} /> Xavfli Zona</h4>
              <p>Hisobni o'chirish qaytarib bo'lmaydi</p>
            </div>
            <button className="settings-btn settings-btn--danger" onClick={() => setDeleteModal(true)}>
              Hisobni O'chirish
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => { setDeleteModal(false); setDeleteConfirm(''); }}
        title="Hisobni O'chirish"
        size="sm"
      >
        <div className="delete-modal">
          <p>Bu amalni qaytarib bo'lmaydi. Barcha ma'lumotlaringiz o'chiriladi.</p>
          <p>Tasdiqlash uchun <strong>O'CHIRISH</strong> deb yozing:</p>
          <input
            type="text" value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder="O'CHIRISH"
            className="delete-modal__input"
          />
          <div className="delete-modal__actions">
            <button className="settings-btn settings-btn--outline"
              onClick={() => { setDeleteModal(false); setDeleteConfirm(''); }}>
              Bekor qilish
            </button>
            <button className="settings-btn settings-btn--danger"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "O'CHIRISH"}>
              O'chirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
