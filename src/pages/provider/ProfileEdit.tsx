import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyProviderProfile, updateProviderProfile } from '@/services/providers';
import { Alert, PageHeader, PageLoader, Spinner } from '@/components/ui';
import type { ProviderProfile } from '@/types';

export default function ProviderProfileEdit() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProviderProfile(user!.id).then((p) => { setProfile(p); setLoading(false); });
  }, [user]);

  if (loading) return <PageLoader />;
  if (!profile) return <PageHeader title="Business profile" subtitle="No provider profile found." />;

  const set = <K extends keyof ProviderProfile>(k: K, v: ProviderProfile[K]) => { setProfile({ ...profile, [k]: v }); setSaved(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProviderProfile(profile.id, profile);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Business profile" subtitle="This is what customers see on your public profile." />
      <form onSubmit={save} className="card max-w-2xl space-y-4 p-6">
        {saved && <Alert kind="success">Profile saved.</Alert>}
        <div><label className="label">Business name</label><input value={profile.businessName} onChange={(e) => set('businessName', e.target.value)} className="input" /></div>
        <div><label className="label">Bio</label><textarea value={profile.bio} onChange={(e) => set('bio', e.target.value)} className="input min-h-[120px]" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Business phone</label><input value={profile.phone} onChange={(e) => set('phone', e.target.value)} className="input" /></div>
          <div><label className="label">Business email</label><input value={profile.email} onChange={(e) => set('email', e.target.value)} className="input" /></div>
        </div>
        <div><label className="label">Service area</label><input value={profile.serviceArea} onChange={(e) => set('serviceArea', e.target.value)} className="input" /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={profile.isMobile} onChange={(e) => set('isMobile', e.target.checked)} /> Offer mobile / on-site service</label>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? <Spinner className="h-4 w-4" /> : 'Save profile'}</button>
      </form>
    </div>
  );
}
