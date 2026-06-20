import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { Alert, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (redirect) navigate(redirect);
      else navigate(user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider/dashboard' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Zinder account."
      footer={<>Don’t have an account? <Link to="/register" className="font-semibold text-brand-600">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600">Forgot?</Link>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner className="h-4 w-4" /> : 'Log in'}
        </button>
      </form>

      <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-600">Demo accounts (mock mode — any password):</p>
        <p>customer@zinder.com · provider@zinder.com · admin@zinder.com</p>
      </div>
    </AuthShell>
  );
}
