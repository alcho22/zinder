/**
 * Provider discovery + provider-side profile/service management.
 */
import { http, mockDelay, USE_MOCK } from './http';
import { db, persist, uid } from './mock/store';
import type { ProviderProfile, ProviderService, Service } from '@/types';

export interface ProviderSearchParams {
  q?: string; // service / problem keyword
  zip?: string;
  categoryId?: string;
  serviceId?: string;
  minRating?: number;
  maxPrice?: number;
  mobileOnly?: boolean;
  certifiedOnly?: boolean;
  sort?: 'distance' | 'rating' | 'reviews' | 'price';
}

export interface ProviderCard extends ProviderProfile {
  /** Price range for the matched service, when a service filter is applied. */
  matchedPriceMin?: number;
  matchedPriceMax?: number;
}

/** GET /providers?<filters> -> ProviderCard[] */
export async function searchProviders(params: ProviderSearchParams): Promise<ProviderCard[]> {
  if (!USE_MOCK) return http.get('/providers', { auth: false, query: params as Record<string, string | number | boolean | undefined> });

  let list: ProviderCard[] = db().providers.filter((p) => p.status === 'approved');

  if (params.categoryId) list = list.filter((p) => p.categoryIds.includes(params.categoryId!));

  if (params.serviceId) {
    const ps = db().providerServices.filter((x) => x.serviceId === params.serviceId && x.status === 'active');
    const byProvider = new Map(ps.map((x) => [x.providerId, x]));
    list = list
      .filter((p) => byProvider.has(p.id))
      .map((p) => ({ ...p, matchedPriceMin: byProvider.get(p.id)!.priceMin, matchedPriceMax: byProvider.get(p.id)!.priceMax }));
  }

  if (params.q) {
    const q = params.q.toLowerCase();
    const matchingServiceIds = new Set(
      db().services.filter((s) => s.name.toLowerCase().includes(q)).map((s) => s.id),
    );
    const providerIdsForServices = new Set(
      db().providerServices.filter((x) => matchingServiceIds.has(x.serviceId)).map((x) => x.providerId),
    );
    list = list.filter(
      (p) => p.businessName.toLowerCase().includes(q) || providerIdsForServices.has(p.id),
    );
  }

  if (params.minRating) list = list.filter((p) => p.rating >= params.minRating!);
  if (params.mobileOnly) list = list.filter((p) => p.isMobile);
  if (params.certifiedOnly) list = list.filter((p) => p.isCertified);
  if (params.maxPrice != null && params.serviceId) list = list.filter((p) => (p.matchedPriceMin ?? 0) <= params.maxPrice!);

  switch (params.sort) {
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'reviews': list.sort((a, b) => b.reviewCount - a.reviewCount); break;
    case 'price': list.sort((a, b) => (a.matchedPriceMin ?? Infinity) - (b.matchedPriceMin ?? Infinity)); break;
    default: list.sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999));
  }

  return mockDelay(list);
}

/** GET /providers/:id -> ProviderProfile */
export async function getProvider(id: string): Promise<ProviderProfile | null> {
  if (!USE_MOCK) return http.get(`/providers/${id}`, { auth: false });
  return mockDelay(db().providers.find((p) => p.id === id) ?? null);
}

/** GET /providers/:id/services -> (ProviderService & { service })[] */
export async function getProviderServices(providerId: string): Promise<(ProviderService & { service: Service })[]> {
  if (!USE_MOCK) return http.get(`/providers/${providerId}/services`, { auth: false });
  const items = db()
    .providerServices.filter((ps) => ps.providerId === providerId)
    .map((ps) => ({ ...ps, service: db().services.find((s) => s.id === ps.serviceId)! }))
    .filter((x) => x.service);
  return mockDelay(items);
}

/** GET /provider/me -> ProviderProfile  (the logged-in provider's own profile) */
export async function getMyProviderProfile(userId: string): Promise<ProviderProfile | null> {
  if (!USE_MOCK) return http.get('/provider/me');
  return mockDelay(db().providers.find((p) => p.userId === userId) ?? null);
}

/** PUT /provider/me -> ProviderProfile */
export async function updateProviderProfile(id: string, patch: Partial<ProviderProfile>): Promise<ProviderProfile> {
  if (!USE_MOCK) return http.put('/provider/me', patch);
  const idx = db().providers.findIndex((p) => p.id === id);
  db().providers[idx] = { ...db().providers[idx], ...patch };
  persist();
  return mockDelay(db().providers[idx]);
}

/** POST /provider/services  /  PUT /provider/services/:id */
export async function saveProviderService(
  providerId: string,
  ps: Partial<ProviderService> & { serviceId: string; priceMin: number; priceMax: number },
): Promise<ProviderService> {
  if (!USE_MOCK) {
    return ps.id ? http.put(`/provider/services/${ps.id}`, ps) : http.post('/provider/services', ps);
  }
  if (ps.id) {
    const idx = db().providerServices.findIndex((x) => x.id === ps.id);
    db().providerServices[idx] = { ...db().providerServices[idx], ...ps } as ProviderService;
    persist();
    return mockDelay(db().providerServices[idx]);
  }
  const created: ProviderService = {
    id: uid('ps'),
    providerId,
    serviceId: ps.serviceId,
    priceMin: ps.priceMin,
    priceMax: ps.priceMax,
    priceNote: ps.priceNote,
    status: ps.status ?? 'active',
  };
  db().providerServices.push(created);
  persist();
  return mockDelay(created);
}

/** DELETE /provider/services/:id */
export async function deleteProviderService(id: string): Promise<void> {
  if (!USE_MOCK) { await http.delete(`/provider/services/${id}`); return; }
  db().providerServices = db().providerServices.filter((x) => x.id !== id);
  persist();
  return mockDelay(undefined);
}
