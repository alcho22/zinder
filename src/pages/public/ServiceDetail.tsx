import { Link, useParams } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getServiceBySlug } from '@/services/catalog';
import { searchProviders } from '@/services/providers';
import { EmptyState, PageLoader, StarRating } from '@/components/ui';
import { priceRange } from '@/lib/format';

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const { data: service, loading } = useAsync(() => getServiceBySlug(slug), [slug]);
  const { data: providers } = useAsync(
    async () => (service ? searchProviders({ serviceId: service.id, sort: 'rating' }) : []),
    [service?.id],
  );

  if (loading) return <PageLoader />;
  if (!service) return <EmptyState icon="🔍" title="Service not found" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
      <p className="mt-2 max-w-2xl text-slate-500">{service.description}</p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Providers offering {service.name} {providers ? `(${providers.length})` : ''}
        </h2>
        <Link to={`/providers?service=${service.slug}`} className="text-sm font-semibold text-brand-600">Refine search →</Link>
      </div>

      <div className="mt-4 space-y-4">
        {(providers ?? []).map((p) => (
          <div key={p.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl">🔧</span>
              <div>
                <Link to={`/providers/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{p.businessName}</Link>
                <div className="mt-1"><StarRating rating={p.rating} count={p.reviewCount} /></div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.isMobile && <span className="badge bg-emerald-100 text-emerald-700">Mobile</span>}
                  {p.isCertified && <span className="badge bg-brand-100 text-brand-700">Certified</span>}
                  {p.distanceMiles != null && <span className="badge bg-slate-100 text-slate-600">{p.distanceMiles} mi</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              {p.matchedPriceMin != null && (
                <p className="text-sm text-slate-500">Est. <span className="font-semibold text-slate-900">{priceRange(p.matchedPriceMin, p.matchedPriceMax!)}</span></p>
              )}
              <Link to={`/providers/${p.id}`} className="btn-primary mt-2">View & request</Link>
            </div>
          </div>
        ))}
        {providers?.length === 0 && (
          <EmptyState icon="🔍" title="No providers yet" description="No providers currently offer this service in your area." />
        )}
      </div>
    </div>
  );
}
