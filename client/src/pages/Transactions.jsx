// Transactions list with filters and actions

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TransactionRow from '../components/TransactionRow';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/api';
import { exportToCSV } from '../utils/helpers';

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

const initialForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: '',
  notes: '',
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response?.data ?? []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() =>
    transactions.filter((transaction) => {
      const matchesSearch = transaction.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || transaction.category === categoryFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    }),
  [transactions, search, categoryFilter, typeFilter]);

  const openAddModal = () => {
    setForm(initialForm);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setForm({
      title: transaction.title || '',
      amount: transaction.amount || '',
      type: transaction.type || 'expense',
      category: transaction.category || 'Food',
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      notes: transaction.notes || '',
      id: transaction._id,
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm('Delete this transaction?')) {
      return;
    }

    try {
      await deleteTransaction(transaction._id);
      toast.success('Transaction deleted.');
      await loadTransactions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date ? new Date(form.date).toISOString() : undefined,
      notes: form.notes,
    };

    try {
      if (isEditing) {
        await updateTransaction(form.id, payload);
        toast.success('Transaction updated.');
      } else {
        await createTransaction(payload);
        toast.success('Transaction added.');
      }
      setModalOpen(false);
      await loadTransactions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Save failed.');
    }
  };

  const exportTransactions = () => {
    const csvData = filteredTransactions.map((transaction) => ({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes || '',
    }));
    exportToCSV(csvData, 'transactions.csv');
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar />
      <main className="pl-0 md:pl-[240px] pb-20 md:pb-0">
        <div className="px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Transactions</h1>
              <p className="text-muted text-sm mt-1">Review and manage every transaction.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={exportTransactions}
                className="border border-border-dark px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Add Transaction
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <input
              placeholder="Search by title"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="mt-8 border border-border-dark bg-card">
            {loading ? (
              <div className="py-12">
                <Loader />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-6 text-muted text-sm">No transactions match your filters.</div>
            ) : (
              <div className="p-6">
                {filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-2"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className="mt-2"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Type</label>
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className="mt-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
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
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em]"
          >
            {isEditing ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
