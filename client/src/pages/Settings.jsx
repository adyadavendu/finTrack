// User profile and security settings

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import { apiClient } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiClient.put('/auth/update-profile', profile);
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update profile.');
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await apiClient.put('/auth/update-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password updated.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account. Continue?')) {
      return;
    }

    try {
      await apiClient.delete('/auth/delete-account');
      toast.success('Account deleted.');
      logout();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete account.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar />
      <main className="pl-0 md:pl-[240px] pb-20 md:pb-0">
        <div className="px-6 md:px-10 py-10">
          <h1 className="text-2xl font-semibold">Settings</h1>

          <section className="mt-8 border border-border-dark bg-card p-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Profile</h2>
            <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Name</label>
                <input
                  value={profile.name}
                  onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Save Changes
              </button>
            </form>
          </section>

          <section className="mt-8 border border-border-dark bg-card p-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Security</h2>
            <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(event) =>
                    setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Confirm Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    setPasswords((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  className="mt-2"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Update Password
              </button>
            </form>
          </section>

          <section className="mt-8 border border-red-500 bg-card p-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-red-500">Danger Zone</h2>
            <div className="mt-4 text-muted text-sm">
              Deleting your account removes all data permanently.
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="mt-6 border border-red-500 text-red-500 px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              Delete My Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
