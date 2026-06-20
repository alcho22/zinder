import { useAsync } from '@/hooks/useAsync';
import { listProviders, setProviderStatus } from '@/services/admin';
import { PageHeader, PageLoader, ProviderStatusBadge, StarRating } from '@/components/ui';

export default function AdminProviders() {
  const { data: providers, loading, reload } = useAsync(() => listProviders(), []);

  const setStatus = async (id: string, status: 'approved' | 'suspended') => {
    await setProviderStatus(id, status);
    reload();
  };

  return (
    <div>
      <PageHeader title="Providers" subtitle="Manage approved providers and their status." />

      {loading ? (
        <PageLoader />
      ) : (
        <div className="space-y-3">
          {(providers ?? []).map((p) => (
            <div key={p.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl">🔧</span>
                <div>
                  <p className="font-semibold text-slate-900">{p.businessName}</p>
                  <div className="mt-1"><StarRating rating={p.rating} count={p.reviewCount} /></div>
                  <p className="mt-1 text-sm text-slate-500">{p.serviceArea}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ProviderStatusBadge status={p.status} />
                {p.status === 'approved' ? (
                  <button onClick={() => setStatus(p.id, 'suspended')} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Suspend</button>
                ) : (
                  <button onClick={() => setStatus(p.id, 'approved')} className="btn-ghost !px-3 !py-1.5 text-xs">Reactivate</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
