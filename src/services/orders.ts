/**
 * Orders (service requests) and quotes.
 *
 * Note on privacy (Product Plan §6 "avoid platform leakage"): the customer's
 * full contact details should NOT be revealed to a provider until the lead is
 * accepted. The backend should enforce this; the frontend only shows what the
 * API returns.
 */
import { http, mockDelay, USE_MOCK } from './http';
import { db, persist, uid } from './mock/store';
import type { Order, Quote, SelectedOption } from '@/types';

export interface CreateOrderPayload {
  providerId: string;
  serviceId: string;
  vehicleId: string;
  addressId: string;
  selectedOptions: SelectedOption[];
  description: string;
  photos: string[];
  preferredDate?: string;
  preferredTimeWindow?: string;
}

/** POST /orders -> Order */
export async function createOrder(payload: CreateOrderPayload, customerId: string): Promise<Order> {
  if (!USE_MOCK) return http.post('/orders', payload);

  const provider = db().providers.find((p) => p.id === payload.providerId)!;
  const service = db().services.find((s) => s.id === payload.serviceId)!;
  const vehicle = db().vehicles.find((v) => v.id === payload.vehicleId)!;
  const address = db().addresses.find((a) => a.id === payload.addressId)!;
  const customer = db().users.find((u) => u.id === customerId)!;

  const order: Order = {
    id: uid('ord'),
    customerId,
    customerName: `${customer.firstName} ${customer.lastName.charAt(0)}.`,
    providerId: provider.id,
    providerName: provider.businessName,
    serviceId: service.id,
    serviceName: service.name,
    vehicleSnapshot: { make: vehicle.make, model: vehicle.model, year: vehicle.year, color: vehicle.color, vin: vehicle.vin },
    addressSnapshot: { line1: address.line1, line2: address.line2, city: address.city, state: address.state, zip: address.zip },
    selectedOptionsSnapshot: payload.selectedOptions,
    description: payload.description,
    photos: payload.photos,
    preferredDate: payload.preferredDate,
    preferredTimeWindow: payload.preferredTimeWindow,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db().orders.unshift(order);
  // Notify the provider's user.
  db().notifications.unshift({
    id: uid('n'), userId: provider.userId, title: 'New service request',
    body: `New ${service.name} request is waiting for your response.`, read: false,
    createdAt: order.createdAt, link: `/provider/orders/${order.id}`,
  });
  persist();
  return mockDelay(order);
}

/** GET /orders?role=customer -> Order[]  (the logged-in customer's orders) */
export async function listCustomerOrders(customerId: string): Promise<Order[]> {
  if (!USE_MOCK) return http.get('/orders', { query: { role: 'customer' } });
  return mockDelay(db().orders.filter((o) => o.customerId === customerId));
}

/** GET /provider/orders -> Order[]  (requests sent to the logged-in provider) */
export async function listProviderOrders(providerId: string): Promise<Order[]> {
  if (!USE_MOCK) return http.get('/provider/orders');
  return mockDelay(db().orders.filter((o) => o.providerId === providerId));
}

/** GET /orders/:id -> Order */
export async function getOrder(id: string): Promise<Order | null> {
  if (!USE_MOCK) return http.get(`/orders/${id}`);
  return mockDelay(db().orders.find((o) => o.id === id) ?? null);
}

/**
 * POST /provider/orders/:id/quote -> Order
 * Accepting + quoting triggers the lead fee (Product Plan §5.2, §11.6).
 */
export async function sendQuote(orderId: string, finalPrice: number, note: string, leadFee: number): Promise<Order> {
  if (!USE_MOCK) return http.post(`/provider/orders/${orderId}/quote`, { finalPrice, note });

  const order = db().orders.find((o) => o.id === orderId)!;
  const quote: Quote = {
    id: uid('q'), orderId, providerId: order.providerId, finalPrice, note,
    status: 'sent', createdAt: new Date().toISOString(),
  };
  order.quote = quote;
  order.status = 'quote_sent';

  // Charge the provider the lead fee.
  db().leadCharges.unshift({
    id: uid('lc'), providerId: order.providerId, orderId, amount: leadFee,
    status: 'paid', createdAt: quote.createdAt,
  });
  // Notify the customer.
  db().notifications.unshift({
    id: uid('n'), userId: order.customerId, title: 'Quote received',
    body: `${order.providerName} sent you a quote of $${finalPrice} for ${order.serviceName}.`,
    read: false, createdAt: quote.createdAt, link: `/dashboard/orders/${orderId}`,
  });
  persist();
  return mockDelay(order);
}

/** POST /provider/orders/:id/reject -> Order */
export async function rejectOrder(orderId: string, _reason?: string): Promise<Order> {
  if (!USE_MOCK) return http.post(`/provider/orders/${orderId}/reject`, { reason: _reason });
  const order = db().orders.find((o) => o.id === orderId)!;
  order.status = 'rejected';
  persist();
  return mockDelay(order);
}

/** POST /orders/:id/accept-quote -> Order  (customer accepts a provider's quote) */
export async function acceptQuote(orderId: string): Promise<Order> {
  if (!USE_MOCK) return http.post(`/orders/${orderId}/accept-quote`);
  const order = db().orders.find((o) => o.id === orderId)!;
  order.status = 'accepted';
  if (order.quote) order.quote.status = 'accepted';
  persist();
  return mockDelay(order);
}
