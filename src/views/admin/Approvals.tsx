import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { decideProviderApplication, listProviderApprovals } from '@/services/admin';
import { EmptyState, Modal, PageHeader, PageLoader, Spinner } from '@/components/ui';
import { dateOnly } from '@/lib/format';
import type { User } from '@/types';

export default function AdminApprovals() {
  const { data: applicants, loading, reload } = useAsync(() => listProviderApprovals(), []);
  const [rejecting, setRejecting] = useState<User | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const decide = async (userId: string, decision: 'approve' | 'reject' | 'more_info', r?: string) => {
    setBusy(true);
    try {
      await decideProviderApplication(userId, decision, r);
      setRejecting(null);
      setReason('');
      reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Provider approvals" subtitle="Review and decide on provider applications." />

      {loading ? (
        <PageLoader />
      ) : applicants && applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{a.firstName} {a.lastName}</p>
                  <p className="text-sm text-slate-500">{a.email} · {a.phone}</p>
                  <p className="text-xs text-slate-400">Applied {dateOnly(a.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => decide(a.id, 'approve')} disabled={busy} className="btn-primary !py-1.5 text-xs">Approve</button>
                  <button onClick={() => decide(a.id, 'more_info', 'Please provide your business license.')} disabled={busy} className="btn-secondary !py-1.5 text-xs">Request info</button>
                  <button onClick={() => setRejecting(a)} disabled={busy} className="btn-ghost !py-1.5 text-xs text-red-600">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="✅" title="No pending applications" description="New provider applications will appear here for review." />
      )}

      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Reject application"
        footer={
          <>
            <button onClick={() => setRejecting(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => rejecting && decide(rejecting.id, 'reject', reason)} disabled={busy} className="btn-danger">{busy ? <Spinner className="h-4 w-4" /> : 'Reject'}</button>
          </>
        }
      >
        <label className="label">Reason (shared with the applicant)</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="input min-h-[100px]" placeholder="Let them know why and what they can fix." />
      </Modal>
    </div>
  );
}
