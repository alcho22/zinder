/**
 * Catalog service: categories, services, and service options.
 * The catalog is admin-controlled (Product Plan §6, §14).
 */
import { http, mockDelay, USE_MOCK } from './http';
import { db, persist, uid } from './mock/store';
import type { Category, Service, ServiceOption } from '@/types';

/** GET /categories -> Category[] */
export async function listCategories(): Promise<Category[]> {
  if (!USE_MOCK) return http.get('/categories', { auth: false });
  const cats = db().categories.map((c) => ({
    ...c,
    serviceCount: db().services.filter((s) => s.categoryId === c.id && s.status === 'active').length,
  }));
  return mockDelay(cats);
}

/** GET /categories/:slug -> Category */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!USE_MOCK) return http.get(`/categories/${slug}`, { auth: false });
  return mockDelay(db().categories.find((c) => c.slug === slug) ?? null);
}

/** GET /services?categoryId=&q= -> Service[] */
export async function listServices(params?: { categoryId?: string; q?: string }): Promise<Service[]> {
  if (!USE_MOCK) return http.get('/services', { auth: false, query: params });
  let items = db().services.filter((s) => s.status === 'active');
  if (params?.categoryId) items = items.filter((s) => s.categoryId === params.categoryId);
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  return mockDelay(items);
}

/** GET /services/:slug -> Service */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!USE_MOCK) return http.get(`/services/${slug}`, { auth: false });
  return mockDelay(db().services.find((s) => s.slug === slug) ?? null);
}

/** GET /services/:id/options -> ServiceOption[] */
export async function getServiceOptions(serviceId: string): Promise<ServiceOption[]> {
  if (!USE_MOCK) return http.get(`/services/${serviceId}/options`, { auth: false });
  const opts = db()
    .serviceOptions.filter((o) => o.serviceId === serviceId && o.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return mockDelay(opts);
}

/* ---------------------------------------------------------------------------
 * Admin catalog mutations
 * ------------------------------------------------------------------------- */

/** POST /admin/categories  /  PUT /admin/categories/:id */
export async function saveCategory(cat: Partial<Category> & { name: string }): Promise<Category> {
  if (!USE_MOCK) {
    return cat.id
      ? http.put(`/admin/categories/${cat.id}`, cat)
      : http.post('/admin/categories', cat);
  }
  if (cat.id) {
    const idx = db().categories.findIndex((c) => c.id === cat.id);
    db().categories[idx] = { ...db().categories[idx], ...cat } as Category;
    persist();
    return mockDelay(db().categories[idx]);
  }
  const created: Category = {
    id: uid('c'),
    name: cat.name,
    slug: cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-'),
    description: cat.description ?? '',
    icon: cat.icon ?? '🔧',
    status: cat.status ?? 'active',
  };
  db().categories.push(created);
  persist();
  return mockDelay(created);
}

/** POST /admin/services  /  PUT /admin/services/:id */
export async function saveService(svc: Partial<Service> & { name: string; categoryId: string }): Promise<Service> {
  if (!USE_MOCK) {
    return svc.id ? http.put(`/admin/services/${svc.id}`, svc) : http.post('/admin/services', svc);
  }
  if (svc.id) {
    const idx = db().services.findIndex((s) => s.id === svc.id);
    db().services[idx] = { ...db().services[idx], ...svc } as Service;
    persist();
    return mockDelay(db().services[idx]);
  }
  const created: Service = {
    id: uid('s'),
    categoryId: svc.categoryId,
    name: svc.name,
    slug: svc.slug ?? svc.name.toLowerCase().replace(/\s+/g, '-'),
    description: svc.description ?? '',
    status: svc.status ?? 'active',
    leadTier: svc.leadTier ?? 'medium',
  };
  db().services.push(created);
  persist();
  return mockDelay(created);
}

/** POST /admin/service-options  /  PUT /admin/service-options/:id */
export async function saveServiceOption(opt: Partial<ServiceOption> & { serviceId: string; label: string }): Promise<ServiceOption> {
  if (!USE_MOCK) {
    return opt.id ? http.put(`/admin/service-options/${opt.id}`, opt) : http.post('/admin/service-options', opt);
  }
  if (opt.id) {
    const idx = db().serviceOptions.findIndex((o) => o.id === opt.id);
    db().serviceOptions[idx] = { ...db().serviceOptions[idx], ...opt } as ServiceOption;
    persist();
    return mockDelay(db().serviceOptions[idx]);
  }
  const created: ServiceOption = {
    id: uid('o'),
    serviceId: opt.serviceId,
    label: opt.label,
    type: opt.type ?? 'text',
    required: opt.required ?? false,
    status: opt.status ?? 'active',
    sortOrder: opt.sortOrder ?? 99,
    choices: opt.choices,
    helpText: opt.helpText,
  };
  db().serviceOptions.push(created);
  persist();
  return mockDelay(created);
}

/** DELETE /admin/categories/:id | /admin/services/:id | /admin/service-options/:id */
export async function deleteCatalogEntity(kind: 'category' | 'service' | 'option', id: string): Promise<void> {
  if (!USE_MOCK) {
    const path = kind === 'category' ? 'categories' : kind === 'service' ? 'services' : 'service-options';
    await http.delete(`/admin/${path}/${id}`);
    return;
  }
  if (kind === 'category') db().categories = db().categories.filter((c) => c.id !== id);
  if (kind === 'service') db().services = db().services.filter((s) => s.id !== id);
  if (kind === 'option') db().serviceOptions = db().serviceOptions.filter((o) => o.id !== id);
  persist();
  return mockDelay(undefined);
}
