import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown,
  MdBarChart, MdSecurity, MdDevices, MdAutoGraph, MdFlag,
  MdArrowForward, MdCheck,
} from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';

const services = [
  { Icon: MdTrendingUp,   title: 'Daromad Kuzatuvi',    desc: 'Barcha daromad manbalaringizni bir joyda boshqaring va tahlil qiling.' },
  { Icon: MdTrendingDown, title: 'Xarajat Nazorati',    desc: 'Xarajatlaringizni kategoriyalar bo\'yicha kuzating va nazorat qiling.' },
  { Icon: MdBarChart,     title: 'Moliyaviy Tahlil',    desc: 'Real vaqtda statistika va professional grafiklar bilan tahlil qiling.' },
  { Icon: MdFlag,         title: 'Moliyaviy Maqsadlar', desc: 'Shaxsiy moliyaviy maqsadlar qo\'ying va ularga erishing.' },
  { Icon: MdAutoGraph,    title: 'Oylik Hisobotlar',    desc: 'Oylik va yillik moliyaviy hisobotlarni avtomatik oling.' },
  { Icon: MdSecurity,     title: 'Xavfsiz Saqlash',     desc: 'Ma\'lumotlaringiz mahalliy saqlash orqali xavfsiz saqlanadi.' },
];

const testimonials = [
  { name: 'Aziz Toshmatov',  role: 'Tadbirkor',  text: 'Bu ilova mening moliyaviy hayotimni butunlay o\'zgartirdi. Endi xarajatlarimni aniq nazorat qila olaman.' },
  { name: 'Malika Yusupova', role: 'Dasturchi',  text: 'Juda qulay interfeys va foydali funksiyalar. Har kuni ishlataman!' },
  { name: 'Bobur Rahimov',   role: 'O\'qituvchi', text: 'Oylik hisobotlar funksiyasi menga juda yoqdi. Moliyaviy rejalashtirish osonlashdi.' },
  { name: 'Nilufar Karimova',role: 'Shifokor',   text: 'Dark mode va responsive dizayn ajoyib. Telefonda ham qulay ishlatiladi.' },
];

const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = target / (duration / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return [count, ref];
};

const StatCounter = ({ value, label, suffix = '+' }) => {
  const [count, ref] = useCounter(value);
  return (
    <div className="landing-stat" ref={ref}>
      <h3>{count.toLocaleString()}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <div className="landing-nav__logo">
            <div className="landing-nav__logo-icon"><MdAccountBalanceWallet size={18} /></div>
            <span>FinanceApp</span>
          </div>
          <div className="landing-nav__links">
            <a href="#services">Xizmatlar</a>
            <a href="#stats">Statistika</a>
            <a href="#testimonials">Fikrlar</a>
          </div>
          <div className="landing-nav__actions">
            <button className="landing-nav__theme-btn" onClick={toggleTheme}>
              {theme === 'light' ? <HiMoon size={17} /> : <HiSun size={17} />}
            </button>
            <Link to="/login" className="landing-nav__login">Kirish</Link>
            <Link to="/register" className="landing-nav__cta">Boshlash <MdArrowForward size={15} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__inner">
          <div className="landing-hero__content">
            <span className="landing-hero__badge">
              <MdAutoGraph size={14} /> Yangi versiya chiqdi
            </span>
            <h1>
              Moliyangizni <span className="landing-hero__accent">Aqlli</span> Boshqaring
            </h1>
            <p>
              Daromad va xarajatlaringizni kuzating, moliyaviy maqsadlaringizga erishing.
              Professional dashboard bilan shaxsiy moliyangizni nazorat qiling.
            </p>
            <div className="landing-hero__btns">
              <Link to="/register" className="landing-btn-primary">
                Bepul Boshlash <MdArrowForward size={16} />
              </Link>
              <Link to="/login" className="landing-btn-outline">Kirish</Link>
            </div>
            <div className="landing-hero__trust">
              {['Bepul', 'Xavfsiz', 'Qulay'].map(t => (
                <span key={t}><MdCheck size={14} /> {t}</span>
              ))}
            </div>
          </div>

          <div className="landing-hero__visual">
            <div className="hero-card hero-card--main">
              <div className="hero-card__label">
                <MdAccountBalanceWallet size={16} /> Umumiy Balans
              </div>
              <div className="hero-card__amount">12,500,000 so'm</div>
              <div className="hero-card__change">↑ 8.2% o'sish</div>
            </div>
            <div className="hero-cards-row">
              <div className="hero-card hero-card--income">
                <MdTrendingUp size={20} />
                <div>
                  <p>Daromad</p>
                  <strong>7,500,000</strong>
                </div>
              </div>
              <div className="hero-card hero-card--expense">
                <MdTrendingDown size={20} />
                <div>
                  <p>Xarajat</p>
                  <strong>3,200,000</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="landing-services" id="services">
        <div className="landing-section">
          <div className="landing-section__head">
            <span className="landing-tag">Xizmatlar</span>
            <h2>Nima uchun FinanceApp?</h2>
            <p>Moliyaviy hayotingizni osonlashtiruvchi barcha vositalar bir joyda</p>
          </div>
          <div className="landing-services__grid">
            {services.map(({ Icon, title, desc }, i) => (
              <div key={i} className="service-card">
                <div className="service-card__icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats" id="stats">
        <div className="landing-section">
          <div className="landing-section__head landing-section__head--light">
            <span className="landing-tag landing-tag--light">Raqamlarda</span>
            <h2>Bizning Natijalarimiz</h2>
          </div>
          <div className="landing-stats__grid">
            <StatCounter value={50000}   label="Faol Foydalanuvchilar" />
            <StatCounter value={2000000} label="Kuzatilgan Tranzaksiyalar" />
            <StatCounter value={98}      label="Mijoz Mamnuniyati" suffix="%" />
            <StatCounter value={5}       label="Yillik Tajriba" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-testimonials" id="testimonials">
        <div className="landing-section">
          <div className="landing-section__head">
            <span className="landing-tag">Fikrlar</span>
            <h2>Foydalanuvchilar Nima Deydi?</h2>
          </div>
          <div className="landing-testimonials__grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(5)].map((_, j) => <FiStar key={j} size={14} fill="currentColor" />)}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-section">
          <h2>Moliyaviy Erkinlikka Qadam Qo'ying</h2>
          <p>Bugun ro'yxatdan o'ting va moliyangizni nazorat qilishni boshlang</p>
          <Link to="/register" className="landing-btn-primary landing-btn-primary--white">
            Bepul Boshlash <MdArrowForward size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
