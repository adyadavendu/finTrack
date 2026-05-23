// Registration page for new users

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to register.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-border-dark bg-card p-8">
        <div className="text-lg tracking-[0.2em]">FINTRACK</div>
        <h1 className="text-2xl font-semibold mt-6">Create your account</h1>
        <p className="text-muted text-sm mt-2">Start tracking your finances in minutes.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-2"
              placeholder="Alex Morgan"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2"
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em]"
          >
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
