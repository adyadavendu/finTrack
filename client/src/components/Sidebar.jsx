// Sidebar and mobile navigation for FinTrack

import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiRepeat,
  FiTarget,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: FiHome },
  { label: 'Transactions', to: '/transactions', icon: FiRepeat },
  { label: 'Budget', to: '/budget', icon: FiTarget },
  { label: 'Analytics', to: '/analytics', icon: FiBarChart2 },
  { label: 'Debts', to: '/debts', icon: FiUsers },
  { label: 'Settings', to: '/settings', icon: FiSettings },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] bg-[#0F0F0F] border-r border-border-dark flex-col justify-between">
        <div>
          <div className="px-6 pt-8 pb-6 border-b border-border-dark">
            <div className="text-white text-lg tracking-[0.2em]">FINTRACK</div>
            <div className="text-muted text-xs mt-2 uppercase tracking-[0.2em]">Personal Finance</div>
          </div>
          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-6 py-3 text-sm border-l-2 transition-colors',
                      isActive
                        ? 'text-white border-white'
                        : 'text-muted border-transparent hover:text-white',
                    ].join(' ')
                  }
                >
                  <Icon className="text-base" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-border-dark">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted border border-border-dark hover:text-white transition-colors"
          >
            <FiLogOut className="text-base" />
            Logout
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-border-dark z-40">
        <div className="grid grid-cols-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center justify-center py-3 text-[10px] uppercase tracking-[0.15em] border-t-2 transition-colors',
                    isActive
                      ? 'text-white border-white'
                      : 'text-muted border-transparent',
                  ].join(' ')
                }
              >
                <Icon className="text-base" />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
