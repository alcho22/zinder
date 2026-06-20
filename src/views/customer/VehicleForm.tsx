import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { getVehicle, saveVehicle } from '@/services/account';
import { PageHeader, Spinner } from '@/components/ui';

export default function VehicleForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({ make: '', model: '', year: new Date().getFullYear(), color: '', vin: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) getVehicle(id).then((v) => v && setForm({ make: v.make, model: v.model, year: v.year, color: v.color, vin: v.vin ?? '' }));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveVehicle(user!.id, { id, ...form, vin: form.vin || undefined });
      navigate('/dashboard/vehicles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={editing ? 'Edit vehicle' : 'Add vehicle'} />
      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Make</label>
            <input value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} className="input" placeholder="Toyota" required />
          </div>
          <div>
            <label className="label">Model</label>
            <input value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="input" placeholder="Camry" required />
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))} className="input" min={1950} max={2100} required />
          </div>
          <div>
            <label className="label">Color</label>
            <input value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="input" placeholder="Silver" required />
          </div>
        </div>
        <div>
          <label className="label">VIN <span className="font-normal text-slate-400">(optional)</span></label>
          <input value={form.vin} onChange={(e) => setForm((f) => ({ ...f, vin: e.target.value }))} className="input" placeholder="17-character VIN" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner className="h-4 w-4" /> : 'Save vehicle'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/vehicles')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
