import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { listCustomerOrders } from '@/services/orders';
import { EmptyState, OrderStatusBadge, PageHeader, PageLoader } from '@/components/ui';
import { dateOnly, money } from '@/lib/format';

export default function CustomerOrders() {
  const { user } = useAuth();
  const { data: orders, loading } = useAsync(() => listCustomerOrders(user!.id), [user!.id]);

  return (
    <div>
      <PageHeader title="My Requests" subtitle="Track your service requests and quotes." action={<Link to="/providers" className="btn-primary">+ New request</Link>} />

      {loading ? (
        <PageLoader />
      ) : orders && orders.length > 0 ? (
        <div className="card divide-y divide-slate-100">
          {orders.map((o) => (
            <Link key={o.id} to={`/dashboard/orders/${o.id}`} className="flex flex-col gap-3 p-5 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{o.serviceName}</p>
                <p className="text-sm text-slate-500">{o.providerName} · {o.vehicleSnapshot.year} {o.vehicleSnapshot.make} {o.vehicleSnapshot.model}</p>
                <p className="text-xs text-slate-400">Requested {dateOnly(o.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                {o.quote && <span className="text-sm font-semibold text-slate-900">{money(o.quote.finalPrice)}</span>}
                <OrderStatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon="📋" title="No requests yet" description="Find a provider and submit your first service request." action={<Link to="/providers" className="btn-primary">Find a provider</Link>} />
      )}
    </div>
  );
}
