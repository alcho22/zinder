import { useParams, Link } from '@/lib/router';
import { useAsync } from '@/hooks/useAsync';
import { acceptQuote, getOrder } from '@/services/orders';
import { Alert, EmptyState, OrderStatusBadge, PageLoader } from '@/components/ui';
import { dateTime, money } from '@/lib/format';
import { useState } from 'react';

export default function CustomerOrderDetail() {
  const { id = '' } = useParams();
  const { data: order, loading, reload } = useAsync(() => getOrder(id), [id]);
  const [accepting, setAccepting] = useState(false);

  if (loading) return <PageLoader />;
  if (!order) return <EmptyState icon="📋" title="Request not found" />;

  const accept = async () => {
    setAccepting(true);
    try {
      await acceptQuote(order.id);
      reload();
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div>
      <Link to="/dashboard/orders" className="text-sm text-slate-500 hover:text-brand-600">← Back to requests</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{order.serviceName}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">Request #{order.id} · {dateTime(order.createdAt)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Quote */}
          {order.quote && (
            <div className="card border-brand-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Quote from {order.providerName}</h2>
                <span className="text-2xl font-bold text-brand-700">{money(order.quote.finalPrice)}</span>
              </div>
              {order.quote.note && <p className="mt-2 text-sm text-slate-600">{order.quote.note}</p>}
              {order.status === 'quote_sent' && (
                <div className="mt-4 flex gap-3">
                  <button onClick={accept} disabled={accepting} className="btn-primary">Accept quote</button>
                  <Link to={`/providers/${order.providerId}`} className="btn-secondary">View provider</Link>
                </div>
              )}
              {order.status === 'accepted' && <Alert kind="success">You accepted this quote. The provider will be in touch to schedule.</Alert>}
            </div>
          )}

          {order.status === 'pending' && (
            <Alert kind="info">Your request was sent to {order.providerName}. You’ll be notified when they respond with a quote.</Alert>
          )}
          {order.status === 'rejected' && (
            <Alert kind="warning">{order.providerName} was unable to take this request. Try another provider.</Alert>
          )}

          {/* Request details */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900">Request details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {order.selectedOptionsSnapshot.map((opt) => (
                <div key={opt.optionId} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{opt.label}</dt>
                  <dd className="text-right font-medium text-slate-800">{formatValue(opt.value)}</dd>
                </div>
              ))}
            </dl>
            {order.description && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{order.description}</p>
              </div>
            )}
            {order.photos.length > 0 && (
              <div className="mt-4 flex gap-2">
                {order.photos.map((src, i) => <img key={i} src={src} alt="" className="h-20 w-20 rounded-lg object-cover" />)}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Vehicle</h3>
            <p className="mt-1 text-sm text-slate-600">{order.vehicleSnapshot.year} {order.vehicleSnapshot.make} {order.vehicleSnapshot.model}</p>
            <p className="text-sm text-slate-500">{order.vehicleSnapshot.color}</p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Service location</h3>
            <p className="mt-1 text-sm text-slate-600">{order.addressSnapshot.line1}</p>
            <p className="text-sm text-slate-500">{order.addressSnapshot.city}, {order.addressSnapshot.state} {order.addressSnapshot.zip}</p>
          </div>
          {order.preferredDate && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">Preferred time</h3>
              <p className="mt-1 text-sm text-slate-600">{order.preferredDate}</p>
              <p className="text-sm text-slate-500">{order.preferredTimeWindow}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function formatValue(value: string | string[] | boolean | number): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}
