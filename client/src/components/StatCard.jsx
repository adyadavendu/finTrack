// Summary statistic card

const StatCard = ({ title, value, prefix = '', type = 'neutral' }) => {
  const valueColor =
    type === 'income' ? 'text-green-500' : type === 'expense' ? 'text-red-500' : 'text-white';

  return (
    <div className="bg-card border border-border-dark p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-muted">{title}</div>
      <div className={`mt-4 text-3xl font-semibold ${valueColor}`}>
        {prefix}{value}
      </div>
    </div>
  );
};

export default StatCard;
