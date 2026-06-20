import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { deleteCatalogEntity, listCategories, listServices, saveService } from '@/services/catalog';
import { Modal, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { Service } from '@/types';

export default function AdminServices() {
  const [categoryId, setCategoryId] = useState('');
  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: services, loading, reload } = useAsync(() => listServices(categoryId ? { categoryId } : undefined), [categoryId]);
  const [editing, setEditing] = useState<(Partial<Service> & { name: string; categoryId: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const catName = (id: string) => categories?.find((c) => c.id === id)?.name ?? '';

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try { await saveService(editing); setEditing(null); reload(); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await deleteCatalogEntity('service', id);
    reload();
  };

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="The master catalog of services. Providers select from these."
        action={<button onClick={() => setEditing({ name: '', categoryId: categories?.[0]?.id ?? '', description: '', status: 'active', leadTier: 'medium' })} className="btn-primary">+ Add service</button>}
      />

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input mb-4 max-w-xs">
        <option value="">All categories</option>
        {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Service</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Lead tier</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(services ?? []).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{catName(s.categoryId)}</td>
                  <td className="px-4 py-3"><span className="badge bg-slate-100 capitalize text-slate-600">{s.leadTier}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{s.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(s)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
                    <button onClick={() => remove(s.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit service' : 'Add service'}
        footer={<><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button><button onClick={save} disabled={busy} className="btn-primary">{busy ? <Spinner className="h-4 w-4" /> : 'Save'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div><label className="label">Name</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></div>
            <div><label className="label">Category</label>
              <select value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })} className="input">
                {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="label">Description</label><textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input min-h-[80px]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Lead tier</label>
                <select value={editing.leadTier ?? 'medium'} onChange={(e) => setEditing({ ...editing, leadTier: e.target.value as 'low' | 'medium' | 'high' })} className="input">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div><label className="label">Status</label>
                <select value={editing.status ?? 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'active' | 'inactive' })} className="input">
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
