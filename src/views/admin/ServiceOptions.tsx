import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { deleteCatalogEntity, getServiceOptions, listServices, saveServiceOption } from '@/services/catalog';
import { EmptyState, Modal, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { ServiceOption, ServiceOptionType } from '@/types';

/**
 * Dynamic request-form builder (Product Plan §15). Admin manages the
 * service-specific questions customers answer when creating a request.
 */
export default function AdminServiceOptions() {
  const { data: services } = useAsync(() => listServices(), []);
  const [serviceId, setServiceId] = useState('');
  const { data: options, loading, reload } = useAsync(async () => (serviceId ? getServiceOptions(serviceId) : []), [serviceId]);
  const [editing, setEditing] = useState<(Partial<ServiceOption> & { serviceId: string; label: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try { await saveServiceOption(editing); setEditing(null); reload(); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await deleteCatalogEntity('option', id);
    reload();
  };

  const newOption = () =>
    setEditing({ serviceId, label: '', type: 'single_select', required: false, status: 'active', sortOrder: (options?.length ?? 0) + 1, choices: [] });

  return (
    <div>
      <PageHeader title="Service options" subtitle="Build the dynamic questions shown for each service’s request form." />

      <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="input mb-4 max-w-sm">
        <option value="">Select a service…</option>
        {(services ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {!serviceId ? (
        <EmptyState icon="⚙️" title="Select a service" description="Choose a service above to manage its request-form questions." />
      ) : loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="mb-4 flex justify-end"><button onClick={newOption} className="btn-primary">+ Add question</button></div>
          {options && options.length > 0 ? (
            <div className="card divide-y divide-slate-100">
              {options.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-slate-900">{o.label} {o.required && <span className="text-red-500">*</span>}</p>
                    <p className="text-xs text-slate-400">{o.type}{o.choices?.length ? ` · ${o.choices.join(', ')}` : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(o)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
                    <button onClick={() => remove(o.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="⚙️" title="No questions yet" description="Add questions to build this service’s request form." />
          )}
        </>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit question' : 'Add question'}
        footer={<><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button><button onClick={save} disabled={busy} className="btn-primary">{busy ? <Spinner className="h-4 w-4" /> : 'Save'}</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div><label className="label">Question label</label><input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="input" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Type</label>
                <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as ServiceOptionType })} className="input">
                  <option value="single_select">Single select</option>
                  <option value="multi_select">Multi select</option>
                  <option value="boolean">Yes / No</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div><label className="label">Sort order</label><input type="number" value={editing.sortOrder ?? 1} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} className="input" /></div>
            </div>
            {(editing.type === 'single_select' || editing.type === 'multi_select') && (
              <div>
                <label className="label">Choices (comma-separated)</label>
                <input value={(editing.choices ?? []).join(', ')} onChange={(e) => setEditing({ ...editing, choices: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="input" placeholder="Option A, Option B" />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={editing.required ?? false} onChange={(e) => setEditing({ ...editing, required: e.target.checked })} /> Required
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
}
