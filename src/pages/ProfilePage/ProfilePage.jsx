import React, { useState, useRef } from 'react';
import { MdCameraAlt, MdSave, MdLock } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { totalIncome, totalExpense, balance, transactions } = useFinance();
  const fileRef = useRef();

  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [profileMsg, setProfileMsg] = useState('');

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passMsg, setPassMsg] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) return;
    updateProfile({ fullName: profileForm.fullName, email: profileForm.email });
    setProfileMsg('Profil muvaffaqiyatli yangilandi!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ avatar: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handlePassSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!passForm.current) errs.current = 'Joriy parol kiritilishi shart';
    if (!passForm.newPass) errs.newPass = 'Yangi parol kiritilishi shart';
    else if (passForm.newPass.length < 8) errs.newPass = 'Kamida 8 ta belgi';
    if (passForm.newPass !== passForm.confirm) errs.confirm = 'Parollar mos kelmaydi';
    if (Object.keys(errs).length) { setPassErrors(errs); return; }
    const res = changePassword(passForm.current, passForm.newPass);
    if (res.success) {
      setPassMsg('Parol muvaffaqiyatli o\'zgartirildi!');
      setPassForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPassMsg(''), 3000);
    } else {
      setPassErrors({ current: res.message });
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const stats = [
    { label: 'Jami Daromad',  value: formatCurrency(totalIncome),  color: 'var(--color-success)' },
    { label: 'Jami Xarajat',  value: formatCurrency(totalExpense), color: 'var(--color-danger)' },
    { label: 'Balans',        value: formatCurrency(balance),      color: 'var(--color-primary)' },
    { label: 'Tranzaksiyalar',value: transactions.length,          color: 'var(--color-text-primary)' },
  ];

  return (
    <div className="profile-page fade-in">
      <div className="profile-page__grid">
        {/* Card */}
        <div className="profile-card">
          <div className="profile-card__top">
            <div className="profile-card__avatar-wrap" onClick={() => fileRef.current.click()}>
              <div className="profile-card__avatar">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.fullName} />
                  : <span>{initials}</span>
                }
              </div>
              <div className="profile-card__avatar-overlay">
                <MdCameraAlt size={18} />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <h2>{user?.fullName}</h2>
            <p>{user?.email}</p>
          </div>
          <div className="profile-card__stats">
            {stats.map(s => (
              <div key={s.label} className="profile-card__stat">
                <strong style={{ color: s.color }}>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forms */}
        <div className="profile-forms">
          <div className="profile-form-card">
            <div className="profile-form-card__head">
              <MdSave size={18} />
              <h3>Profil Ma'lumotlari</h3>
            </div>
            {profileMsg && <div className="profile-success">{profileMsg}</div>}
            <form onSubmit={handleProfileSave}>
              <div className="form-field">
                <label>To'liq ism</label>
                <input type="text" value={profileForm.fullName}
                  onChange={e => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="Ism Familiya" />
              </div>
              <div className="form-field" style={{ marginTop: 14 }}>
                <label>Email</label>
                <input type="email" value={profileForm.email}
                  onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="email@example.com" />
              </div>
              <button type="submit" className="profile-save-btn">
                <MdSave size={16} /> Saqlash
              </button>
            </form>
          </div>

          <div className="profile-form-card">
            <div className="profile-form-card__head">
              <MdLock size={18} />
              <h3>Parol O'zgartirish</h3>
            </div>
            {passMsg && <div className="profile-success">{passMsg}</div>}
            <form onSubmit={handlePassSave}>
              {[
                { name: 'current', label: 'Joriy parol',    placeholder: 'Joriy parolingiz' },
                { name: 'newPass', label: 'Yangi parol',    placeholder: 'Kamida 8 ta belgi' },
                { name: 'confirm', label: 'Tasdiqlash',     placeholder: 'Yangi parolni qayta kiriting' },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className={`form-field ${passErrors[name] ? 'form-field--error' : ''}`} style={{ marginBottom: 14 }}>
                  <label>{label}</label>
                  <input type="password" value={passForm[name]}
                    onChange={e => { setPassForm(p => ({ ...p, [name]: e.target.value })); if (passErrors[name]) setPassErrors(p => ({ ...p, [name]: '' })); }}
                    placeholder={placeholder} />
                  {passErrors[name] && <span className="form-field__error">{passErrors[name]}</span>}
                </div>
              ))}
              <button type="submit" className="profile-save-btn profile-save-btn--danger">
                <MdLock size={16} /> Parolni O'zgartirish
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
