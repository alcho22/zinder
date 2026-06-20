import { Link, useSearchParams } from '@/lib/router';
import { useAsync } from '@/hooks/useAsync';
import { listCategories, listServices } from '@/services/catalog';
import { PageLoader } from '@/components/ui';

export default function Services() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const categoryId = params.get('category') ?? '';

  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: services, loading } = useAsync(
    () => listServices({ q: q || undefined, categoryId: categoryId || undefined }),
    [q, categoryId],
  );

  const catName = (id: string) => categories?.find((c) => c.id === id)?.name ?? '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">All services</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          defaultValue={q}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set('q', e.target.value); else next.delete('q');
            setParams(next, { replace: true });
          }}
          placeholder="Search services…"
          className="input max-w-xs"
        />
        <select
          value={categoryId}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set('category', e.target.value); else next.delete('category');
            setParams(next, { replace: true });
          }}
          className="input max-w-xs"
        >
          <option value="">All categories</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((s) => (
            <Link key={s.id} to={`/services/${s.slug}`} className="card p-5 transition hover:border-brand-300 hover:shadow-md">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{catName(s.categoryId)}</p>
              <h3 className="mt-1 font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{s.description}</p>
            </Link>
          ))}
          {services?.length === 0 && <p className="text-slate-500">No services match your search.</p>}
        </div>
      )}
    </div>
  );
}
