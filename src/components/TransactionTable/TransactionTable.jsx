import React from 'react';
import { MdDeleteOutline, MdInbox } from 'react-icons/md';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './TransactionTable.css';

const TransactionTable = ({ transactions, onDelete, showActions = true }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="tx-empty">
        <MdInbox size={48} className="tx-empty__icon" />
        <p>Tranzaksiyalar topilmadi</p>
      </div>
    );
  }

  return (
    <div className="tx-table-wrapper">
      <table className="tx-table">
        <thead>
          <tr>
            <th>Sarlavha</th>
            <th>Kategoriya</th>
            <th>Sana</th>
            <th>Miqdor</th>
            <th>Tur</th>
            {showActions && <th></th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="tx-table__row">
              <td>
                <div className="tx-table__title-cell">
                  <div className={`tx-table__type-dot tx-table__type-dot--${tx.type}`}>
                    {tx.type === 'income'
                      ? <HiArrowUp size={11} />
                      : <HiArrowDown size={11} />
                    }
                  </div>
                  <span className="tx-table__title">{tx.title}</span>
                </div>
              </td>
              <td>
                <span className="tx-table__category">{tx.category}</span>
              </td>
              <td className="tx-table__date">{formatDate(tx.date)}</td>
              <td>
                <span className={`tx-table__amount tx-table__amount--${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </td>
              <td>
                <span className={`badge badge-${tx.type}`}>
                  {tx.type === 'income' ? 'Daromad' : 'Xarajat'}
                </span>
              </td>
              {showActions && (
                <td>
                  <button
                    className="tx-table__delete"
                    onClick={() => onDelete && onDelete(tx.id, tx.type)}
                    title="O'chirish"
                  >
                    <MdDeleteOutline size={17} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
