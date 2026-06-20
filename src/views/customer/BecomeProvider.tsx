import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { listCategories, listServices } from '@/services/catalog';
import { submitProviderApplication, uploadFile } from '@/services/account';
import { Alert, ApplicationStatusBadge, PageHeader, Spinner } from '@/components/ui';
import type { ProviderApplicationPayload } from '@/types';

const STEPS = ['Business info', 'Categories & services', 'Documents', 'Agreements', 'Review'];

export default function BecomeProvider() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: services } = useAsync(() => listServices(), []);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<ProviderApplicationPayload>({
    businessName: '', businessPhone: user?.phone ?? '', businessEmail: user?.email ?? '',
    businessDescription: '', serviceArea: 'Austin, TX (25 mi radius)',
    categoryIds: [], serviceIds: [],
    acceptedProviderAgreement: false, acceptedTerms: false, acceptedPrivacy: false,
  });

  // Already applied / approved — show status instead of the form.
  const appStatus = user?.providerApplicationStatus ?? 'none';
  if (appStatus === 'pending' || appStatus === 'approved' || appStatus === 'rejected' || appStatus === 'more_info_requested') {
    return (
      <div>
        <PageHeader title="Become a Provider" />
        <div className="card max-w-xl p-8 text-center">
          <div className="text-4xl">{appStatus === 'approved' ? '🎉' : appStatus === 'rejected' ? '🚫' : '⏳'}</div>
          <div className="mt-3"><ApplicationStatusBadge status={appStatus} /></div>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            {appStatus === 'approved' ? 'You’re an approved provider!' : appStatus === 'rejected' ? 'Application not approved' : appStatus === 'more_info_requested' ? 'More information needed' : 'Application under review'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {appStatus === 'approved'
              ? 'Your provider dashboard is unlocked. Start adding services and pricing.'
              : appStatus === 'pending'
                ? 'Our team is reviewing your application — usually within 48 hours.'
                : 'Please update your application and resubmit, or contact support.'}
          </p>
          {appStatus === 'approved' && <button onClick={() => navigate('/provider/dashboard')} className="btn-primary mt-5">Go to provider dashboard</button>}
        </div>
      </div>
    );
  }

  const toggle = (key: 'categoryIds' | 'serviceIds', id: string) =>
    setData((d) => ({ ...d, [key]: d[key].includes(id) ? d[key].filter((x) => x !== id) : [...d[key], id] }));

  const handleUpload = (field: 'licenseUrl' | 'insuranceUrl' | 'logoUrl') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await uploadFile(file);
    setData((d) => ({ ...d, [field]: url }));
  };

  const canNext = () => {
    if (step === 0) return data.businessName && data.businessPhone && data.businessEmail;
    if (step === 1) return data.categoryIds.length > 0 && data.serviceIds.length > 0;
    if (step === 3) return data.acceptedProviderAgreement && data.acceptedTerms && data.acceptedPrivacy;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await submitProviderApplication(user!.id, data);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = (services ?? []).filter((s) => data.categoryIds.includes(s.categoryId));

  return (
    <div>
      <PageHeader title="Become a Provider" subtitle="Get higher-intent leads and grow your automotive business." />

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-xs">{i < step ? '✓' : i + 1}</span>
              {label}
            </div>
            {i < STEPS.length - 1 && <span className="text-slate-300">—</span>}
          </div>
        ))}
      </div>

      <div className="card max-w-2xl p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div><label className="label">Business name</label><input value={data.businessName} onChange={(e) => setData({ ...data, businessName: e.target.value })} className="input" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Business phone</label><input value={data.businessPhone} onChange={(e) => setData({ ...data, businessPhone: e.target.value })} className="input" /></div>
              <div><label className="label">Business email</label><input value={data.businessEmail} onChange={(e) => setData({ ...data, businessEmail: e.target.value })} className="input" /></div>
            </div>
            <div><label className="label">Service area</label><input value={data.serviceArea} onChange={(e) => setData({ ...data, serviceArea: e.target.value })} className="input" /></div>
            <div><label className="label">Business description</label><textarea value={data.businessDescription} onChange={(e) => setData({ ...data, businessDescription: e.target.value })} className="input min-h-[100px]" placeholder="Tell customers about your experience and what makes you stand out." /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="label">Which categories do you serve?</p>
              <div className="flex flex-wrap gap-2">
                {(categories ?? []).map((c) => (
                  <button key={c.id} type="button" onClick={() => toggle('categoryIds', c.id)} className={`badge border px-3 py-1.5 ${data.categoryIds.includes(c.id) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
            {data.categoryIds.length > 0 && (
              <div>
                <p className="label">Select the services you offer</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {filteredServices.map((s) => (
                    <label key={s.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${data.serviceIds.includes(s.id) ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                      <input type="checkbox" checked={data.serviceIds.includes(s.id)} onChange={() => toggle('serviceIds', s.id)} />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Upload documents if available. These help your application get approved faster (all optional).</p>
            <UploadRow label="Business license / certification" url={data.licenseUrl} onChange={handleUpload('licenseUrl')} />
            <UploadRow label="Insurance" url={data.insuranceUrl} onChange={handleUpload('insuranceUrl')} />
            <UploadRow label="Logo" url={data.logoUrl} onChange={handleUpload('logoUrl')} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {[
              ['acceptedProviderAgreement', 'I accept the Provider Agreement'],
              ['acceptedTerms', 'I accept the Terms of Service'],
              ['acceptedPrivacy', 'I accept the Privacy Policy'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={data[key as keyof ProviderApplicationPayload] as boolean} onChange={(e) => setData({ ...data, [key]: e.target.checked })} />
                {label}
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Alert kind="info">Review your application before submitting. Our team typically responds within 48 hours.</Alert>
            <ReviewRow label="Business name" value={data.businessName} />
            <ReviewRow label="Contact" value={`${data.businessPhone} · ${data.businessEmail}`} />
            <ReviewRow label="Service area" value={data.serviceArea} />
            <ReviewRow label="Categories" value={`${data.categoryIds.length} selected`} />
            <ReviewRow label="Services" value={`${data.serviceIds.length} selected`} />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-secondary">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="btn-primary">Continue</button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn-primary">{submitting ? <Spinner className="h-4 w-4" /> : 'Submit application'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadRow({ label, url, onChange }: { label: string; url?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {url && <p className="text-xs text-emerald-600">✓ Uploaded</p>}
      </div>
      <label className="btn-secondary cursor-pointer !py-1.5 text-xs">
        {url ? 'Replace' : 'Upload'}
        <input type="file" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value || '—'}</span>
    </div>
  );
}
