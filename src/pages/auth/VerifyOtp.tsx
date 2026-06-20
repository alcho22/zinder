import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { Alert, Spinner } from '@/components/ui';
import { verifyOtp } from '@/services/auth';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { verified } = await verifyOtp(code);
      if (verified) navigate('/dashboard');
      else setError('Invalid code. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Verify your phone" subtitle="Enter the 6-digit code we sent to your phone.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          placeholder="123456"
          className="input text-center text-2xl tracking-[0.5em]"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner className="h-4 w-4" /> : 'Verify'}
        </button>
        <p className="text-center text-xs text-slate-400">Mock mode: use code 123456.</p>
      </form>
    </AuthShell>
  );
}
