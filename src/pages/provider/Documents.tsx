import { useState } from 'react';
import { uploadFile } from '@/services/account';
import { Alert, PageHeader } from '@/components/ui';

/**
 * Provider documents & certification status. Uploaded files go through the
 * shared upload endpoint (POST /uploads). The backend should associate the
 * returned URLs with the provider and surface verification status.
 */
export default function ProviderDocuments() {
  const [docs, setDocs] = useState<Record<string, string>>({});

  const upload = (key: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await uploadFile(file);
    setDocs((d) => ({ ...d, [key]: url }));
  };

  const ROWS = [
    { key: 'license', label: 'Business license / certification' },
    { key: 'insurance', label: 'Insurance certificate' },
    { key: 'logo', label: 'Business logo' },
    { key: 'banner', label: 'Profile banner image' },
  ];

  return (
    <div>
      <PageHeader title="Documents & certifications" subtitle="Upload documents to build trust and earn a verified badge." />
      <Alert kind="info">Verification is reviewed by the Zinder team. Approved documents unlock your “Certified” badge.</Alert>
      <div className="card mt-4 max-w-2xl divide-y divide-slate-100">
        {ROWS.map((r) => (
          <div key={r.key} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-slate-800">{r.label}</p>
              {docs[r.key] ? <p className="text-xs text-emerald-600">✓ Uploaded — pending review</p> : <p className="text-xs text-slate-400">Not uploaded</p>}
            </div>
            <label className="btn-secondary cursor-pointer !py-1.5 text-xs">
              {docs[r.key] ? 'Replace' : 'Upload'}
              <input type="file" className="hidden" onChange={upload(r.key)} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
