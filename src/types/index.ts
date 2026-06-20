/**
 * Zinder domain types.
 *
 * These mirror the data model in the Product Plan (section 16) and are the
 * contract between the frontend and the backend. Keep field names aligned with
 * the API your backend developer builds. If the API uses different names,
 * adapt them inside `src/services/*` (the mapping layer) rather than changing
 * components throughout the app.
 */

export type ID = string;

export type UserRole = 'customer' | 'provider' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  /** True once the provider application has been approved by an admin. */
  isProvider?: boolean;
  /** Status of a pending/approved/rejected provider application, if any. */
  providerApplicationStatus?: ProviderApplicationStatus;
}

export interface Address {
  id: ID;
  userId: ID;
  label: string; // e.g. "Home", "Work"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Vehicle {
  id: ID;
  userId: ID;
  make: string;
  model: string;
  year: number;
  color: string;
  vin?: string;
}

export type ProviderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type ProviderApplicationStatus =
  | 'none'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'more_info_requested';

export interface ProviderProfile {
  id: ID;
  userId: ID;
  businessName: string;
  bio: string;
  phone: string;
  email: string;
  logo?: string;
  banner?: string;
  status: ProviderStatus;
  serviceArea: string; // e.g. "Austin, TX (25 mi radius)"
  isCertified: boolean;
  isMobile: boolean;
  rating: number; // 0-5
  reviewCount: number;
  responseRate?: number; // 0-100 (%)
  categoryIds: ID[];
  city: string;
  // Estimated distance from the searched location (miles). Computed server-side.
  distanceMiles?: number;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description: string;
  icon: string; // emoji or icon key
  status: 'active' | 'inactive';
  serviceCount?: number;
}

export interface Service {
  id: ID;
  categoryId: ID;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  /** Suggested lead-fee tier used by admin/billing (low/medium/high). */
  leadTier?: 'low' | 'medium' | 'high';
}

export type ServiceOptionType =
  | 'single_select'
  | 'multi_select'
  | 'boolean'
  | 'text'
  | 'number';

export interface ServiceOption {
  id: ID;
  serviceId: ID;
  label: string;
  type: ServiceOptionType;
  required: boolean;
  status: 'active' | 'inactive';
  sortOrder: number;
  /** Choices for single_select / multi_select types. */
  choices?: string[];
  helpText?: string;
}

export interface ProviderService {
  id: ID;
  providerId: ID;
  serviceId: ID;
  priceMin: number;
  priceMax: number;
  priceNote?: string;
  status: 'active' | 'inactive';
}

export type OrderStatus =
  | 'pending' // submitted, awaiting provider response
  | 'quote_sent'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface VehicleSnapshot {
  make: string;
  model: string;
  year: number;
  color: string;
  vin?: string;
}

export interface AddressSnapshot {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

/** Answer to a single ServiceOption captured at order time. */
export interface SelectedOption {
  optionId: ID;
  label: string;
  value: string | string[] | boolean | number;
}

export interface Order {
  id: ID;
  customerId: ID;
  customerName: string;
  providerId: ID;
  providerName: string;
  serviceId: ID;
  serviceName: string;
  vehicleSnapshot: VehicleSnapshot;
  addressSnapshot: AddressSnapshot;
  selectedOptionsSnapshot: SelectedOption[];
  description: string;
  photos: string[]; // URLs
  preferredDate?: string;
  preferredTimeWindow?: string;
  status: OrderStatus;
  createdAt: string;
  quote?: Quote;
}

export interface Quote {
  id: ID;
  orderId: ID;
  providerId: ID;
  finalPrice: number;
  note?: string;
  status: 'sent' | 'accepted' | 'declined';
  createdAt: string;
}

export type LeadChargeStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface LeadCharge {
  id: ID;
  providerId: ID;
  orderId: ID;
  amount: number;
  status: LeadChargeStatus;
  createdAt: string;
}

export interface Notification {
  id: ID;
  userId: ID;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformSettings {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  leadFeeLow: number;
  leadFeeMedium: number;
  leadFeeHigh: number;
  primaryCity: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
}

/** Standard paginated list response shape from the API. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Auth */
export interface AuthSession {
  token: string;
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ProviderApplicationPayload {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessDescription: string;
  serviceArea: string;
  categoryIds: ID[];
  serviceIds: ID[];
  // Document URLs (uploaded separately via the file upload endpoint).
  licenseUrl?: string;
  insuranceUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  acceptedProviderAgreement: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}
