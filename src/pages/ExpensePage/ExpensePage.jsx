import React, { useState, useMemo } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import ExpenseForm from '../../components/ExpenseForm/ExpenseForm';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import Pagination from '../../components/Pagination/Pagination';
import { EXPENSE_CATEGORIES, ITEMS_PER_PAGE } from '../../utils/constants';
import { formatCurrency, isCurrentMonth } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import './ExpensePage.css';

const ExpensePage = () => {
  const { user } = useAuth();
  const { getExpensesByUser, addExpense, deleteExpense } = useFinance();

  const expenses = useMemo(() => getExpensesByUser(user.id), [user.id, getExpensesByUser]);

  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({});
  const [page, setPage]         = useState(1);
  const [showForm, setShowForm] = useState(false);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let list = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (debouncedSearch) list = list.filter(i => i.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (filters.category) list = list.filter(i => i.category === filters.category);
    if (filters.dateFrom) list = list.filter(i => i.date >= filters.dateFrom);
    if (filters.dateTo)   list = list.filter(i => i.date <= filters.dateTo);
    return list;
  }, [expenses, debouncedSearch, filters]);

  const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated    = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const monthlyTotal = useMemo(
    () => expenses.filter(i => isCurrentMonth(i.date)).reduce((s, i) => s + i.amount, 0),
    [expenses]
  );

  return (
    <div className="list-page fade-in">
      <div className="list-page__header">
        <div>
          <h2>Xarajatlar</h2>
          <p>
            Jami: <strong className="text-danger">{formatCurrency(expenses.reduce((s, i) => s + i.amount, 0))}</strong>
            &nbsp;·&nbsp;Bu oy: <strong className="text-danger">{formatCurrency(monthlyTotal)}</strong>
          </p>
        </div>
        <button className="list-page__add-btn list-page__add-btn--expense" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><MdClose size={16} /> Yopish</> : <><MdAdd size={16} /> Xarajat qo'shish</>}
        </button>
      </div>

      {showForm && (
        <div className="list-page__form-card">
          <h3>Yangi Xarajat</h3>
          <ExpenseForm onSubmit={(data) => { addExpense(data, user.id); setShowForm(false); }} />
        </div>
      )}

      <div className="list-page__controls">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Xarajat qidirish..." />
        <FilterPanel
          categories={EXPENSE_CATEGORIES}
          filters={filters}
          onFilterChange={u => { setFilters(p => ({ ...p, ...u })); setPage(1); }}
          onReset={() => { setFilters({}); setPage(1); }}
        />
      </div>

      <div className="list-page__table-card">
        <div className="list-page__table-info"><span>{filtered.length} ta natija</span></div>
        <TransactionTable
          transactions={paginated.map(i => ({ ...i, type: 'expense' }))}
          onDelete={id => deleteExpense(id)}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ExpensePage;
