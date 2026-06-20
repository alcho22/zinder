import type { ReactNode } from 'react';
import type { OrderStatus, ProviderStatus, ProviderApplicationStatus } from '@/types';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
      <Spinner className="h-6 w-6 text-brand-600" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon = '📭',
  action,
}: {
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-accent-500" aria-hidden>
        {'★'.repeat(full)}
        <span className="text-slate-300">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="font-semibold text-slate-700">{rating.toFixed(1)}</span>
      {count != null && <span className="text-slate-400">({count})</span>}
    </span>
  );
}

const ORDER_STATUS_STYLES: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending response', cls: 'bg-amber-100 text-amber-800' },
  quote_sent: { label: 'Quote sent', cls: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Declined', cls: 'bg-slate-200 text-slate-600' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS_STYLES[status];
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

const PROVIDER_STATUS_STYLES: Record<ProviderStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  suspended: { label: 'Suspended', cls: 'bg-red-100 text-red-700' },
};

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const s = PROVIDER_STATUS_STYLES[status];
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

const APP_STATUS_STYLES: Record<ProviderApplicationStatus, { label: string; cls: string }> = {
  none: { label: 'Not applied', cls: 'bg-slate-100 text-slate-600' },
  pending: { label: 'Pending approval', cls: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  more_info_requested: { label: 'More info requested', cls: 'bg-blue-100 text-blue-800' },
};

export function ApplicationStatusBadge({ status }: { status: ProviderApplicationStatus }) {
  const s = APP_STATUS_STYLES[status];
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Alert({ kind = 'info', children }: { kind?: 'info' | 'success' | 'warning' | 'error'; children: ReactNode }) {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  }[kind];
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
