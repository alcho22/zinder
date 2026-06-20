import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { getMyProviderProfile } from '@/services/providers';
import { listLeadCharges } from '@/services/admin';
import { Alert, EmptyState, PageHeader, PageLoader } from '@/components/ui';
import { dateTime, money } from '@/lib/format';

/**
 * Provider lead charges (a.k.a. wallet). In the MVP this is a record of lead
 * fees charged. Real payment processing (e.g. Chase QuickAccept per the
 * Product Plan §12.2) is wired up by the backend at the quote-acceptance step.
 */
export default function ProviderWallet() {
  const { user } = useAuth();
  const { data: profile } = useAsync(() => getMyProviderProfile(user!.id), [user!.id]);
  const { data: charges, loading } = useAsync(async () => (profile ? listLeadCharges(profile.id) : []), [profile?.id]);

  const total = charges?.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0) ?? 0;

  return (
    <div>
      <PageHeader title="Lead charges" subtitle="Every accepted request charges a lead fee based on the service value." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total lead spend</p>
          <p className="text-3xl font-bold text-slate-900">{money(total)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Leads purchased</p>
          <p className="text-3xl font-bold text-slate-900">{charges?.filter((c) => c.status === 'paid').length ?? 0}</p>
        </div>
      </div>

      <Alert kind="info">Payment integration (Chase QuickAccept) will be connected by the engineering team. This page lists your charges.</Alert>

      {loading ? (
        <PageLoader />
      ) : charges && charges.length > 0 ? (
        <div className="card mt-4 divide-y divide-slate-100">
          {charges.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-slate-900">Lead fee · request #{c.orderId}</p>
                <p className="text-xs text-slate-400">{dateTime(c.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${c.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : c.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{c.status}</span>
                <span className="font-semibold text-slate-900">{money(c.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4"><EmptyState icon="💳" title="No charges yet" description="Lead fees appear here once you accept requests." /></div>
      )}
    </div>
  );
}
