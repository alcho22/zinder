import { Link } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { listNotifications, markAllRead, markNotificationRead } from '@/services/notifications';
import { EmptyState, PageHeader, PageLoader } from '@/components/ui';
import { relativeTime } from '@/lib/format';

export default function CustomerNotifications() {
  const { user } = useAuth();
  const { data: items, loading, reload } = useAsync(() => listNotifications(user!.id), [user!.id]);

  const onRead = async (id: string) => { await markNotificationRead(id); reload(); };
  const onReadAll = async () => { await markAllRead(user!.id); reload(); };

  return (
    <div>
      <PageHeader title="Notifications" action={items && items.some((n) => !n.read) ? <button onClick={onReadAll} className="btn-secondary">Mark all read</button> : undefined} />

      {loading ? (
        <PageLoader />
      ) : items && items.length > 0 ? (
        <div className="card divide-y divide-slate-100">
          {items.map((n) => {
            const body = (
              <div className={`flex items-start gap-3 p-4 ${n.read ? '' : 'bg-brand-50/40'}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-brand-500'}`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="text-sm text-slate-500">{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">{relativeTime(n.createdAt)}</p>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={n.id} to={n.link} onClick={() => onRead(n.id)} className="block hover:bg-slate-50">{body}</Link>
            ) : (
              <button key={n.id} onClick={() => onRead(n.id)} className="block w-full text-left hover:bg-slate-50">{body}</button>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="🔔" title="No notifications" description="You’re all caught up." />
      )}
    </div>
  );
}
