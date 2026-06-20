import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from '@/lib/router';
import { AuthShell } from './AuthShell';
import { Alert, Spinner } from '@/components/ui';
import { resetPassword } from '@/services/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={<><Link to="/login" className="font-semibold text-brand-600">Back to log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <div>
          <label className="label">New password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" minLength={6} required />
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" minLength={6} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner className="h-4 w-4" /> : 'Reset password'}
        </button>
      </form>
    </AuthShell>
  );
}
