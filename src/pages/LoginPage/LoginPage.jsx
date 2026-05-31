import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdAccountBalanceWallet, MdArrowForward,
} from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { FiBarChart2, FiShield, FiSmartphone } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email kiritilishi shart';
    else if (!validateEmail(form.email)) e.email = "Email formati noto'g'ri";
    if (!form.password) e.password = 'Parol kiritilishi shart';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = login(form.email, form.password, form.remember);
    setLoading(false);
    if (res.success) {
      // Role asosida yo'naltirish
      navigate(res.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setErrors({ general: res.message });
    }
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
            <h1>Xush kelibsiz</h1>
            <p>Hisobingizga kiring</p>
          </div>

          {errors.general && (
            <div className="auth-alert auth-alert--error">{errors.general}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className={`form-field ${errors.email ? 'form-field--error' : ''}`}>
              <label>Email manzil</label>
              <div className="auth-input-wrap">
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="email@example.com" autoComplete="email" />
                <MdEmail size={17} className="auth-input-icon" />
              </div>
              {errors.email && <span className="form-field__error">{errors.email}</span>}
            </div>

            <div className={`form-field ${errors.password ? 'form-field--error' : ''}`}>
              <label>Parol</label>
              <div className="auth-input-wrap">
                <input type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Parolingizni kiriting" autoComplete="current-password" />
                <MdLock size={17} className="auth-input-icon" />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
              {errors.password && <span className="form-field__error">{errors.password}</span>}
            </div>

            <div className="auth-form__row">
              <label className="auth-checkbox">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                <span>Meni eslab qol</span>
              </label>
              <button type="button" className="auth-forgot">Parolni unutdingizmi?</button>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Kirish...' : <><span>Kirish</span> <MdArrowForward size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'ting</Link>
          </p>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-right-content">
          <h2>Moliyaviy Erkinlikka Qadam Qo'ying</h2>
          <p>Daromad va xarajatlaringizni kuzating, moliyaviy maqsadlaringizga erishing.</p>
          <div className="auth-features">
            {[
              { Icon: FiBarChart2,  text: 'Real vaqtda statistika' },
              { Icon: FiShield,     text: "Xavfsiz ma'lumot saqlash" },
              { Icon: FiSmartphone, text: 'Barcha qurilmalarda ishlaydi' },
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

export default LoginPage;
