import React, { useState } from 'react';
import { MdFilterList, MdClose } from 'react-icons/md';
import './FilterPanel.css';

const FilterPanel = ({ categories, filters, onFilterChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasFilter = filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="filter-panel">
      <button
        className={`filter-panel__toggle ${isOpen ? 'active' : ''} ${hasFilter ? 'has-filter' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdFilterList size={16} />
        <span>Filtrlash</span>
        {hasFilter && <span className="filter-panel__dot" />}
      </button>

      {isOpen && (
        <div className="filter-panel__dropdown">
          <div className="filter-panel__header">
            <span>Filtrlash</span>
            <button onClick={() => setIsOpen(false)}>
              <MdClose size={16} />
            </button>
          </div>
          <div className="filter-panel__body">
            <div className="form-field">
              <label>Kategoriya</label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFilterChange({ category: e.target.value })}
              >
                <option value="">Barchasi</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Boshlanish</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Tugash</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => onFilterChange({ dateTo: e.target.value })}
              />
            </div>
          </div>
          <div className="filter-panel__footer">
            <button className="filter-panel__reset" onClick={() => { onReset(); setIsOpen(false); }}>
              Tozalash
            </button>
            <button className="filter-panel__apply" onClick={() => setIsOpen(false)}>
              Qo'llash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
