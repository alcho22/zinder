import { Link, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { to: '/categories', label: 'Categories' },
  { to: '/services', label: 'Services' },
  { to: '/providers', label: 'Find a Pro' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function PublicLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const dashHref = user
    ? user.role === 'admin'
      ? '/admin'
      : user.role === 'provider'
        ? '/provider/dashboard'
        : '/dashboard'
    : '/login';

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <Link to={dashHref} className="btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>
          <button className="btn-ghost md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            ☰
          </button>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  {n.label}
                </NavLink>
              ))}
              <Link to={dashHref} onClick={() => setOpen(false)} className="btn-primary mt-2">
                {user ? 'Dashboard' : 'Log in'}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            The easiest way to find and request trusted automotive services in Austin, Texas.
          </p>
        </div>
        <FooterCol title="Marketplace" links={[
          ['Browse categories', '/categories'],
          ['All services', '/services'],
          ['Find a provider', '/providers'],
          ['Become a provider', '/register'],
        ]} />
        <FooterCol title="Company" links={[
          ['About Zinder', '/about'],
          ['Contact us', '/contact'],
          ['FAQ', '/faq'],
        ]} />
        <FooterCol title="Legal" links={[
          ['Privacy Policy', '/privacy-policy'],
          ['Terms of Service', '/terms'],
          ['SMS Terms', '/sms-terms'],
          ['Refund Policy', '/refund-policy'],
          ['Provider Agreement', '/provider-agreement'],
        ]} />
      </div>
      <div className="border-t border-slate-200 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Zinder Service LLC. All rights reserved. Zinder is a marketplace; services are
          performed by independent providers.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-900">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-slate-500 hover:text-brand-600">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
