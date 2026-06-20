import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { listCustomerOrders } from '@/services/orders';
import { listVehicles } from '@/services/account';
import { OrderStatusBadge, PageHeader } from '@/components/ui';
import { dateOnly } from '@/lib/format';

export default function CustomerOverview() {
  const { user } = useAuth();
  const { data: orders } = useAsync(() => listCustomerOrders(user!.id), [user!.id]);
  const { data: vehicles } = useAsync(() => listVehicles(user!.id), [user!.id]);

  const stats = [
    { label: 'Active requests', value: orders?.filter((o) => ['pending', 'quote_sent'].includes(o.status)).length ?? 0, icon: '📋' },
    { label: 'Quotes received', value: orders?.filter((o) => o.status === 'quote_sent').length ?? 0, icon: '💬' },
    { label: 'Saved vehicles', value: vehicles?.length ?? 0, icon: '🚗' },
  ];

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.firstName}`} subtitle="Here’s a snapshot of your account." />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent requests</h2>
            <Link to="/dashboard/orders" className="text-sm font-medium text-brand-600">View all →</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {(orders ?? []).slice(0, 5).map((o) => (
              <Link key={o.id} to={`/dashboard/orders/${o.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{o.serviceName}</p>
                  <p className="text-sm text-slate-500">{o.providerName} · {dateOnly(o.createdAt)}</p>
                </div>
                <OrderStatusBadge status={o.status} />
              </Link>
            ))}
            {orders?.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">No requests yet. <Link to="/providers" className="text-brand-600">Find a provider →</Link></p>
            )}
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-brand-600 p-6 text-white">
          <div>
            <h2 className="text-lg font-semibold">Need a service?</h2>
            <p className="mt-2 text-sm text-brand-100">Search providers, compare prices, and request a quote in minutes.</p>
          </div>
          <Link to="/providers" className="btn-accent mt-6">Find a provider</Link>
        </div>
      </div>
    </div>
  );
}
