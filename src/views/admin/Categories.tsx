import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { deleteCatalogEntity, listCategories, saveCategory } from '@/services/catalog';
import { Modal, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { Category } from '@/types';

const EMPTY = { name: '', slug: '', description: '', icon: '🔧', status: 'active' as const };

export default function AdminCategories() {
  const { data: categories, loading, reload } = useAsync(() => listCategories(), []);
  const [editing, setEditing] = useState<(Partial<Category> & { name: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try { await saveCategory(editing); setEditing(null); reload(); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category? Services in it may be affected.')) return;
    await deleteCatalogEntity('category', id);
    reload();
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle="The master catalog of service categories." action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-primary">+ Add category</button>} />

      {loading ? (
        <PageLoader />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.serviceCount ?? 0} services</p>
                  </div>
                </div>
                <span className={`badge ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{c.status}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{c.description}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(c)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
                <button onClick={() => remove(c.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit category' : 'Add category'}
        footer={<><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button><button onClick={save} disabled={busy} className="btn-primary">{busy ? <Spinner className="h-4 w-4" /> : 'Save'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div><label className="label">Icon</label><input value={editing.icon ?? ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="input text-center" /></div>
              <div><label className="label">Name</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></div>
            </div>
            <div><label className="label">Description</label><textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input min-h-[80px]" /></div>
            <div><label className="label">Status</label>
              <select value={editing.status ?? 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'active' | 'inactive' })} className="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
