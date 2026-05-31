import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MdPersonAdd, MdEdit, MdDelete, MdBlock, MdCheckCircle,
  MdClose, MdSearch,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { formatCurrency } from '../../../utils/helpers';
import Modal from '../../../components/Modal/Modal';
import adminService from '../../../services/admin.service.js';
import '../AdminDashboard/AdminDashboard.css';
import './AdminUsers.css';

const USE_API = import.meta.env.VITE_USE_API === 'true';
const EMPTY_FORM = { fullName: '', email: '', password: '', role: 'user', status: 'active' };

const AdminUsers = () => {
  const { users: localUsers, adminUpdateUser, adminDeleteUser, adminCreateUser } = useAuth();
  const { incomes, expenses } = useFinance();

  // ── API mode state ────────────────────────────────────────────────────────────
  const [apiUsers, setApiUsers]   = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);

  const fetchApiUsers = useCallback(async () => {
    if (!USE_API) return;
    setLoadingApi(true);
    try {
      const data = await adminService.getUsers({ limit: 100 });
      setApiUsers(data.users || []);
    } catch (err) {
      console.error('Admin users fetch error:', err);
    } finally {
      setLoadingApi(false);
    }
  }, []);

  useEffect(() => { fetchApiUsers(); }, [fetchApiUsers]);

  // ── Unified users list ────────────────────────────────────────────────────────
  const allUsers = USE_API ? apiUsers : localUsers;
  const regularUsers = allUsers.filter(u => {
    const role = (u.role || '').toLowerCase();
    return role !== 'admin';
  });

  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('all');
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal]     = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]   = useState({});
  const [msg, setMsg]                 = useState('');

  const filtered = useMemo(() => {
    let list = regularUsers;
    if (search) list = list.filter(u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter !== 'all') list = list.filter(u =>
      (u.status || '').toLowerCase() === roleFilter
    );
    return list;
  }, [regularUsers, search, roleFilter]);

  const getUserStats = (userId) => {
    const inc = incomes.filter(i => i.userId === userId).reduce((s, i) => s + i.amount, 0);
    const exp = expenses.filter(e => e.userId === userId).reduce((s, e) => s + e.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  };

  // ── Create ────────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Ism kiritilishi shart';
    if (!form.email.trim())    errs.email    = 'Email kiritilishi shart';
    if (!form.password || form.password.length < 6) errs.password = 'Kamida 6 ta belgi';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    if (USE_API) {
      try {
        await adminService.createUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role.toUpperCase(),
        });
        await fetchApiUsers();
        setCreateModal(false);
        setForm(EMPTY_FORM);
        setFormErrors({});
        showMsg("Foydalanuvchi muvaffaqiyatli qo'shildi!");
      } catch (err) {
        setFormErrors({ email: err.message });
      }
    } else {
      const res = adminCreateUser(form.fullName, form.email, form.password, form.role);
      if (res.success) {
        setCreateModal(false);
        setForm(EMPTY_FORM);
        setFormErrors({});
        showMsg("Foydalanuvchi muvaffaqiyatli qo'shildi!");
      } else {
        setFormErrors({ email: res.message });
      }
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setEditModal(user);
    setForm({ fullName: user.fullName, email: user.email, password: '', role: (user.role || 'user').toLowerCase(), status: (user.status || 'active').toLowerCase() });
    setFormErrors({});
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const updates = { fullName: form.fullName, email: form.email, role: form.role, status: form.status };
    if (form.password) updates.password = form.password;

    if (USE_API) {
      try {
        await adminService.updateUser(editModal.id, {
          ...updates,
          role:   updates.role.toUpperCase(),
          status: updates.status.toUpperCase(),
        });
        await fetchApiUsers();
        setEditModal(null);
        showMsg('Foydalanuvchi yangilandi!');
      } catch (err) {
        showMsg(`Xato: ${err.message}`);
      }
    } else {
      adminUpdateUser(editModal.id, updates);
      setEditModal(null);
      showMsg('Foydalanuvchi yangilandi!');
    }
  };

  // ── Toggle status ─────────────────────────────────────────────────────────────
  const toggleStatus = async (user) => {
    if (USE_API) {
      try {
        await adminService.toggleUserStatus(user.id);
        await fetchApiUsers();
        showMsg('Holat yangilandi!');
      } catch (err) {
        showMsg(`Xato: ${err.message}`);
      }
    } else {
      const newStatus = (user.status || 'active').toLowerCase() === 'active' ? 'inactive' : 'active';
      adminUpdateUser(user.id, { status: newStatus });
      showMsg(`Foydalanuvchi ${newStatus === 'active' ? 'faollashtirildi' : 'bloklandi'}!`);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (USE_API) {
      try {
        await adminService.deleteUser(deleteModal);
        await fetchApiUsers();
        setDeleteModal(null);
        showMsg("Foydalanuvchi o'chirildi!");
      } catch (err) {
        showMsg(`Xato: ${err.message}`);
        setDeleteModal(null);
      }
    } else {
      adminDeleteUser(deleteModal);
      setDeleteModal(null);
      showMsg("Foydalanuvchi o'chirildi!");
    }
  };

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
  };

  const getStatusLabel = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'active' ? 'Faol' : 'Bloklangan';
  };

  return (
    <div className="admin-users fade-in">
      <div className="admin-users__header">
        <div>
          <h2>Foydalanuvchilar</h2>
          <p>Jami {regularUsers.length} ta foydalanuvchi</p>
        </div>
        <button className="admin-users__add-btn" onClick={() => { setCreateModal(true); setForm(EMPTY_FORM); setFormErrors({}); }}>
          <MdPersonAdd size={17} /> Yangi User
        </button>
      </div>

      {msg && <div className="admin-msg">{msg}</div>}
      {loadingApi && <div style={{ textAlign: 'center', padding: 12, color: 'var(--color-text-muted)', fontSize: 13 }}>Yuklanmoqda...</div>}

      <div className="admin-users__controls">
        <div className="admin-search">
          <MdSearch size={17} className="admin-search__icon" />
          <input
            type="text" placeholder="Ism yoki email qidirish..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><MdClose size={14} /></button>}
        </div>
        <div className="admin-filter-tabs">
          {[
            { key: 'all',      label: 'Barchasi' },
            { key: 'active',   label: 'Faol' },
            { key: 'inactive', label: 'Bloklangan' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`admin-filter-tab ${roleFilter === key ? 'admin-filter-tab--active' : ''}`}
              onClick={() => setRoleFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-users__table-card">
        <div className="admin-users__table-info">
          <span>{filtered.length} ta natija</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Foydalanuvchi</th>
                <th>Ro'yxat sanasi</th>
                <th>Holat</th>
                <th>Daromad</th>
                <th>Xarajat</th>
                <th>Balans</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const stats = getUserStats(u.id);
                const statusLower = (u.status || '').toLowerCase();
                return (
                  <tr key={u.id}>
                    <td className="admin-table__num">{i + 1}</td>
                    <td>
                      <div className="admin-table__user">
                        <div className="admin-table__avatar">
                          {u.avatar ? <img src={u.avatar} alt="" /> : u.fullName[0]}
                        </div>
                        <div>
                          <p className="admin-table__name">{u.fullName}</p>
                          <p className="admin-table__email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {u.createdAt ? (typeof u.createdAt === 'string' ? u.createdAt.split('T')[0] : u.createdAt) : '—'}
                    </td>
                    <td>
                      <span className={`admin-status-badge admin-status-badge--${statusLower}`}>
                        {getStatusLabel(u.status)}
                      </span>
                    </td>
                    <td className="text-success">{formatCurrency(stats.income)}</td>
                    <td className="text-danger">{formatCurrency(stats.expense)}</td>
                    <td className={stats.balance >= 0 ? 'text-success' : 'text-danger'}>
                      {formatCurrency(stats.balance)}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-action-btn admin-action-btn--edit" onClick={() => openEdit(u)} title="Tahrirlash">
                          <MdEdit size={15} />
                        </button>
                        <button
                          className={`admin-action-btn ${statusLower === 'active' ? 'admin-action-btn--block' : 'admin-action-btn--unblock'}`}
                          onClick={() => toggleStatus(u)}
                          title={statusLower === 'active' ? 'Bloklash' : 'Faollashtirish'}
                        >
                          {statusLower === 'active' ? <MdBlock size={15} /> : <MdCheckCircle size={15} />}
                        </button>
                        <button className="admin-action-btn admin-action-btn--delete" onClick={() => setDeleteModal(u.id)} title="O'chirish">
                          <MdDelete size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    Foydalanuvchi topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Yangi Foydalanuvchi" size="sm">
        <form className="admin-form" onSubmit={handleCreate}>
          <div className={`form-field ${formErrors.fullName ? 'form-field--error' : ''}`}>
            <label>To'liq ism *</label>
            <input name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="Ism Familiya" />
            {formErrors.fullName && <span className="form-field__error">{formErrors.fullName}</span>}
          </div>
          <div className={`form-field ${formErrors.email ? 'form-field--error' : ''}`}>
            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="email@example.com" />
            {formErrors.email && <span className="form-field__error">{formErrors.email}</span>}
          </div>
          <div className={`form-field ${formErrors.password ? 'form-field--error' : ''}`}>
            <label>Parol *</label>
            <input type="password" name="password" value={form.password} onChange={handleFormChange} placeholder="Kamida 6 ta belgi" />
            {formErrors.password && <span className="form-field__error">{formErrors.password}</span>}
          </div>
          <div className="form-field">
            <label>Rol</label>
            <select name="role" value={form.role} onChange={handleFormChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="admin-form__actions">
            <button type="button" className="admin-form__cancel" onClick={() => setCreateModal(false)}>Bekor</button>
            <button type="submit" className="admin-form__submit">Qo'shish</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Foydalanuvchini Tahrirlash" size="sm">
        <form className="admin-form" onSubmit={handleEdit}>
          <div className="form-field">
            <label>To'liq ism</label>
            <input name="fullName" value={form.fullName} onChange={handleFormChange} />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleFormChange} />
          </div>
          <div className="form-field">
            <label>Yangi parol (ixtiyoriy)</label>
            <input type="password" name="password" value={form.password} onChange={handleFormChange} placeholder="O'zgartirmaslik uchun bo'sh qoldiring" />
          </div>
          <div className="form-field">
            <label>Rol</label>
            <select name="role" value={form.role} onChange={handleFormChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-field">
            <label>Holat</label>
            <select name="status" value={form.status} onChange={handleFormChange}>
              <option value="active">Faol</option>
              <option value="inactive">Bloklangan</option>
            </select>
          </div>
          <div className="admin-form__actions">
            <button type="button" className="admin-form__cancel" onClick={() => setEditModal(null)}>Bekor</button>
            <button type="submit" className="admin-form__submit">Saqlash</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Foydalanuvchini O'chirish" size="sm">
        <div className="admin-delete-confirm">
          <p>Bu foydalanuvchini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.</p>
          <div className="admin-form__actions">
            <button className="admin-form__cancel" onClick={() => setDeleteModal(null)}>Bekor</button>
            <button className="admin-form__submit admin-form__submit--danger" onClick={handleDelete}>O'chirish</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
