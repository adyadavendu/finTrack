// Budget progress bar for a category

import { formatCurrency } from '../utils/helpers';

const BudgetBar = ({ category, spent = 0, limit = 0 }) => {
  const percentRaw = limit > 0 ? (spent / limit) * 100 : 0;
  const percent = Math.min(percentRaw, 100);
  const isOver = spent > limit && limit > 0;
  const isNear = spent > limit * 0.8 && !isOver;
  const fillClass = isOver ? 'bg-red-500' : isNear ? 'bg-yellow-500' : 'bg-white';

  return (
    <div className="border border-border-dark p-4 bg-card">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white">{category}</span>
        <span className="text-muted">
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </span>
      </div>
      <div className="mt-3 h-2 bg-border-dark">
        <div
          className={`h-2 ${fillClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 text-right text-xs text-muted">
        {limit > 0 ? `${Math.round(percentRaw)}%` : '0%'}
      </div>
    </div>
  );
};

export default BudgetBar;
