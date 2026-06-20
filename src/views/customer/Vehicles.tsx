import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { deleteVehicle, listVehicles } from '@/services/account';
import { EmptyState, PageHeader, PageLoader } from '@/components/ui';

export default function Vehicles() {
  const { user } = useAuth();
  const { data: vehicles, loading, reload } = useAsync(() => listVehicles(user!.id), [user!.id]);

  const remove = async (id: string) => {
    if (!confirm('Remove this vehicle?')) return;
    await deleteVehicle(id);
    reload();
  };

  return (
    <div>
      <PageHeader
        title="My Vehicles"
        subtitle="Save your vehicles to speed up service requests."
        action={<Link to="/dashboard/vehicles/new" className="btn-primary">+ Add vehicle</Link>}
      />

      {loading ? (
        <PageLoader />
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {vehicles.map((v) => (
            <div key={v.id} className="card flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl">🚗</span>
                <div>
                  <p className="font-semibold text-slate-900">{v.year} {v.make} {v.model}</p>
                  <p className="text-sm text-slate-500">{v.color}{v.vin ? ` · VIN ${v.vin.slice(-6)}` : ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/dashboard/vehicles/${v.id}/edit`} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</Link>
                <button onClick={() => remove(v.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🚗"
          title="No vehicles yet"
          description="Add a vehicle so you can request services faster."
          action={<Link to="/dashboard/vehicles/new" className="btn-primary">Add your first vehicle</Link>}
        />
      )}
    </div>
  );
}
