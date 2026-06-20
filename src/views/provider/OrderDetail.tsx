import { useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { useAsync } from '@/hooks/useAsync';
import { getOrder, rejectOrder, sendQuote } from '@/services/orders';
import { listServices } from '@/services/catalog';
import { getSettings } from '@/services/admin';
import { Alert, EmptyState, Modal, OrderStatusBadge, PageLoader, Spinner } from '@/components/ui';
import { dateTime, money } from '@/lib/format';

export default function ProviderOrderDetail() {
  const { id = '' } = useParams();
  const { data: order, loading, reload } = useAsync(() => getOrder(id), [id]);
  const { data: services } = useAsync(() => listServices(), []);
  const { data: settings } = useAsync(() => getSettings(), []);

  const [quoting, setQuoting] = useState(false);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoader />;
  if (!order) return <EmptyState icon="📥" title="Request not found" />;

  // Determine the lead fee for this service based on its tier + platform settings.
  const service = services?.find((s) => s.id === order.serviceId);
  const leadFee = !settings
    ? 0
    : service?.leadTier === 'high'
      ? settings.leadFeeHigh
      : service?.leadTier === 'low'
        ? settings.leadFeeLow
        : settings.leadFeeMedium;

  const submitQuote = async () => {
    setBusy(true);
    try {
      await sendQuote(order.id, Number(price), note, leadFee);
      setQuoting(false);
      reload();
    } finally {
      setBusy(false);
    }
  };

  const decline = async () => {
    if (!confirm('Decline this request?')) return;
    await rejectOrder(order.id);
    reload();
  };

  const isNew = order.status === 'pending';

  return (
    <div>
      <Link to="/provider/orders" className="text-sm text-slate-500 hover:text-brand-600">← Back to requests</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{order.serviceName}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">Request #{order.id} · {dateTime(order.createdAt)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900">Customer’s request</h2>
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

          {order.quote && (
            <div className="card border-brand-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Your quote</h2>
                <span className="text-2xl font-bold text-brand-700">{money(order.quote.finalPrice)}</span>
              </div>
              {order.quote.note && <p className="mt-2 text-sm text-slate-600">{order.quote.note}</p>}
              {order.status === 'accepted' && <Alert kind="success">The customer accepted your quote. Reach out to schedule the work.</Alert>}
            </div>
          )}

          {isNew && (
            <div className="card flex flex-wrap gap-3 p-6">
              <button onClick={() => setQuoting(true)} className="btn-primary">Accept & send quote</button>
              <button onClick={decline} className="btn-secondary">Decline</button>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Customer</h3>
            <p className="mt-1 text-sm text-slate-600">{order.customerName}</p>
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {isNew ? 'Full contact details are revealed after you accept the request.' : 'Contact details available — reach out to schedule.'}
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Vehicle</h3>
            <p className="mt-1 text-sm text-slate-600">{order.vehicleSnapshot.year} {order.vehicleSnapshot.make} {order.vehicleSnapshot.model} · {order.vehicleSnapshot.color}</p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Location</h3>
            <p className="mt-1 text-sm text-slate-600">{order.addressSnapshot.city}, {order.addressSnapshot.state} {order.addressSnapshot.zip}</p>
            {!isNew && <p className="text-sm text-slate-500">{order.addressSnapshot.line1}</p>}
          </div>
          {order.preferredDate && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">Preferred time</h3>
              <p className="mt-1 text-sm text-slate-600">{order.preferredDate} · {order.preferredTimeWindow}</p>
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={quoting}
        onClose={() => setQuoting(false)}
        title="Send a quote"
        footer={
          <>
            <button onClick={() => setQuoting(false)} className="btn-secondary">Cancel</button>
            <button onClick={submitQuote} disabled={busy || !price} className="btn-primary">{busy ? <Spinner className="h-4 w-4" /> : `Confirm — pay ${money(leadFee)} lead fee`}</button>
          </>
        }
      >
        <div className="space-y-4">
          <Alert kind="warning">
            Accepting this request charges a <strong>{money(leadFee)}</strong> lead fee
            {service?.leadTier ? ` (${service.leadTier}-value service)` : ''}. You only pay when you send a quote.
          </Alert>
          <div>
            <label className="label">Final price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" min={0} placeholder="240" />
          </div>
          <div>
            <label className="label">Note to customer</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input min-h-[90px]" placeholder="What's included, availability, etc." />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function formatValue(value: string | string[] | boolean | number): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}
