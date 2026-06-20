import { Link, useSearchParams } from '@/lib/router';
import { useAsync } from '@/hooks/useAsync';
import { searchProviders, type ProviderSearchParams } from '@/services/providers';
import { listCategories } from '@/services/catalog';
import { PageLoader, StarRating, EmptyState } from '@/components/ui';
import { priceRange } from '@/lib/format';

/**
 * Provider discovery + filtering — the core customer flow (Product Plan §5.1).
 */
export default function Providers() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useAsync(() => listCategories(), []);

  const filters: ProviderSearchParams = {
    q: params.get('q') ?? undefined,
    zip: params.get('zip') ?? undefined,
    categoryId: params.get('category') ?? undefined,
    minRating: params.get('minRating') ? Number(params.get('minRating')) : undefined,
    mobileOnly: params.get('mobile') === '1',
    certifiedOnly: params.get('certified') === '1',
    sort: (params.get('sort') as ProviderSearchParams['sort']) ?? 'distance',
  };

  const { data: providers, loading } = useAsync(() => searchProviders(filters), [params.toString()]);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Find a provider</h1>
      <p className="mt-1 text-slate-500">
        {filters.q ? <>Results for “<span className="font-medium">{filters.q}</span>”</> : 'Browse automotive service providers near you.'}
        {filters.zip && ` near ${filters.zip}`}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="space-y-5">
          <div className="card p-4">
            <label className="label">Search</label>
            <input defaultValue={filters.q} onChange={(e) => update('q', e.target.value || null)} placeholder="Service or business" className="input" />
            <label className="label mt-3">ZIP code</label>
            <input defaultValue={filters.zip} onChange={(e) => update('zip', e.target.value || null)} placeholder="78701" className="input" />
          </div>

          <div className="card p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">Category</p>
            <select value={filters.categoryId ?? ''} onChange={(e) => update('category', e.target.value || null)} className="input">
              <option value="">All categories</option>
              {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <p className="mb-2 mt-4 text-sm font-semibold text-slate-800">Minimum rating</p>
            <select value={filters.minRating ?? ''} onChange={(e) => update('minRating', e.target.value || null)} className="input">
              <option value="">Any rating</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4">4.0+ stars</option>
              <option value="3.5">3.5+ stars</option>
            </select>

            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={filters.mobileOnly} onChange={(e) => update('mobile', e.target.checked ? '1' : null)} />
                Mobile / on-site only
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={filters.certifiedOnly} onChange={(e) => update('certified', e.target.checked ? '1' : null)} />
                Certified / verified only
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">{providers?.length ?? 0} providers</p>
            <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="input max-w-[180px]">
              <option value="distance">Sort: Distance</option>
              <option value="rating">Sort: Rating</option>
              <option value="reviews">Sort: Most reviewed</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>

          {loading ? (
            <PageLoader />
          ) : providers && providers.length > 0 ? (
            <div className="space-y-4">
              {providers.map((p) => (
                <div key={p.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-2xl">🔧</span>
                    <div>
                      <Link to={`/providers/${p.id}`} className="text-lg font-semibold text-slate-900 hover:text-brand-600">{p.businessName}</Link>
                      <div className="mt-1"><StarRating rating={p.rating} count={p.reviewCount} /></div>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">{p.bio}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.isMobile && <span className="badge bg-emerald-100 text-emerald-700">Mobile</span>}
                        {p.isCertified && <span className="badge bg-brand-100 text-brand-700">Certified</span>}
                        {p.distanceMiles != null && <span className="badge bg-slate-100 text-slate-600">{p.distanceMiles} mi away</span>}
                        {p.responseRate != null && <span className="badge bg-slate-100 text-slate-600">{p.responseRate}% response</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {p.matchedPriceMin != null && (
                      <p className="text-sm text-slate-500">Est. <span className="font-semibold text-slate-900">{priceRange(p.matchedPriceMin, p.matchedPriceMax!)}</span></p>
                    )}
                    <Link to={`/providers/${p.id}`} className="btn-primary mt-2 whitespace-nowrap">View profile</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="🔍" title="No providers found" description="Try adjusting your filters or searching a different service." />
          )}
        </div>
      </div>
    </div>
  );
}
