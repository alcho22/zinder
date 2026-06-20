import type { ReactNode } from 'react';
import { Link } from '@/lib/router';
import { Logo } from '@/components/Logo';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-8" />
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
          <p className="mt-10 text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-brand-600">← Back to Zinder</Link>
          </p>
        </div>
      </div>
      {/* Brand side */}
      <div className="hidden flex-col justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Austin’s automotive services marketplace.</h2>
          <p className="mt-4 text-brand-100">
            Find trusted local pros, compare prices and reviews, and request quotes in minutes.
          </p>
          <ul className="mt-8 space-y-3 text-brand-50">
            {['Compare local providers side by side', 'Request structured quotes in under 5 minutes', 'Mobile & on-site service options'].map((t) => (
              <li key={t} className="flex items-center gap-3"><span className="text-accent-400">✓</span> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
