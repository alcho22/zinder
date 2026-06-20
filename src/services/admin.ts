/**
 * Admin service: users, providers, approvals, lead charges, settings, and a
 * dashboard summary.
 */
import { http, mockDelay, USE_MOCK } from './http';
import { db, persist } from './mock/store';
import type { LeadCharge, Order, PlatformSettings, ProviderProfile, User } from '@/types';

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  pendingApprovals: number;
  totalOrders: number;
  pendingOrders: number;
  leadRevenue: number;
}

/** GET /admin/stats -> AdminStats */
export async function getAdminStats(): Promise<AdminStats> {
  if (!USE_MOCK) return http.get('/admin/stats');
  const d = db();
  return mockDelay({
    totalUsers: d.users.length,
    totalProviders: d.providers.filter((p) => p.status === 'approved').length,
    pendingApprovals: d.users.filter((u) => u.providerApplicationStatus === 'pending').length,
    totalOrders: d.orders.length,
    pendingOrders: d.orders.filter((o) => o.status === 'pending').length,
    leadRevenue: d.leadCharges.filter((l) => l.status === 'paid').reduce((sum, l) => sum + l.amount, 0),
  });
}

/** GET /admin/users -> User[] */
export async function listUsers(q?: string): Promise<User[]> {
  if (!USE_MOCK) return http.get('/admin/users', { query: { q } });
  let list = db().users;
  if (q) {
    const term = q.toLowerCase();
    list = list.filter((u) => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(term));
  }
  return mockDelay(list);
}

/** PATCH /admin/users/:id  { status } */
export async function setUserStatus(userId: string, status: User['status']): Promise<User> {
  if (!USE_MOCK) return http.patch(`/admin/users/${userId}`, { status });
  const u = db().users.find((x) => x.id === userId)!;
  u.status = status;
  persist();
  return mockDelay(u);
}

/** GET /admin/providers -> ProviderProfile[] */
export async function listProviders(): Promise<ProviderProfile[]> {
  if (!USE_MOCK) return http.get('/admin/providers');
  return mockDelay(db().providers);
}

/** PATCH /admin/providers/:id { status } */
export async function setProviderStatus(providerId: string, status: ProviderProfile['status']): Promise<ProviderProfile> {
  if (!USE_MOCK) return http.patch(`/admin/providers/${providerId}`, { status });
  const p = db().providers.find((x) => x.id === providerId)!;
  p.status = status;
  persist();
  return mockDelay(p);
}

/** GET /admin/provider-approvals -> User[] (applicants pending review) */
export async function listProviderApprovals(): Promise<User[]> {
  if (!USE_MOCK) return http.get('/admin/provider-approvals');
  return mockDelay(db().users.filter((u) => u.providerApplicationStatus === 'pending'));
}

/** POST /admin/provider-approvals/:userId/decision { decision, reason } */
export async function decideProviderApplication(
  userId: string,
  decision: 'approve' | 'reject' | 'more_info',
  _reason?: string,
): Promise<User> {
  if (!USE_MOCK) return http.post(`/admin/provider-approvals/${userId}/decision`, { decision, reason: _reason });
  const u = db().users.find((x) => x.id === userId)!;
  if (decision === 'approve') {
    u.providerApplicationStatus = 'approved';
    u.isProvider = true;
    u.role = 'provider';
  } else if (decision === 'reject') {
    u.providerApplicationStatus = 'rejected';
  } else {
    u.providerApplicationStatus = 'more_info_requested';
  }
  // Notify the applicant.
  db().notifications.unshift({
    id: `n_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    title: 'Provider application update',
    body:
      decision === 'approve'
        ? 'Congratulations! Your provider application was approved. Your provider dashboard is now unlocked.'
        : decision === 'reject'
          ? `Your provider application was not approved.${_reason ? ` Reason: ${_reason}` : ''}`
          : `We need more information to review your application.${_reason ? ` ${_reason}` : ''}`,
    read: false,
    createdAt: new Date().toISOString(),
    link: decision === 'approve' ? '/provider/dashboard' : '/dashboard/become-provider',
  });
  persist();
  return mockDelay(u);
}

/** GET /admin/orders -> Order[] */
export async function listAllOrders(params?: { q?: string; status?: string }): Promise<Order[]> {
  if (!USE_MOCK) return http.get('/admin/orders', { query: params });
  let list = db().orders;
  if (params?.status) list = list.filter((o) => o.status === params.status);
  if (params?.q) {
    const q = params.q.toLowerCase();
    list = list.filter((o) => `${o.customerName} ${o.providerName} ${o.serviceName} ${o.id}`.toLowerCase().includes(q));
  }
  return mockDelay(list);
}

/** GET /admin/lead-charges  (or GET /provider/wallet for the provider's own) */
export async function listLeadCharges(providerId?: string): Promise<LeadCharge[]> {
  if (!USE_MOCK) return providerId ? http.get('/provider/wallet') : http.get('/admin/lead-charges');
  let list = db().leadCharges;
  if (providerId) list = list.filter((l) => l.providerId === providerId);
  return mockDelay(list);
}

/** GET /admin/settings -> PlatformSettings */
export async function getSettings(): Promise<PlatformSettings> {
  if (!USE_MOCK) return http.get('/admin/settings');
  return mockDelay(db().settings);
}

/** PUT /admin/settings -> PlatformSettings */
export async function updateSettings(patch: Partial<PlatformSettings>): Promise<PlatformSettings> {
  if (!USE_MOCK) return http.put('/admin/settings', patch);
  db().settings = { ...db().settings, ...patch };
  persist();
  return mockDelay(db().settings);
}
