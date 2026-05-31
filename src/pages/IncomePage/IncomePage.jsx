import React, { useState, useMemo } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import IncomeForm from '../../components/IncomeForm/IncomeForm';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import Pagination from '../../components/Pagination/Pagination';
import { INCOME_CATEGORIES, ITEMS_PER_PAGE } from '../../utils/constants';
import { formatCurrency, isCurrentMonth } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import './IncomePage.css';

const IncomePage = () => {
  const { user } = useAuth();
  const { getIncomesByUser, addIncome, deleteIncome } = useFinance();

  const incomes = useMemo(() => getIncomesByUser(user.id), [user.id, getIncomesByUser]);

  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage]       = useState(1);
  const [showForm, setShowForm] = useState(false);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let list = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (debouncedSearch) list = list.filter(i => i.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (filters.category) list = list.filter(i => i.category === filters.category);
    if (filters.dateFrom) list = list.filter(i => i.date >= filters.dateFrom);
    if (filters.dateTo)   list = list.filter(i => i.date <= filters.dateTo);
    return list;
  }, [incomes, debouncedSearch, filters]);

  const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated    = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const monthlyTotal = useMemo(() => incomes.filter(i => isCurrentMonth(i.date)).reduce((s, i) => s + i.amount, 0), [incomes]);

  return (
    <div className="list-page fade-in">
      <div className="list-page__header">
        <div>
          <h2>Daromadlar</h2>
          <p>
            Jami: <strong className="text-success">{formatCurrency(incomes.reduce((s, i) => s + i.amount, 0))}</strong>
            &nbsp;·&nbsp;Bu oy: <strong className="text-success">{formatCurrency(monthlyTotal)}</strong>
          </p>
        </div>
        <button className="list-page__add-btn list-page__add-btn--income" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><MdClose size={16} /> Yopish</> : <><MdAdd size={16} /> Daromad qo'shish</>}
        </button>
      </div>

      {showForm && (
        <div className="list-page__form-card">
          <h3>Yangi Daromad</h3>
          <IncomeForm onSubmit={(data) => { addIncome(data, user.id); setShowForm(false); }} />
        </div>
      )}

      <div className="list-page__controls">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Daromad qidirish..." />
        <FilterPanel
          categories={INCOME_CATEGORIES}
          filters={filters}
          onFilterChange={u => { setFilters(p => ({ ...p, ...u })); setPage(1); }}
          onReset={() => { setFilters({}); setPage(1); }}
        />
      </div>

      <div className="list-page__table-card">
        <div className="list-page__table-info"><span>{filtered.length} ta natija</span></div>
        <TransactionTable
          transactions={paginated.map(i => ({ ...i, type: 'income' }))}
          onDelete={id => deleteIncome(id)}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default IncomePage;
