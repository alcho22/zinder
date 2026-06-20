/**
 * Customer account: profile, vehicles, addresses, and the become-provider
 * application.
 */
import { http, mockDelay, USE_MOCK } from './http';
import { db, persist, uid } from './mock/store';
import type { Address, ProviderApplicationPayload, User, Vehicle } from '@/types';

/* ---- Profile -------------------------------------------------------------- */

/** PUT /account/profile -> User */
export async function updateProfile(userId: string, patch: Partial<User>): Promise<User> {
  if (!USE_MOCK) return http.put('/account/profile', patch);
  const idx = db().users.findIndex((u) => u.id === userId);
  db().users[idx] = { ...db().users[idx], ...patch };
  persist();
  return mockDelay(db().users[idx]);
}

/* ---- Vehicles ------------------------------------------------------------- */

/** GET /account/vehicles -> Vehicle[] */
export async function listVehicles(userId: string): Promise<Vehicle[]> {
  if (!USE_MOCK) return http.get('/account/vehicles');
  return mockDelay(db().vehicles.filter((v) => v.userId === userId));
}

/** GET /account/vehicles/:id -> Vehicle */
export async function getVehicle(id: string): Promise<Vehicle | null> {
  if (!USE_MOCK) return http.get(`/account/vehicles/${id}`);
  return mockDelay(db().vehicles.find((v) => v.id === id) ?? null);
}

/** POST /account/vehicles  /  PUT /account/vehicles/:id */
export async function saveVehicle(userId: string, v: Partial<Vehicle> & { make: string; model: string; year: number; color: string }): Promise<Vehicle> {
  if (!USE_MOCK) return v.id ? http.put(`/account/vehicles/${v.id}`, v) : http.post('/account/vehicles', v);
  if (v.id) {
    const idx = db().vehicles.findIndex((x) => x.id === v.id);
    db().vehicles[idx] = { ...db().vehicles[idx], ...v } as Vehicle;
    persist();
    return mockDelay(db().vehicles[idx]);
  }
  const created: Vehicle = { id: uid('v'), userId, make: v.make, model: v.model, year: v.year, color: v.color, vin: v.vin };
  db().vehicles.push(created);
  persist();
  return mockDelay(created);
}

/** DELETE /account/vehicles/:id */
export async function deleteVehicle(id: string): Promise<void> {
  if (!USE_MOCK) { await http.delete(`/account/vehicles/${id}`); return; }
  db().vehicles = db().vehicles.filter((v) => v.id !== id);
  persist();
  return mockDelay(undefined);
}

/* ---- Addresses ------------------------------------------------------------ */

/** GET /account/addresses -> Address[] */
export async function listAddresses(userId: string): Promise<Address[]> {
  if (!USE_MOCK) return http.get('/account/addresses');
  return mockDelay(db().addresses.filter((a) => a.userId === userId));
}

/** POST /account/addresses  /  PUT /account/addresses/:id */
export async function saveAddress(userId: string, a: Partial<Address> & { label: string; line1: string; city: string; state: string; zip: string }): Promise<Address> {
  if (!USE_MOCK) return a.id ? http.put(`/account/addresses/${a.id}`, a) : http.post('/account/addresses', a);
  if (a.isDefault) db().addresses.filter((x) => x.userId === userId).forEach((x) => (x.isDefault = false));
  if (a.id) {
    const idx = db().addresses.findIndex((x) => x.id === a.id);
    db().addresses[idx] = { ...db().addresses[idx], ...a } as Address;
    persist();
    return mockDelay(db().addresses[idx]);
  }
  const created: Address = {
    id: uid('a'), userId, label: a.label, line1: a.line1, line2: a.line2,
    city: a.city, state: a.state, zip: a.zip, isDefault: a.isDefault ?? db().addresses.filter((x) => x.userId === userId).length === 0,
  };
  db().addresses.push(created);
  persist();
  return mockDelay(created);
}

/** DELETE /account/addresses/:id */
export async function deleteAddress(id: string): Promise<void> {
  if (!USE_MOCK) { await http.delete(`/account/addresses/${id}`); return; }
  db().addresses = db().addresses.filter((a) => a.id !== id);
  persist();
  return mockDelay(undefined);
}

/* ---- Become a provider ---------------------------------------------------- */

/** POST /account/provider-application -> { status } */
export async function submitProviderApplication(userId: string, _payload: ProviderApplicationPayload): Promise<{ status: 'pending' }> {
  if (!USE_MOCK) return http.post('/account/provider-application', _payload);
  const idx = db().users.findIndex((u) => u.id === userId);
  db().users[idx].providerApplicationStatus = 'pending';
  persist();
  return mockDelay({ status: 'pending' });
}

/* ---- File upload ---------------------------------------------------------- */

/**
 * POST /uploads (multipart/form-data) -> { url }
 * Backend developer: implement real multipart upload (e.g. to S3) and return
 * the public URL. In mock mode we return a local object URL for preview.
 */
export async function uploadFile(file: File): Promise<{ url: string }> {
  if (!USE_MOCK) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
  return mockDelay({ url: URL.createObjectURL(file) }, 200);
}
