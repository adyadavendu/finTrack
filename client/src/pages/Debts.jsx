// Debt tracking and obligations

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { createDebt, getDebts, updateDebt } from '../api/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const initialForm = {
  personName: '',
  amount: '',
  type: 'i_owe',
  dueDate: '',
  notes: '',
};

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadDebts = async () => {
    setLoading(true);
    try {
      const response = await getDebts();
      setDebts(response?.data ?? []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load debts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  const totals = useMemo(() => {
    const totalIOwe = debts
      .filter((debt) => debt.type === 'i_owe' && !debt.isPaid)
      .reduce((sum, debt) => sum + (debt.amount || 0), 0);
    const totalOwed = debts
      .filter((debt) => debt.type === 'owed_to_me' && !debt.isPaid)
      .reduce((sum, debt) => sum + (debt.amount || 0), 0);
    return { totalIOwe, totalOwed };
  }, [debts]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createDebt({
        personName: form.personName,
        amount: Number(form.amount),
        type: form.type,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        notes: form.notes,
      });
      toast.success('Debt added.');
      setModalOpen(false);
      setForm(initialForm);
      await loadDebts();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to add debt.');
    }
  };

  const markPaid = async (debt) => {
    try {
      await updateDebt(debt._id, { isPaid: true });
      toast.success('Marked as paid.');
      await loadDebts();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update debt.');
    }
  };

  const renderDebt = (debt) => (
    <div key={debt._id} className="border border-border-dark bg-card p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className={debt.isPaid ? 'text-muted line-through' : 'text-white'}>
            {debt.personName}
          </div>
          <div className="text-muted text-xs mt-1">Due {formatDate(debt.dueDate)}</div>
          {debt.notes && <div className="text-muted text-xs mt-2">{debt.notes}</div>}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className={debt.type === 'i_owe' ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
            {formatCurrency(debt.amount)}
          </div>
          {!debt.isPaid && (
            <button
              type="button"
              onClick={() => markPaid(debt)}
              className="border border-border-dark px-3 py-1 text-xs text-muted hover:text-white"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const iOwe = debts.filter((debt) => debt.type === 'i_owe');
  const owedToMe = debts.filter((debt) => debt.type === 'owed_to_me');

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar />
      <main className="pl-0 md:pl-[240px] pb-20 md:pb-0">
        <div className="px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Debts</h1>
              <p className="text-muted text-sm mt-1">Track what you owe and what you are owed.</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              Add Debt
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="border border-border-dark bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Total I Owe</div>
              <div className="text-2xl font-semibold mt-4 text-red-500">{formatCurrency(totals.totalIOwe)}</div>
            </div>
            <div className="border border-border-dark bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Total Owed to Me</div>
              <div className="text-2xl font-semibold mt-4 text-green-500">{formatCurrency(totals.totalOwed)}</div>
            </div>
          </div>

          {loading ? (
            <div className="py-12">
              <Loader />
            </div>
          ) : (
            <div className="mt-10 grid gap-8">
              <section>
                <h2 className="text-sm uppercase tracking-[0.2em] text-muted">I Owe</h2>
                <div className="mt-4 grid gap-3">
                  {iOwe.length === 0 ? (
                    <div className="text-muted text-sm">No debts in this category.</div>
                  ) : (
                    iOwe.map(renderDebt)
                  )}
                </div>
              </section>
              <section>
                <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Owed to Me</h2>
                <div className="mt-4 grid gap-3">
                  {owedToMe.length === 0 ? (
                    <div className="text-muted text-sm">No debts in this category.</div>
                  ) : (
                    owedToMe.map(renderDebt)
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Debt">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Person Name</label>
            <input
              value={form.personName}
              onChange={(event) => setForm((prev) => ({ ...prev, personName: event.target.value }))}
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
              <option value="i_owe">I Owe</option>
              <option value="owed_to_me">Owed To Me</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
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
            Save Debt
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Debts;
