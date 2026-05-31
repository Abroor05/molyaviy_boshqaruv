import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__brand">
        <div className="footer__logo">
          <div className="footer__logo-icon"><MdAccountBalanceWallet size={20} /></div>
          <span>FinanceApp</span>
        </div>
        <p>Shaxsiy moliyangizni oson va samarali boshqaring. Daromad va xarajatlaringizni kuzating.</p>
      </div>

      <div className="footer__links">
        <div className="footer__col">
          <h4>Sahifalar</h4>
          <Link to="/">Bosh sahifa</Link>
          <Link to="/login">Kirish</Link>
          <Link to="/register">Ro'yxatdan o'tish</Link>
        </div>
        <div className="footer__col">
          <h4>Xizmatlar</h4>
          <span>Daromad kuzatuvi</span>
          <span>Xarajat tahlili</span>
          <span>Moliyaviy hisobotlar</span>
        </div>
        <div className="footer__col">
          <h4>Aloqa</h4>
          <span><FiMail size={13} /> info@financeapp.uz</span>
          <span><FiPhone size={13} /> +998 90 123 45 67</span>
          <span><FiMapPin size={13} /> Toshkent, O'zbekiston</span>
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <p>© {new Date().getFullYear()} FinanceApp. Barcha huquqlar himoyalangan.</p>
    </div>
  </footer>
);

export default Footer;
