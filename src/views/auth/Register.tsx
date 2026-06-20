import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { AuthShell } from './AuthShell';
import { Alert, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) { setError('Please accept the Terms and Privacy Policy.'); return; }
    setError(null);
    setLoading(true);
    try {
      await register(form);
      // OTP step (Product Plan §11.1). Skip by going straight to /dashboard if
      // phone verification is disabled in your backend.
      navigate('/verify-otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Zinder to find and request automotive services."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-600">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <div className="grid grid-cols-2 gap-3">
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
          <input type="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="(512) 555-0123" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={form.password} onChange={set('password')} className="input" minLength={6} required />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
          <span>I agree to the <Link to="/terms" className="text-brand-600">Terms</Link> and <Link to="/privacy-policy" className="text-brand-600">Privacy Policy</Link>.</span>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner className="h-4 w-4" /> : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
