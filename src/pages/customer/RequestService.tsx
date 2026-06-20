import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { getProvider } from '@/services/providers';
import { getServiceOptions } from '@/services/catalog';
import { listAddresses, listVehicles, saveVehicle, uploadFile } from '@/services/account';
import { createOrder } from '@/services/orders';
import { Logo } from '@/components/Logo';
import { Alert, PageLoader, Spinner } from '@/components/ui';
import type { SelectedOption, ServiceOption } from '@/types';

/**
 * Customer "Create Order" flow (Product Plan §11.4). Multi-step wizard:
 * vehicle → location → service questions → details → schedule → review.
 * Reached via /request?providerId=&serviceId= from a provider profile.
 */
export default function RequestService() {
  const [params] = useSearchParams();
  const providerId = params.get('providerId') ?? '';
  const serviceId = params.get('serviceId') ?? '';
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: provider, loading: lp } = useAsync(() => getProvider(providerId), [providerId]);
  const { data: options, loading: lo } = useAsync(() => getServiceOptions(serviceId), [serviceId]);
  const { data: vehicles, reload: reloadVehicles } = useAsync(() => listVehicles(user!.id), [user!.id]);
  const { data: addresses } = useAsync(() => listAddresses(user!.id), [user!.id]);

  const [step, setStep] = useState(0);
  const [vehicleId, setVehicleId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [answers, setAnswers] = useState<Record<string, string | string[] | boolean>>({});
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('Morning (8am–12pm)');
  const [submitting, setSubmitting] = useState(false);
  const [newVehicle, setNewVehicle] = useState<{ make: string; model: string; year: number; color: string } | null>(null);

  const serviceName = useMemo(() => provider?.businessName ?? '', [provider]);

  if (lp || lo) return <PageLoader label="Loading request…" />;
  if (!provider) return <div className="p-12 text-center text-slate-500">Provider not found. <Link to="/providers" className="text-brand-600">Browse providers</Link></div>;

  const STEPS = ['Vehicle', 'Location', 'Details', 'Photos & notes', 'Schedule', 'Review'];

  const addVehicleInline = async () => {
    if (!newVehicle) return;
    const v = await saveVehicle(user!.id, newVehicle);
    await reloadVehicles();
    setVehicleId(v.id);
    setNewVehicle(null);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) {
      const { url } = await uploadFile(f);
      setPhotos((p) => [...p, url]);
    }
  };

  const optionsValid = (options ?? []).filter((o) => o.required).every((o) => {
    const v = answers[o.id];
    return v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  });

  const canNext = () => {
    if (step === 0) return Boolean(vehicleId);
    if (step === 1) return Boolean(addressId);
    if (step === 2) return optionsValid;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const selectedOptions: SelectedOption[] = (options ?? [])
        .filter((o) => answers[o.id] !== undefined)
        .map((o) => ({ optionId: o.id, label: o.label, value: answers[o.id] }));
      const order = await createOrder(
        { providerId, serviceId, vehicleId, addressId, selectedOptions, description, photos, preferredDate, preferredTimeWindow },
        user!.id,
      );
      navigate(`/dashboard/orders/${order.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Logo />
          <Link to={`/providers/${providerId}`} className="text-sm text-slate-500 hover:text-brand-600">✕ Cancel</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-2 text-sm text-slate-500">Request to <span className="font-semibold text-slate-800">{serviceName}</span></div>
        <h1 className="text-2xl font-bold text-slate-900">{STEPS[step]}</h1>

        {/* Progress */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-400">Step {step + 1} of {STEPS.length}</p>

        <div className="card mt-6 p-6">
          {/* Step 0: Vehicle */}
          {step === 0 && (
            <div className="space-y-3">
              {(vehicles ?? []).map((v) => (
                <label key={v.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${vehicleId === v.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                  <input type="radio" name="vehicle" checked={vehicleId === v.id} onChange={() => setVehicleId(v.id)} />
                  <span className="font-medium text-slate-800">{v.year} {v.make} {v.model}</span>
                  <span className="text-sm text-slate-400">{v.color}</span>
                </label>
              ))}
              {newVehicle ? (
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Make" className="input" value={newVehicle.make} onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })} />
                    <input placeholder="Model" className="input" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} />
                    <input placeholder="Year" type="number" className="input" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })} />
                    <input placeholder="Color" className="input" value={newVehicle.color} onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={addVehicleInline} className="btn-primary !py-1.5 text-xs">Save vehicle</button>
                    <button onClick={() => setNewVehicle(null)} className="btn-ghost !py-1.5 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setNewVehicle({ make: '', model: '', year: new Date().getFullYear(), color: '' })} className="btn-secondary w-full">+ Add a new vehicle</button>
              )}
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-3">
              {(addresses ?? []).map((a) => (
                <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${addressId === a.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                  <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1" />
                  <div>
                    <p className="font-medium text-slate-800">{a.label}</p>
                    <p className="text-sm text-slate-500">{a.line1}, {a.city}, {a.state} {a.zip}</p>
                  </div>
                </label>
              ))}
              {addresses?.length === 0 && <Alert kind="warning">You have no saved addresses. <Link to="/dashboard/addresses" className="underline">Add one first.</Link></Alert>}
            </div>
          )}

          {/* Step 2: Service-specific dynamic questions */}
          {step === 2 && (
            <div className="space-y-5">
              {(options ?? []).length === 0 && <p className="text-sm text-slate-500">No additional questions for this service.</p>}
              {(options ?? []).map((o) => (
                <DynamicField key={o.id} option={o} value={answers[o.id]} onChange={(v) => setAnswers((a) => ({ ...a, [o.id]: v }))} />
              ))}
            </div>
          )}

          {/* Step 3: Photos & notes */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="label">Describe the issue or request</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[120px]" placeholder="Add anything that will help the provider give an accurate quote." />
              </div>
              <div>
                <label className="label">Photos <span className="font-normal text-slate-400">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="h-20 w-20 rounded-lg object-cover" />
                      <button onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-slate-800 text-xs text-white">✕</button>
                    </div>
                  ))}
                  <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 text-2xl text-slate-400 hover:border-brand-400">
                    +
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhoto} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="label">Preferred date</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="input max-w-xs" />
              </div>
              <div>
                <label className="label">Preferred time window</label>
                <select value={preferredTimeWindow} onChange={(e) => setPreferredTimeWindow(e.target.value)} className="input max-w-xs">
                  <option>Morning (8am–12pm)</option>
                  <option>Afternoon (12pm–5pm)</option>
                  <option>Evening (5pm–8pm)</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <Alert kind="info">Review your request before sending it to {serviceName}.</Alert>
              <Summary label="Vehicle" value={vehicleLabel()} />
              <Summary label="Location" value={addressLabel()} />
              {(options ?? []).filter((o) => answers[o.id] !== undefined).map((o) => (
                <Summary key={o.id} label={o.label} value={displayAnswer(answers[o.id])} />
              ))}
              {description && <Summary label="Description" value={description} />}
              <Summary label="Preferred time" value={`${preferredDate || 'Flexible'} · ${preferredTimeWindow}`} />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))} className="btn-secondary">Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="btn-primary">Continue</button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn-primary">{submitting ? <Spinner className="h-4 w-4" /> : 'Submit request'}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function vehicleLabel() {
    const v = vehicles?.find((x) => x.id === vehicleId);
    return v ? `${v.year} ${v.make} ${v.model} (${v.color})` : '—';
  }
  function addressLabel() {
    const a = addresses?.find((x) => x.id === addressId);
    return a ? `${a.line1}, ${a.city}, ${a.state} ${a.zip}` : '—';
  }
}

function DynamicField({ option, value, onChange }: { option: ServiceOption; value: string | string[] | boolean | undefined; onChange: (v: string | string[] | boolean) => void }) {
  return (
    <div>
      <label className="label">
        {option.label} {option.required && <span className="text-red-500">*</span>}
      </label>
      {option.helpText && <p className="mb-1 text-xs text-slate-400">{option.helpText}</p>}

      {option.type === 'single_select' && (
        <div className="flex flex-wrap gap-2">
          {(option.choices ?? []).map((c) => (
            <button key={c} type="button" onClick={() => onChange(c)} className={`badge border px-3 py-1.5 ${value === c ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600'}`}>{c}</button>
          ))}
        </div>
      )}

      {option.type === 'multi_select' && (
        <div className="flex flex-wrap gap-2">
          {(option.choices ?? []).map((c) => {
            const arr = Array.isArray(value) ? value : [];
            const active = arr.includes(c);
            return (
              <button key={c} type="button" onClick={() => onChange(active ? arr.filter((x) => x !== c) : [...arr, c])} className={`badge border px-3 py-1.5 ${active ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600'}`}>{c}</button>
            );
          })}
        </div>
      )}

      {option.type === 'boolean' && (
        <div className="flex gap-2">
          {['Yes', 'No'].map((label) => {
            const bool = label === 'Yes';
            return (
              <button key={label} type="button" onClick={() => onChange(bool)} className={`badge border px-4 py-1.5 ${value === bool ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600'}`}>{label}</button>
            );
          })}
        </div>
      )}

      {option.type === 'text' && <input className="input" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} />}
      {option.type === 'number' && <input type="number" className="input max-w-[160px]" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function displayAnswer(v: string | string[] | boolean | undefined): string {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (Array.isArray(v)) return v.join(', ');
  return v ?? '—';
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}
