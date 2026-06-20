import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { listCategories } from '@/services/catalog';
import { searchProviders } from '@/services/providers';
import { StarRating } from '@/components/ui';
import { priceRange } from '@/lib/format';

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [zip, setZip] = useState('');
  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: featured } = useAsync(() => searchProviders({ sort: 'rating' }), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (zip) params.set('zip', zip);
    navigate(`/providers?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="badge bg-white/15 text-white">🚗 Now serving Austin, Texas</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Car trouble? Find the right pro in minutes.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Search automotive services, compare local providers by price, rating, and availability,
              then request a quote — all in one place.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What do you need? e.g. oil change, brakes…"
                className="input flex-1 border-0 shadow-none focus:ring-0"
              />
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP code"
                className="input border-0 shadow-none focus:ring-0 sm:w-40"
              />
              <button type="submit" className="btn-primary sm:px-8">Search</button>
            </form>
            <p className="mt-3 text-sm text-brand-100">
              Popular: {' '}
              {['Oil Change', 'Battery Replacement', 'Brake Service', 'Car Detailing'].map((t, i) => (
                <span key={t}>
                  {i > 0 && ' · '}
                  <Link to={`/providers?q=${encodeURIComponent(t)}`} className="underline hover:text-white">{t}</Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">How Zinder works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { icon: '🔎', title: 'Search & compare', body: 'Find the service you need and compare local providers by price, rating, reviews, and availability.' },
            { icon: '📝', title: 'Submit a request', body: 'Pick a provider, add your vehicle and details, and send a structured request in under 5 minutes.' },
            { icon: '💬', title: 'Get a quote', body: 'The provider reviews your request and sends a final quote. You choose whether to move forward.' },
          ].map((s) => (
            <div key={s.title} className="card p-6 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{s.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Browse by category</h2>
            <Link to="/categories" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(categories ?? []).slice(0, 8).map((c) => (
              <Link key={c.id} to={`/categories/${c.slug}`} className="card flex items-center gap-3 p-4 transition hover:border-brand-300 hover:shadow-md">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.serviceCount ?? 0} services</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured providers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Top-rated providers</h2>
          <Link to="/providers" className="text-sm font-semibold text-brand-600 hover:text-brand-700">See all →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(featured ?? []).slice(0, 3).map((p) => (
            <Link key={p.id} to={`/providers/${p.id}`} className="card overflow-hidden transition hover:shadow-md">
              <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-700" />
              <div className="p-5">
                <div className="-mt-10 mb-2 grid h-14 w-14 place-items-center rounded-xl border-4 border-white bg-slate-100 text-2xl shadow">🔧</div>
                <h3 className="font-semibold text-slate-900">{p.businessName}</h3>
                <div className="mt-1"><StarRating rating={p.rating} count={p.reviewCount} /></div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.isMobile && <span className="badge bg-emerald-100 text-emerald-700">Mobile</span>}
                  {p.isCertified && <span className="badge bg-brand-100 text-brand-700">Certified</span>}
                  <span className="badge bg-slate-100 text-slate-600">{p.serviceArea}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Provider CTA */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Run an automotive service business?</h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Get higher-intent leads from customers who already chose your service and shared the details.
              Set your own pricing and only pay for qualified leads.
            </p>
          </div>
          <Link to="/register" className="btn-accent whitespace-nowrap px-8 py-3 text-base">Become a provider</Link>
        </div>
      </section>
    </div>
  );
}
