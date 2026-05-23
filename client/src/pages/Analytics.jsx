// Analytics and category insights

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { getCategorySummary, getOverview } from '../api/api';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DONUT_COLORS = ['#FFFFFF', '#666666', '#2A2A2A', '#1A1A1A', '#FFFFFF'];

const Analytics = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [overview, setOverview] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [overviewResponse, categoryResponse] = await Promise.all([
          getOverview(),
          getCategorySummary(month, year),
        ]);
        setOverview(overviewResponse?.data ?? overviewResponse ?? []);
        setCategorySummary(categoryResponse?.data ?? []);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [month, year]);

  const chartData = useMemo(() =>
    (overview || []).map((item) => ({
      name: getMonthName(item.month).slice(0, 3),
      income: item.income,
      expenses: item.expenses,
    })),
  [overview]);

  const topCategories = useMemo(() => categorySummary.slice(0, 5), [categorySummary]);

  const yearOptions = Array.from({ length: 5 }, (_, index) => getCurrentYear() - 2 + index);

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar />
      <main className="pl-0 md:pl-[240px] pb-20 md:pb-0">
        <div className="px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Analytics</h1>
              <p className="text-muted text-sm mt-1">Visualize trends and category performance.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
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
          </div>

          {loading ? (
            <div className="py-12">
              <Loader />
            </div>
          ) : (
            <>
              <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="border border-border-dark bg-card p-6">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Income vs Expenses</h2>
                  <div className="mt-6 h-64">
                    {chartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted text-sm">
                        No data yet.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" stroke="#666666" />
                          <YAxis stroke="#666666" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1A1A1A',
                              border: '1px solid #2A2A2A',
                              color: '#FFFFFF',
                              borderRadius: 0,
                            }}
                          />
                          <Bar dataKey="income" fill="#FFFFFF" />
                          <Bar dataKey="expenses" fill="#666666" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                <div className="border border-border-dark bg-card p-6">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Spending Breakdown</h2>
                  <div className="mt-6 h-64">
                    {categorySummary.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted text-sm">
                        No expenses recorded.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySummary}
                            dataKey="total"
                            nameKey="category"
                            innerRadius={60}
                            outerRadius={90}
                          >
                            {categorySummary.map((entry, index) => (
                              <Cell
                                key={`cell-${entry.category}`}
                                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1A1A1A',
                              border: '1px solid #2A2A2A',
                              color: '#FFFFFF',
                              borderRadius: 0,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </section>

              <section className="mt-8 border border-border-dark bg-card p-6">
                <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Top Categories</h2>
                {topCategories.length === 0 ? (
                  <div className="text-muted text-sm mt-4">No category data yet.</div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {topCategories.map((item, index) => {
                      const percent = categorySummary[0]
                        ? Math.round((item.total / categorySummary[0].total) * 100)
                        : 0;
                      return (
                        <div key={item.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.category}</span>
                            <span className="text-muted">{item.total.toFixed(2)}</span>
                          </div>
                          <div className="h-2 bg-border-dark">
                            <div
                              className="h-2 bg-white"
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
