import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { INCOME_CATEGORIES } from '../../utils/constants';
import './IncomeForm.css';

const init = {
  title: '', amount: '', category: '',
  date: new Date().toISOString().split('T')[0], description: '',
};

const IncomeForm = ({ onSubmit }) => {
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Sarlavha kiritilishi shart';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'To\'g\'ri miqdor kiriting';
    if (!form.category) e.category = 'Kategoriya tanlang';
    if (!form.date) e.date = 'Sana kiritilishi shart';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, amount: parseFloat(form.amount) });
    setForm(init);
    setErrors({});
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="entry-form__grid">
        <div className={`form-field ${errors.title ? 'form-field--error' : ''}`}>
          <label>Sarlavha *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Masalan: Oylik maosh" />
          {errors.title && <span className="form-field__error">{errors.title}</span>}
        </div>
        <div className={`form-field ${errors.amount ? 'form-field--error' : ''}`}>
          <label>Miqdor (so'm) *</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0" min="0" />
          {errors.amount && <span className="form-field__error">{errors.amount}</span>}
        </div>
        <div className={`form-field ${errors.category ? 'form-field--error' : ''}`}>
          <label>Kategoriya *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Tanlang...</option>
            {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="form-field__error">{errors.category}</span>}
        </div>
        <div className={`form-field ${errors.date ? 'form-field--error' : ''}`}>
          <label>Sana *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="form-field__error">{errors.date}</span>}
        </div>
      </div>
      <div className="form-field">
        <label>Izoh</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Qo'shimcha ma'lumot..." rows={2} />
      </div>
      <button type="submit" className="entry-form__submit entry-form__submit--income">
        <MdAdd size={18} /> Daromad qo'shish
      </button>
    </form>
  );
};

export default IncomeForm;
