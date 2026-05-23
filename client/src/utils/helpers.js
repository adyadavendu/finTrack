// Utility helpers for formatting and exports

export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });

  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return formatter.format(0);
  }

  return formatter.format(Number(amount));
};

export const formatDate = (date) => {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const getMonthName = (month) => {
  const index = Number(month);

  if (Number.isNaN(index) || index < 1 || index > 12) {
    return '';
  }

  const date = new Date(2020, index - 1, 1);
  return date.toLocaleString('en-US', { month: 'long' });
};

export const getCurrentMonth = () => new Date().getMonth() + 1;

export const getCurrentYear = () => new Date().getFullYear();

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
