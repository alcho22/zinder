import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { listUsers, setUserStatus } from '@/services/admin';
import { PageHeader, PageLoader } from '@/components/ui';
import { dateOnly } from '@/lib/format';

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const { data: users, loading, reload } = useAsync(() => listUsers(q || undefined), [q]);

  const toggle = async (id: string, status: string) => {
    await setUserStatus(id, status === 'active' ? 'suspended' : 'active');
    reload();
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage all platform users." />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="input mb-4 max-w-sm" />

      {loading ? (
        <PageLoader />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(users ?? []).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3"><span className="badge bg-slate-100 capitalize text-slate-600">{u.role}</span></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{dateOnly(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => toggle(u.id, u.status)} className="btn-ghost !px-3 !py-1.5 text-xs">
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
