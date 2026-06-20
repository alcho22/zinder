import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/account';
import { Alert, PageHeader, Spinner } from '@/components/ui';

export default function CustomerProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ firstName: user!.firstName, lastName: user!.lastName, email: user!.email, phone: user!.phone });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile(user!.id, form);
      setUser(updated);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal information." />
      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4 p-6">
        {saved && <Alert kind="success">Profile updated.</Alert>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">First name</label>
            <input value={form.firstName} onChange={set('firstName')} className="input" required />
          </div>
          <div>
            <label className="label">Last name</label>
            <input value={form.lastName} onChange={set('lastName')} className="input" required />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={form.email} onChange={set('email')} className="input" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className="input" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Spinner className="h-4 w-4" /> : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
