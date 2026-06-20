import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { listAllOrders } from '@/services/admin';
import { OrderStatusBadge, PageHeader, PageLoader } from '@/components/ui';
import { dateOnly, money } from '@/lib/format';

const STATUSES = ['', 'pending', 'quote_sent', 'accepted', 'rejected', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const { data: orders, loading } = useAsync(() => listAllOrders({ q: q || undefined, status: status || undefined }), [q, status]);

  return (
    <div>
      <PageHeader title="Orders" subtitle="All service requests across the marketplace." />

      <div className="mb-4 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer, provider, service, ID…" className="input max-w-xs" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[180px]">
          {STATUSES.map((s) => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All statuses'}</option>)}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(orders ?? []).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{o.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{o.serviceName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.customerName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.providerName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.quote ? money(o.quote.finalPrice) : '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{dateOnly(o.createdAt)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
              {orders?.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No orders match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
