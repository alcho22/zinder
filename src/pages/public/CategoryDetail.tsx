import { Link, useParams } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getCategoryBySlug, listServices } from '@/services/catalog';
import { EmptyState, PageLoader } from '@/components/ui';

export default function CategoryDetail() {
  const { slug = '' } = useParams();
  const { data: category, loading } = useAsync(() => getCategoryBySlug(slug), [slug]);
  const { data: services } = useAsync(
    async () => (category ? listServices({ categoryId: category.id }) : []),
    [category?.id],
  );

  if (loading) return <PageLoader />;
  if (!category) return <EmptyState icon="🔍" title="Category not found" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-slate-400">
        <Link to="/categories" className="hover:text-brand-600">Categories</Link> / {category.name}
      </nav>
      <div className="flex items-center gap-4">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="mt-1 text-slate-500">{category.description}</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Services in this category</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(services ?? []).map((s) => (
          <Link key={s.id} to={`/services/${s.slug}`} className="card p-5 transition hover:border-brand-300 hover:shadow-md">
            <h3 className="font-semibold text-slate-900">{s.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{s.description}</p>
            <p className="mt-3 text-xs font-medium text-brand-600">Find providers →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
