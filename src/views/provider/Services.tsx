import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { deleteProviderService, getMyProviderProfile, getProviderServices, saveProviderService } from '@/services/providers';
import { EmptyState, PageHeader, PageLoader } from '@/components/ui';
import { priceRange } from '@/lib/format';

export default function ProviderServices() {
  const { user } = useAuth();
  const { data: profile } = useAsync(() => getMyProviderProfile(user!.id), [user!.id]);
  const { data: services, loading, reload } = useAsync(async () => (profile ? getProviderServices(profile.id) : []), [profile?.id]);

  const toggle = async (id: string, current: string) => {
    const ps = services?.find((s) => s.id === id);
    if (!ps || !profile) return;
    await saveProviderService(profile.id, { ...ps, status: current === 'active' ? 'inactive' : 'active' });
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this service from your listings?')) return;
    await deleteProviderService(id);
    reload();
  };

  return (
    <div>
      <PageHeader title="Services & Pricing" subtitle="Choose services from the catalog and set your estimated price ranges." action={<Link to="/provider/services/new" className="btn-primary">+ Add service</Link>} />

      {loading ? (
        <PageLoader />
      ) : services && services.length > 0 ? (
        <div className="card divide-y divide-slate-100">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{s.service.name}</p>
                <p className="text-sm text-slate-500">{priceRange(s.priceMin, s.priceMax)}{s.priceNote ? ` · ${s.priceNote}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{s.status === 'active' ? 'Active' : 'Inactive'}</span>
                <button onClick={() => toggle(s.id, s.status)} className="btn-ghost !px-3 !py-1.5 text-xs">{s.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                <Link to={`/provider/services/${s.id}/edit`} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</Link>
                <button onClick={() => remove(s.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="🧰" title="No services listed" description="Add services from the catalog and set your pricing to start receiving requests." action={<Link to="/provider/services/new" className="btn-primary">Add your first service</Link>} />
      )}
    </div>
  );
}
