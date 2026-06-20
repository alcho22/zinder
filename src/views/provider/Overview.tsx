import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { getMyProviderProfile } from '@/services/providers';
import { listProviderOrders } from '@/services/orders';
import { listLeadCharges } from '@/services/admin';
import { OrderStatusBadge, PageHeader, PageLoader, StarRating } from '@/components/ui';
import { dateOnly, money } from '@/lib/format';

export default function ProviderOverview() {
  const { user } = useAuth();
  const { data: profile, loading } = useAsync(() => getMyProviderProfile(user!.id), [user!.id]);
  const { data: orders } = useAsync(async () => (profile ? listProviderOrders(profile.id) : []), [profile?.id]);
  const { data: charges } = useAsync(async () => (profile ? listLeadCharges(profile.id) : []), [profile?.id]);

  if (loading) return <PageLoader />;
  if (!profile) return <PageHeader title="Provider dashboard" subtitle="No provider profile found for this account." />;

  const pending = orders?.filter((o) => o.status === 'pending') ?? [];
  const spend = charges?.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0) ?? 0;

  const stats = [
    { label: 'New requests', value: pending.length, icon: '📥' },
    { label: 'Total requests', value: orders?.length ?? 0, icon: '📋' },
    { label: 'Lead spend', value: money(spend), icon: '💳' },
    { label: 'Rating', value: profile.rating.toFixed(1), icon: '⭐' },
  ];

  return (
    <div>
      <PageHeader title={profile.businessName} subtitle={<StarRating rating={profile.rating} count={profile.reviewCount} />} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-500/10 text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Requests awaiting your response</h2>
          <Link to="/provider/orders" className="text-sm font-medium text-brand-600">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {pending.slice(0, 5).map((o) => (
            <Link key={o.id} to={`/provider/orders/${o.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">{o.serviceName}</p>
                <p className="text-sm text-slate-500">{o.customerName} · {o.vehicleSnapshot.year} {o.vehicleSnapshot.make} {o.vehicleSnapshot.model} · {dateOnly(o.createdAt)}</p>
              </div>
              <OrderStatusBadge status={o.status} />
            </Link>
          ))}
          {pending.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No new requests right now.</p>}
        </div>
      </div>
    </div>
  );
}
