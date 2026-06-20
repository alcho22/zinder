import { Link } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { listCategories } from '@/services/catalog';
import { PageLoader } from '@/components/ui';

export default function Categories() {
  const { data: categories, loading } = useAsync(() => listCategories(), []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Service categories</h1>
      <p className="mt-2 text-slate-500">Choose a category to explore available automotive services.</p>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => (
            <Link key={c.id} to={`/categories/${c.slug}`} className="card flex items-start gap-4 p-5 transition hover:border-brand-300 hover:shadow-md">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <h2 className="font-semibold text-slate-900">{c.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                <p className="mt-2 text-xs font-medium text-brand-600">{c.serviceCount ?? 0} services →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
