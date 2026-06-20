import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getProvider, getProviderServices } from '@/services/providers';
import { EmptyState, PageLoader, StarRating } from '@/components/ui';
import { priceRange } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';

export default function ProviderProfile() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: provider, loading } = useAsync(() => getProvider(id), [id]);
  const { data: services } = useAsync(() => getProviderServices(id), [id]);

  if (loading) return <PageLoader />;
  if (!provider) return <EmptyState icon="🔍" title="Provider not found" />;

  const requestService = (serviceId: string) => {
    const dest = `/request?providerId=${provider.id}&serviceId=${serviceId}`;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(dest)}`);
    } else {
      navigate(dest);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-brand-600 to-brand-800 sm:h-52" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-white bg-slate-100 text-4xl shadow">🔧</span>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-slate-900">{provider.businessName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <StarRating rating={provider.rating} count={provider.reviewCount} />
                {provider.isMobile && <span className="badge bg-emerald-100 text-emerald-700">Mobile service</span>}
                {provider.isCertified && <span className="badge bg-brand-100 text-brand-700">Certified</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div>
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-2 text-slate-600">{provider.bio}</p>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Services & pricing</h2>
              <p className="text-sm text-slate-500">Estimated price ranges. Submit a request for a final quote.</p>
              <div className="mt-4 space-y-3">
                {(services ?? []).filter((s) => s.status === 'active').map((s) => (
                  <div key={s.id} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-slate-900">{s.service.name}</p>
                      {s.priceNote && <p className="text-xs text-slate-400">{s.priceNote}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-900">{priceRange(s.priceMin, s.priceMax)}</span>
                      <button onClick={() => requestService(s.serviceId)} className="btn-primary">Request</button>
                    </div>
                  </div>
                ))}
                {services?.length === 0 && <p className="text-sm text-slate-500">No active services listed.</p>}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900">Details</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Service area</dt><dd className="text-right font-medium text-slate-800">{provider.serviceArea}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Response rate</dt><dd className="font-medium text-slate-800">{provider.responseRate ?? '—'}%</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Reviews</dt><dd className="font-medium text-slate-800">{provider.reviewCount}</dd></div>
              </dl>
              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Contact details are shared after a provider accepts your request.
              </p>
            </div>
            <Link to="/providers" className="btn-secondary w-full">← Back to results</Link>
          </aside>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
