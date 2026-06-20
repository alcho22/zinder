import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { Alert, Spinner } from '@/components/ui';
import { forgotPassword } from '@/services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We’ll email you a link to reset your password."
      footer={<><Link to="/login" className="font-semibold text-brand-600">Back to log in</Link></>}
    >
      {sent ? (
        <Alert kind="success">If an account exists for {email}, a reset link is on its way.</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Spinner className="h-4 w-4" /> : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
