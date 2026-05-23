// Transaction row item with optional actions

import { formatCurrency, formatDate } from '../utils/helpers';

const TransactionRow = ({ transaction, onEdit, onDelete }) => {
  const amountValue = formatCurrency(transaction?.amount ?? 0);
  const amountDisplay = transaction?.type === 'expense' ? `-${amountValue}` : amountValue;
  const amountClass = transaction?.type === 'expense' ? 'text-red-500' : 'text-green-500';
  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 border-b border-border-dark hover:bg-[#1F1F1F] transition-colors">
      <div>
        <div className="text-white text-sm font-medium">{transaction?.title || 'Untitled'}</div>
        <div className="text-muted text-xs mt-1">{transaction?.category || 'Uncategorized'}</div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <div className="text-muted text-xs">{formatDate(transaction?.date)}</div>
        <div className={`text-sm font-semibold ${amountClass}`}>{amountDisplay}</div>
        {showActions && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(transaction)}
                className="px-3 py-1 text-xs border border-border-dark text-muted hover:text-white"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(transaction)}
                className="px-3 py-1 text-xs border border-border-dark text-muted hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
