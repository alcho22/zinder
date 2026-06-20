import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { deleteAddress, listAddresses, saveAddress } from '@/services/account';
import { EmptyState, Modal, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { Address } from '@/types';

const EMPTY = { label: '', line1: '', line2: '', city: '', state: 'TX', zip: '', isDefault: false };

export default function Addresses() {
  const { user } = useAuth();
  const { data: addresses, loading, reload } = useAsync(() => listAddresses(user!.id), [user!.id]);
  const [editing, setEditing] = useState<(typeof EMPTY & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (a: Address) => setEditing({ ...a, line2: a.line2 ?? '' });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await saveAddress(user!.id, editing);
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    await deleteAddress(id);
    reload();
  };

  return (
    <div>
      <PageHeader title="Addresses" subtitle="Where should providers come for mobile service?" action={<button onClick={openNew} className="btn-primary">+ Add address</button>} />

      {loading ? (
        <PageLoader />
      ) : addresses && addresses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    {a.label}
                    {a.isDefault && <span className="badge bg-brand-100 text-brand-700">Default</span>}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                  <p className="text-sm text-slate-500">{a.city}, {a.state} {a.zip}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(a)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
                <button onClick={() => remove(a.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📍" title="No addresses yet" description="Add an address to use for mobile service requests." action={<button onClick={openNew} className="btn-primary">Add address</button>} />
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit address' : 'Add address'}
        footer={
          <>
            <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">{saving ? <Spinner className="h-4 w-4" /> : 'Save'}</button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="label">Label</label>
              <input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="input" placeholder="Home, Work…" />
            </div>
            <div>
              <label className="label">Street address</label>
              <input value={editing.line1} onChange={(e) => setEditing({ ...editing, line1: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Apt / Suite (optional)</label>
              <input value={editing.line2} onChange={(e) => setEditing({ ...editing, line2: e.target.value })} className="input" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1"><label className="label">City</label><input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="input" /></div>
              <div><label className="label">State</label><input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} className="input" /></div>
              <div><label className="label">ZIP</label><input value={editing.zip} onChange={(e) => setEditing({ ...editing, zip: e.target.value })} className="input" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={editing.isDefault} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} />
              Set as default address
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
}
