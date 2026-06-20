import { useState } from 'react';
import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { getMyProviderProfile } from '@/services/providers';
import { listProviderOrders } from '@/services/orders';
import { EmptyState, OrderStatusBadge, PageHeader, PageLoader } from '@/components/ui';
import { dateOnly } from '@/lib/format';
import type { OrderStatus } from '@/types';

const FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'New' },
  { value: 'quote_sent', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Declined' },
];

export default function ProviderOrders() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const { data: profile } = useAsync(() => getMyProviderProfile(user!.id), [user!.id]);
  const { data: orders, loading } = useAsync(async () => (profile ? listProviderOrders(profile.id) : []), [profile?.id]);

  const filtered = (orders ?? []).filter((o) => filter === 'all' || o.status === filter);

  return (
    <div>
      <PageHeader title="Requests" subtitle="Respond to customer requests with a quote." />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`badge px-3 py-1.5 ${filter === f.value ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : filtered.length > 0 ? (
        <div className="card divide-y divide-slate-100">
          {filtered.map((o) => (
            <Link key={o.id} to={`/provider/orders/${o.id}`} className="flex flex-col gap-3 p-5 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{o.serviceName}</p>
                <p className="text-sm text-slate-500">{o.customerName} · {o.vehicleSnapshot.year} {o.vehicleSnapshot.make} {o.vehicleSnapshot.model}</p>
                <p className="text-xs text-slate-400">{dateOnly(o.createdAt)} · {o.addressSnapshot.city}, {o.addressSnapshot.state}</p>
              </div>
              <OrderStatusBadge status={o.status} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon="📥" title="No requests" description="New customer requests will appear here." />
      )}
    </div>
  );
}
