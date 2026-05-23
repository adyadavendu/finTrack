// Budget planning page

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import BudgetBar from '../components/BudgetBar';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { createBudget, getBudgets, getCategorySummary } from '../api/api';
import { formatCurrency, getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

const Budget = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [budgets, setBudgets] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ category: 'Food', limit: '' });

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const [budgetResponse, summaryResponse] = await Promise.all([
        getBudgets(month, year),
        getCategorySummary(month, year),
      ]);
      setBudgets(budgetResponse?.data ?? []);
      setCategorySummary(summaryResponse?.data ?? []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [month, year]);

  const totalsByCategory = useMemo(() => {
    const map = new Map();
    categorySummary.forEach((item) => {
      map.set(item.category, item.total);
    });
    return map;
  }, [categorySummary]);

  const summaryTotals = useMemo(() => {
    const totalBudgeted = budgets.reduce((sum, budget) => sum + (budget.limit || 0), 0);
    const totalSpent = budgets.reduce(
      (sum, budget) => sum + (totalsByCategory.get(budget.category) || 0),
      0
    );
    return {
      totalBudgeted,
      totalSpent,
      remaining: totalBudgeted - totalSpent,
    };
  }, [budgets, totalsByCategory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createBudget({
        category: form.category,
        limit: Number(form.limit),
        month,
        year,
      });
      toast.success('Budget saved.');
      setModalOpen(false);
      setForm({ category: 'Food', limit: '' });
      await loadBudgets();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save budget.');
    }
  };

  const yearOptions = Array.from({ length: 5 }, (_, index) => getCurrentYear() - 2 + index);

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar />
      <main className="pl-0 md:pl-[240px] pb-20 md:pb-0">
        <div className="px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Budget</h1>
              <p className="text-muted text-sm mt-1">Plan and monitor your monthly limits.</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              Add Budget
            </button>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {getMonthName(value)}
                </option>
              ))}
            </select>
            <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {yearOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-border-dark bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Total Budgeted</div>
              <div className="text-2xl font-semibold mt-4">{formatCurrency(summaryTotals.totalBudgeted)}</div>
            </div>
            <div className="border border-border-dark bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Spent</div>
              <div className="text-2xl font-semibold mt-4 text-red-500">{formatCurrency(summaryTotals.totalSpent)}</div>
            </div>
            <div className="border border-border-dark bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Remaining</div>
              <div className="text-2xl font-semibold mt-4">{formatCurrency(summaryTotals.remaining)}</div>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="py-12">
                <Loader />
              </div>
            ) : budgets.length === 0 ? (
              <div className="border border-border-dark bg-card p-6 text-muted text-sm">
                No budgets created for this month.
              </div>
            ) : (
              <div className="grid gap-4">
                {budgets.map((budget) => (
                  <BudgetBar
                    key={budget._id}
                    category={budget.category}
                    spent={totalsByCategory.get(budget.category) || 0}
                    limit={budget.limit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Budget">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-2"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Limit</label>
            <input
              type="number"
              value={form.limit}
              onChange={(event) => setForm((prev) => ({ ...prev, limit: event.target.value }))}
              className="mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em]"
          >
            Save Budget
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
