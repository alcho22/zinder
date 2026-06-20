import { useState } from 'react';
import { Alert } from '@/components/ui';

export default function Contact() {
  const [sent, setSent] = useState(false);

  // BACKEND: POST /contact { name, email, message }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-2 text-slate-500">
        Questions about Zinder? Reach our Austin team and we’ll get back to you within one business day.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">Email</p>
          <p className="mt-1 text-slate-800">support@zinder.com</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">Phone</p>
          <p className="mt-1 text-slate-800">(512) 555-0100</p>
        </div>
      </div>

      {sent ? (
        <div className="mt-6">
          <Alert kind="success">Thanks! Your message has been sent. We’ll be in touch shortly.</Alert>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="label">Name</label>
            <input className="input" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[120px]" required />
          </div>
          <button type="submit" className="btn-primary w-full">Send message</button>
        </form>
      )}
    </div>
  );
}
