import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdAccountBalanceWallet, MdArrowForward,
} from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { FiCheck, FiBarChart2, FiTarget } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validateEmail } from '../../utils/helpers';
import '../LoginPage/LoginPage.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'To\'liq ism kiritilishi shart';
    if (!form.email) e.email = 'Email kiritilishi shart';
    else if (!validateEmail(form.email)) e.email = 'Email formati noto\'g\'ri';
    if (!form.password) e.password = 'Parol kiritilishi shart';
    else if (form.password.length < 8) e.password = 'Kamida 8 ta belgi bo\'lishi kerak';
    if (!form.confirmPassword) e.confirmPassword = 'Parolni tasdiqlang';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Parollar mos kelmaydi';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = register(form.fullName, form.email, form.password);
    setLoading(false);
    if (res.success) navigate('/dashboard');
    else setErrors({ general: res.message });
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__top">
          <Link to="/" className="auth-logo">
            <div className="auth-logo__icon"><MdAccountBalanceWallet size={18} /></div>
            <span>FinanceApp</span>
          </Link>
          <button className="auth-theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? <HiMoon size={17} /> : <HiSun size={17} />}
          </button>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form__head">
            <h1>Hisob yarating</h1>
            <p>Moliyaviy sayohatingizni boshlang</p>
          </div>

          {errors.general && (
            <div className="auth-alert auth-alert--error">{errors.general}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className={`form-field ${errors.fullName ? 'form-field--error' : ''}`}>
              <label>To'liq ism</label>
              <div className="auth-input-wrap">
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ism Familiya" autoComplete="name" />
                <MdPerson size={17} className="auth-input-icon" />
              </div>
              {errors.fullName && <span className="form-field__error">{errors.fullName}</span>}
            </div>

            <div className={`form-field ${errors.email ? 'form-field--error' : ''}`}>
              <label>Email manzil</label>
              <div className="auth-input-wrap">
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" autoComplete="email" />
                <MdEmail size={17} className="auth-input-icon" />
              </div>
              {errors.email && <span className="form-field__error">{errors.email}</span>}
            </div>

            <div className={`form-field ${errors.password ? 'form-field--error' : ''}`}>
              <label>Parol</label>
              <div className="auth-input-wrap">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Kamida 8 ta belgi" autoComplete="new-password" />
                <MdLock size={17} className="auth-input-icon" />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
              {errors.password && <span className="form-field__error">{errors.password}</span>}
            </div>

            <div className={`form-field ${errors.confirmPassword ? 'form-field--error' : ''}`}>
              <label>Parolni tasdiqlang</label>
              <div className="auth-input-wrap">
                <input type={showPass ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Parolni qayta kiriting" autoComplete="new-password" />
                <MdLock size={17} className="auth-input-icon" />
              </div>
              {errors.confirmPassword && <span className="form-field__error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : <><span>Ro'yxatdan o'tish</span> <MdArrowForward size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Hisobingiz bormi? <Link to="/login">Kirish</Link>
          </p>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-right-content">
          <h2>Moliyaviy Maqsadlaringizga Erishing</h2>
          <p>Minglab foydalanuvchilar bilan birga moliyaviy erkinlikka qadam qo'ying.</p>
          <div className="auth-features">
            {[
              { Icon: FiCheck,    text: 'Bepul ro\'yxatdan o\'tish' },
              { Icon: FiBarChart2,text: 'Professional dashboard' },
              { Icon: FiTarget,   text: 'Moliyaviy maqsadlar' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="auth-feature">
                <div className="auth-feature__icon"><Icon size={18} /></div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
