import { http, mockDelay, USE_MOCK } from './http';
import { db, persist } from './mock/store';
import type { Notification } from '@/types';

/** GET /notifications -> Notification[] */
export async function listNotifications(userId: string): Promise<Notification[]> {
  if (!USE_MOCK) return http.get('/notifications');
  return mockDelay(
    db().notifications.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

/** POST /notifications/:id/read */
export async function markNotificationRead(id: string): Promise<void> {
  if (!USE_MOCK) { await http.post(`/notifications/${id}/read`); return; }
  const n = db().notifications.find((x) => x.id === id);
  if (n) n.read = true;
  persist();
  return mockDelay(undefined);
}

/** POST /notifications/read-all */
export async function markAllRead(userId: string): Promise<void> {
  if (!USE_MOCK) { await http.post('/notifications/read-all'); return; }
  db().notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
  persist();
  return mockDelay(undefined);
}
