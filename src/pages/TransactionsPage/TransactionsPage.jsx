import React, { useState, useMemo } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import './TransactionsPage.css';

const SORT_OPTIONS = [
  { value: 'date-desc',   label: 'Sana (yangi)' },
  { value: 'date-asc',    label: 'Sana (eski)' },
  { value: 'amount-desc', label: 'Miqdor (katta)' },
  { value: 'amount-asc',  label: 'Miqdor (kichik)' },
];

const TransactionsPage = () => {
  const { user } = useAuth();
  const { getIncomesByUser, getExpensesByUser, deleteIncome, deleteExpense } = useFinance();

  const incomes  = useMemo(() => getIncomesByUser(user.id),  [user.id, getIncomesByUser]);
  const expenses = useMemo(() => getExpensesByUser(user.id), [user.id, getExpensesByUser]);

  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const balance      = totalIncome - totalExpense;

  const allTransactions = useMemo(() => [
    ...incomes.map(i  => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [incomes, expenses]);

  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('date-desc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage]             = useState(1);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let list = [...allTransactions];
    if (debouncedSearch) list = list.filter(t => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter);
    const [field, dir] = sort.split('-');
    list.sort((a, b) => {
      const va = field === 'date' ? new Date(a.date) : a.amount;
      const vb = field === 'date' ? new Date(b.date) : b.amount;
      return dir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [allTransactions, debouncedSearch, sort, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id, type) => {
    if (type === 'income') deleteIncome(id);
    else deleteExpense(id);
  };

  const summaryCards = [
    { label: 'Jami Daromad', value: formatCurrency(totalIncome),  color: 'var(--color-success)', Icon: HiArrowUp },
    { label: 'Jami Xarajat', value: formatCurrency(totalExpense), color: 'var(--color-danger)',  Icon: HiArrowDown },
    { label: 'Balans',       value: formatCurrency(balance),      color: 'var(--color-primary)', Icon: MdSwapVert },
  ];

  return (
    <div className="transactions-page fade-in">
      <div className="transactions-page__header">
        <h2>Barcha Tranzaksiyalar</h2>
        <p>Jami {allTransactions.length} ta tranzaksiya</p>
      </div>

      <div className="transactions-page__summary">
        {summaryCards.map(({ label, value, color, Icon }) => (
          <div key={label} className="tx-summary-card">
            <div className="tx-summary-card__icon" style={{ background: color + '20', color }}>
              <Icon size={20} />
            </div>
            <div>
              <p>{label}</p>
              <strong style={{ color }}>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="transactions-page__controls">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Tranzaksiya qidirish..." />
        <div className="transactions-page__filters">
          <div className="type-filter">
            {[
              { key: 'all',     label: 'Barchasi' },
              { key: 'income',  label: 'Daromad' },
              { key: 'expense', label: 'Xarajat' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`type-filter__btn ${typeFilter === key ? 'type-filter__btn--active' : ''}`}
                onClick={() => { setTypeFilter(key); setPage(1); }}
              >
                {label}
              </button>
            ))}
          </div>
          <select className="transactions-page__sort" value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="transactions-page__table-card">
        <div className="transactions-page__table-info">
          <span>{filtered.length} ta natija</span>
          <span>Sahifa {page} / {totalPages || 1}</span>
        </div>
        <TransactionTable transactions={paginated} onDelete={handleDelete} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default TransactionsPage;
