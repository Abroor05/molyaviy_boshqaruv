import React from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Qidirish...' }) => (
  <div className="search-bar">
    <MdSearch size={17} className="search-bar__icon" />
    <input
      type="text"
      className="search-bar__input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {value && (
      <button className="search-bar__clear" onClick={() => onChange('')}>
        <MdClose size={14} />
      </button>
    )}
  </div>
);

export default SearchBar;
