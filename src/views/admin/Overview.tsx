import { Link } from '@/lib/router';
import { useAsync } from '@/hooks/useAsync';
import { getAdminStats, listAllOrders } from '@/services/admin';
import { OrderStatusBadge, PageHeader, PageLoader } from '@/components/ui';
import { dateOnly, money } from '@/lib/format';

export default function AdminOverview() {
  const { data: stats, loading } = useAsync(() => getAdminStats(), []);
  const { data: orders } = useAsync(() => listAllOrders(), []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Lead revenue', value: money(stats?.leadRevenue ?? 0), icon: '💰', to: '/admin/orders' },
    { label: 'Pending approvals', value: stats?.pendingApprovals ?? 0, icon: '✅', to: '/admin/provider-approvals' },
    { label: 'Total orders', value: stats?.totalOrders ?? 0, icon: '📋', to: '/admin/orders' },
    { label: 'Active providers', value: stats?.totalProviders ?? 0, icon: '🏢', to: '/admin/providers' },
    { label: 'Total users', value: stats?.totalUsers ?? 0, icon: '👥', to: '/admin/users' },
    { label: 'Open requests', value: stats?.pendingOrders ?? 0, icon: '⏳', to: '/admin/orders' },
  ];

  return (
    <div>
      <PageHeader title="Admin overview" subtitle="Marketplace health at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{c.icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <p className="text-sm text-slate-500">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-brand-600">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {(orders ?? []).slice(0, 6).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">{o.serviceName}</p>
                <p className="text-sm text-slate-500">{o.customerName} → {o.providerName} · {dateOnly(o.createdAt)}</p>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
