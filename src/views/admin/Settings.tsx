import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/services/admin';
import { Alert, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { PlatformSettings } from '@/types';

/**
 * Platform settings. The Product Plan (§13.3) lists a large set of admin
 * settings groups. This page implements the MVP-critical ones (company info,
 * lead fees, toggles). Additional groups (SEO, email/SMS templates, branding,
 * etc.) can be added as more tabs backed by the same /admin/settings API.
 */
const GROUPS = ['General', 'Lead Fees', 'Access'] as const;
type Group = (typeof GROUPS)[number];

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [group, setGroup] = useState<Group>('General');

  useEffect(() => { getSettings().then((s) => { setSettings(s); setLoading(false); }); }, []);

  if (loading || !settings) return <PageLoader />;

  const set = <K extends keyof PlatformSettings>(k: K, v: PlatformSettings[K]) => { setSettings({ ...settings, [k]: v }); setSaved(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { const updated = await updateSettings(settings); setSettings(updated); setSaved(true); } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Platform settings" subtitle="Configure how the Zinder marketplace operates." />

      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {GROUPS.map((g) => (
          <button key={g} onClick={() => setGroup(g)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${group === g ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{g}</button>
        ))}
      </div>

      <form onSubmit={save} className="card max-w-2xl space-y-4 p-6">
        {saved && <Alert kind="success">Settings saved.</Alert>}

        {group === 'General' && (
          <>
            <div><label className="label">Company name</label><input value={settings.companyName} onChange={(e) => set('companyName', e.target.value)} className="input" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Support email</label><input value={settings.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} className="input" /></div>
              <div><label className="label">Support phone</label><input value={settings.supportPhone} onChange={(e) => set('supportPhone', e.target.value)} className="input" /></div>
            </div>
            <div><label className="label">Primary city</label><input value={settings.primaryCity} onChange={(e) => set('primaryCity', e.target.value)} className="input" /></div>
          </>
        )}

        {group === 'Lead Fees' && (
          <>
            <Alert kind="info">Lead fees are charged to providers when they accept a request, based on the service’s value tier.</Alert>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Low tier ($)</label><input type="number" value={settings.leadFeeLow} onChange={(e) => set('leadFeeLow', Number(e.target.value))} className="input" /></div>
              <div><label className="label">Medium tier ($)</label><input type="number" value={settings.leadFeeMedium} onChange={(e) => set('leadFeeMedium', Number(e.target.value))} className="input" /></div>
              <div><label className="label">High tier ($)</label><input type="number" value={settings.leadFeeHigh} onChange={(e) => set('leadFeeHigh', Number(e.target.value))} className="input" /></div>
            </div>
          </>
        )}

        {group === 'Access' && (
          <>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
              <span><span className="font-medium text-slate-800">Open registration</span><br /><span className="text-slate-500">Allow new users to sign up.</span></span>
              <input type="checkbox" checked={settings.registrationOpen} onChange={(e) => set('registrationOpen', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
              <span><span className="font-medium text-slate-800">Maintenance mode</span><br /><span className="text-slate-500">Temporarily take the marketplace offline.</span></span>
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => set('maintenanceMode', e.target.checked)} />
            </label>
          </>
        )}

        <button type="submit" disabled={saving} className="btn-primary">{saving ? <Spinner className="h-4 w-4" /> : 'Save settings'}</button>
      </form>
    </div>
  );
}
