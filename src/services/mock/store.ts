/**
 * Mutable in-memory store for mock mode, persisted to localStorage so data
 * survives page reloads during demos. Backend developer: ignore this file —
 * it only exists to make the frontend runnable without an API.
 */
import * as seed from './seed';
import type {
  Address,
  Category,
  LeadCharge,
  Notification,
  Order,
  PlatformSettings,
  ProviderProfile,
  ProviderService,
  Service,
  ServiceOption,
  User,
  Vehicle,
} from '@/types';

interface DB {
  users: User[];
  providers: ProviderProfile[];
  categories: Category[];
  services: Service[];
  serviceOptions: ServiceOption[];
  providerServices: ProviderService[];
  vehicles: Vehicle[];
  addresses: Address[];
  orders: Order[];
  leadCharges: LeadCharge[];
  notifications: Notification[];
  settings: PlatformSettings;
}

const STORAGE_KEY = 'zinder.mockdb.v1';

function freshDB(): DB {
  return {
    users: structuredClone(seed.users),
    providers: structuredClone(seed.providers),
    categories: structuredClone(seed.categories),
    services: structuredClone(seed.services),
    serviceOptions: structuredClone(seed.serviceOptions),
    providerServices: structuredClone(seed.providerServices),
    vehicles: structuredClone(seed.vehicles),
    addresses: structuredClone(seed.addresses),
    orders: structuredClone(seed.orders),
    leadCharges: structuredClone(seed.leadCharges),
    notifications: structuredClone(seed.notifications),
    settings: structuredClone(seed.settings),
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    // ignore malformed storage
  }
  const db = freshDB();
  persist(db);
  return db;
}

let _db: DB | null = null;

export function db(): DB {
  if (!_db) _db = load();
  return _db;
}

export function persist(next?: DB): void {
  if (next) _db = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_db));
  } catch {
    // storage full / unavailable — fine for a mock
  }
}

/** Reset the mock database back to seed data (handy for demos). */
export function resetMockDb(): void {
  _db = freshDB();
  persist();
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
