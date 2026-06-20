import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

/**
 * Shared shell for the Customer, Provider, and Admin dashboards. The `nav`
 * items and `title` differ per role; everything else (header, sign-out,
 * responsive sidebar) is shared.
 */
export function DashboardLayout({
  nav,
  title,
  accent = 'brand',
  headerExtra,
}: {
  nav: NavItem[];
  title: string;
  accent?: 'brand' | 'accent';
  headerExtra?: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-full bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Logo />
        </div>
        <div className="px-3 py-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <nav className="space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? accent === 'accent'
                        ? 'bg-accent-500/10 text-accent-600'
                        : 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full border-t border-slate-200 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            <span>🏠</span> Back to site
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button className="btn-ghost lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <div className="flex flex-1 items-center justify-end gap-4">
            {headerExtra}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs capitalize text-slate-400">{user?.role}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2 text-xs">Sign out</button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
