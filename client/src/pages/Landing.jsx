// Marketing landing page for FinTrack

import { Link } from 'react-router-dom';

const features = [
  {
    title: 'TRACK',
    description: 'Capture every transaction with clean, fast entry and instant clarity.',
  },
  {
    title: 'BUDGET',
    description: 'Plan monthly limits with category-level discipline and visibility.',
  },
  {
    title: 'ANALYZE',
    description: 'See trends, spot spikes, and make confident decisions.',
  },
];

const stats = [
  { label: 'Assets managed', value: '$2.4B' },
  { label: 'Active users', value: '150K+' },
  { label: 'Countries', value: '42' },
];

const Landing = () => (
  <div className="min-h-screen bg-background text-white">
    <header className="border-b border-border-dark">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="text-lg tracking-[0.2em]">FINTRACK</div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">
          <Link to="/login" className="text-muted hover:text-white">
            Login
          </Link>
          <Link
            to="/register"
            className="border border-border-dark px-4 py-2 hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>

    <main className="max-w-6xl mx-auto px-6 md:px-12">
      <section className="py-16 md:py-24 border-b border-border-dark">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold">Your Finances. Simplified.</h1>
          <p className="text-muted mt-6 text-lg">
            FinTrack keeps your money organized, your budgets tight, and your goals visible.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-6 py-3 text-xs uppercase tracking-[0.2em] text-center"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-border-dark px-6 py-3 text-xs uppercase tracking-[0.2em] text-center"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 grid md:grid-cols-3 gap-6 border-b border-border-dark">
        {features.map((feature) => (
          <div key={feature.title} className="border border-border-dark bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{feature.title}</div>
            <p className="mt-4 text-sm text-white leading-6">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="py-12 grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border-dark bg-card p-6">
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="text-muted text-xs mt-2 uppercase tracking-[0.2em]">
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </main>

    <footer className="border-t border-border-dark py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm tracking-[0.2em]">FINTRACK</div>
        <div className="text-xs text-muted">
          2026 FinTrack. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
