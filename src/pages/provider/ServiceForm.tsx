import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { listCategories, listServices } from '@/services/catalog';
import { getMyProviderProfile, getProviderServices, saveProviderService } from '@/services/providers';
import { PageHeader, PageLoader, Spinner } from '@/components/ui';

export default function ProviderServiceForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const { data: profile } = useAsync(() => getMyProviderProfile(user!.id), [user!.id]);
  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: allServices } = useAsync(() => listServices(), []);

  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [priceNote, setPriceNote] = useState('');
  const [ready, setReady] = useState(!editing);
  const [saving, setSaving] = useState(false);

  // Load existing provider-service when editing.
  useEffect(() => {
    if (!id || !profile) return;
    getProviderServices(profile.id).then((list) => {
      const ps = list.find((x) => x.id === id);
      if (ps) {
        setServiceId(ps.serviceId);
        setCategoryId(ps.service.categoryId);
        setPriceMin(ps.priceMin);
        setPriceMax(ps.priceMax);
        setPriceNote(ps.priceNote ?? '');
      }
      setReady(true);
    });
  }, [id, profile]);

  if (editing && !ready) return <PageLoader />;

  const services = (allServices ?? []).filter((s) => !categoryId || s.categoryId === categoryId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await saveProviderService(profile.id, { id, serviceId, priceMin, priceMax, priceNote: priceNote || undefined });
      navigate('/provider/services');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={editing ? 'Edit service' : 'Add a service'} subtitle="Pick a service from the catalog and set your estimated price range." />
      <form onSubmit={submit} className="card max-w-xl space-y-4 p-6">
        <div>
          <label className="label">Category</label>
          <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setServiceId(''); }} className="input" disabled={editing}>
            <option value="">Select a category</option>
            {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Service</label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="input" required disabled={editing}>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Price min ($)</label><input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} className="input" min={0} required /></div>
          <div><label className="label">Price max ($)</label><input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="input" min={0} required /></div>
        </div>
        <div><label className="label">Price note <span className="font-normal text-slate-400">(optional)</span></label><input value={priceNote} onChange={(e) => setPriceNote(e.target.value)} className="input" placeholder="e.g. Parts included, per axle" /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving || !serviceId} className="btn-primary">{saving ? <Spinner className="h-4 w-4" /> : 'Save service'}</button>
          <button type="button" onClick={() => navigate('/provider/services')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
