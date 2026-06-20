/**
 * Seed data for mock mode. Mirrors the catalog and data model from the
 * Product Plan. This exists ONLY to let the frontend run without a backend.
 * The backend developer can delete `src/services/mock/` once real endpoints
 * are wired up (toggle VITE_USE_MOCK=false).
 */
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

export const settings: PlatformSettings = {
  companyName: 'Zinder Service LLC',
  supportEmail: 'support@zinder.com',
  supportPhone: '(512) 555-0100',
  leadFeeLow: 8,
  leadFeeMedium: 18,
  leadFeeHigh: 32,
  primaryCity: 'Austin, TX',
  maintenanceMode: false,
  registrationOpen: true,
};

export const categories: Category[] = [
  { id: 'c1', name: 'Car Wash & Detailing', slug: 'car-wash-detailing', description: 'Exterior wash, interior cleaning, full detail, ceramic coating, and more.', icon: '🧽', status: 'active' },
  { id: 'c2', name: 'Oil & Fluids', slug: 'oil-fluids', description: 'Oil changes, brake fluid, coolant, and transmission fluid service.', icon: '🛢️', status: 'active' },
  { id: 'c3', name: 'Battery & Electrical', slug: 'battery-electrical', description: 'Battery replacement, jump start, alternator, starter, and diagnostics.', icon: '🔋', status: 'active' },
  { id: 'c4', name: 'Tires & Wheels', slug: 'tires-wheels', description: 'Tire replacement and repair, rotation, alignment, and balancing.', icon: '🛞', status: 'active' },
  { id: 'c5', name: 'Mechanical Repairs', slug: 'mechanical-repairs', description: 'Brakes, check engine diagnostics, suspension, and maintenance.', icon: '🔧', status: 'active' },
  { id: 'c6', name: 'Glass & Tint', slug: 'glass-tint', description: 'Window tint, tint removal, windshield repair and replacement.', icon: '🪟', status: 'active' },
  { id: 'c7', name: 'Body & Paint', slug: 'body-paint', description: 'Dent repair, scratch repair, bumper repair, and paint touch-up.', icon: '🎨', status: 'active' },
  { id: 'c8', name: 'Roadside Assistance', slug: 'roadside-assistance', description: 'Towing, lockout, fuel delivery, and flat tire assistance.', icon: '🚨', status: 'active' },
  { id: 'c9', name: 'Mobile / On-Site Services', slug: 'mobile-on-site', description: 'Providers who come to your location.', icon: '📍', status: 'active' },
  { id: 'c10', name: 'AC & Climate Control', slug: 'ac-climate', description: 'AC diagnostics and recharge, heater repair, cabin air filter.', icon: '❄️', status: 'active' },
  { id: 'c11', name: 'Inspections', slug: 'inspections', description: 'Pre-purchase inspection, general inspection, state inspection prep.', icon: '🔍', status: 'active' },
];

export const services: Service[] = [
  // Car Wash & Detailing
  { id: 's1', categoryId: 'c1', name: 'Exterior Wash', slug: 'exterior-wash', description: 'A thorough hand or machine exterior wash.', status: 'active', leadTier: 'low' },
  { id: 's2', categoryId: 'c1', name: 'Interior Cleaning', slug: 'interior-cleaning', description: 'Vacuum, wipe-down, and interior detail.', status: 'active', leadTier: 'low' },
  { id: 's3', categoryId: 'c1', name: 'Full Detail', slug: 'full-detail', description: 'Complete interior + exterior detailing package.', status: 'active', leadTier: 'medium' },
  { id: 's4', categoryId: 'c1', name: 'Ceramic Coating', slug: 'ceramic-coating', description: 'Long-lasting paint protection coating.', status: 'active', leadTier: 'high' },
  { id: 's5', categoryId: 'c1', name: 'Headlight Restoration', slug: 'headlight-restoration', description: 'Restore foggy or yellowed headlights.', status: 'active', leadTier: 'low' },
  // Oil & Fluids
  { id: 's6', categoryId: 'c2', name: 'Oil Change', slug: 'oil-change', description: 'Conventional, synthetic blend, or full synthetic oil change.', status: 'active', leadTier: 'low' },
  { id: 's7', categoryId: 'c2', name: 'Brake Fluid Flush', slug: 'brake-fluid-flush', description: 'Complete brake fluid replacement.', status: 'active', leadTier: 'medium' },
  { id: 's8', categoryId: 'c2', name: 'Coolant Flush', slug: 'coolant-flush', description: 'Drain and replace engine coolant.', status: 'active', leadTier: 'medium' },
  // Battery & Electrical
  { id: 's9', categoryId: 'c3', name: 'Battery Replacement', slug: 'battery-replacement', description: 'Test and replace your vehicle battery.', status: 'active', leadTier: 'medium' },
  { id: 's10', categoryId: 'c3', name: 'Jump Start', slug: 'jump-start', description: 'On-site jump start service.', status: 'active', leadTier: 'low' },
  { id: 's11', categoryId: 'c3', name: 'Electrical Diagnostics', slug: 'electrical-diagnostics', description: 'Diagnose electrical and charging issues.', status: 'active', leadTier: 'medium' },
  { id: 's12', categoryId: 'c3', name: 'Alternator Replacement', slug: 'alternator-replacement', description: 'Replace a faulty alternator.', status: 'active', leadTier: 'high' },
  // Tires & Wheels
  { id: 's13', categoryId: 'c4', name: 'Tire Replacement', slug: 'tire-replacement', description: 'Mount and balance new tires.', status: 'active', leadTier: 'medium' },
  { id: 's14', categoryId: 'c4', name: 'Tire Repair', slug: 'tire-repair', description: 'Patch or plug a punctured tire.', status: 'active', leadTier: 'low' },
  { id: 's15', categoryId: 'c4', name: 'Wheel Alignment', slug: 'wheel-alignment', description: 'Two- or four-wheel alignment.', status: 'active', leadTier: 'medium' },
  // Mechanical Repairs
  { id: 's16', categoryId: 'c5', name: 'Brake Service', slug: 'brake-service', description: 'Pad, rotor, and brake system service.', status: 'active', leadTier: 'high' },
  { id: 's17', categoryId: 'c5', name: 'Check Engine Light Diagnostics', slug: 'check-engine-diagnostics', description: 'Scan and diagnose check engine codes.', status: 'active', leadTier: 'medium' },
  { id: 's18', categoryId: 'c5', name: 'Suspension Inspection', slug: 'suspension-inspection', description: 'Inspect shocks, struts, and suspension.', status: 'active', leadTier: 'medium' },
  // Glass & Tint
  { id: 's19', categoryId: 'c6', name: 'Window Tint', slug: 'window-tint', description: 'Professional window tint installation.', status: 'active', leadTier: 'medium' },
  { id: 's20', categoryId: 'c6', name: 'Windshield Repair', slug: 'windshield-repair', description: 'Chip and crack repair.', status: 'active', leadTier: 'low' },
  { id: 's21', categoryId: 'c6', name: 'Windshield Replacement', slug: 'windshield-replacement', description: 'Full windshield replacement.', status: 'active', leadTier: 'high' },
  // Body & Paint
  { id: 's22', categoryId: 'c7', name: 'Dent Repair', slug: 'dent-repair', description: 'Paintless dent removal and repair.', status: 'active', leadTier: 'medium' },
  { id: 's23', categoryId: 'c7', name: 'Scratch Repair', slug: 'scratch-repair', description: 'Buff and repair surface scratches.', status: 'active', leadTier: 'medium' },
  // Roadside Assistance
  { id: 's24', categoryId: 'c8', name: 'Towing', slug: 'towing', description: 'Local towing to a shop or destination.', status: 'active', leadTier: 'medium' },
  { id: 's25', categoryId: 'c8', name: 'Lockout', slug: 'lockout', description: 'Vehicle lockout assistance.', status: 'active', leadTier: 'low' },
  { id: 's26', categoryId: 'c8', name: 'Fuel Delivery', slug: 'fuel-delivery', description: 'Emergency fuel delivery.', status: 'active', leadTier: 'low' },
  // AC & Climate
  { id: 's27', categoryId: 'c10', name: 'AC Diagnostics', slug: 'ac-diagnostics', description: 'Diagnose air conditioning issues.', status: 'active', leadTier: 'medium' },
  { id: 's28', categoryId: 'c10', name: 'AC Recharge', slug: 'ac-recharge', description: 'Recharge refrigerant and check for leaks.', status: 'active', leadTier: 'medium' },
  // Inspections
  { id: 's29', categoryId: 'c11', name: 'Pre-Purchase Inspection', slug: 'pre-purchase-inspection', description: 'Full inspection before buying a used car.', status: 'active', leadTier: 'medium' },
  { id: 's30', categoryId: 'c11', name: 'General Vehicle Inspection', slug: 'general-inspection', description: 'Multi-point vehicle inspection.', status: 'active', leadTier: 'low' },
];

export const serviceOptions: ServiceOption[] = [
  // Battery Replacement (s9) — from the PRD example
  { id: 'o1', serviceId: 's9', label: 'What is the issue?', type: 'single_select', required: true, status: 'active', sortOrder: 1, choices: ['Dead battery', 'Weak start', 'Jump start needed', 'Not sure'] },
  { id: 'o2', serviceId: 's9', label: 'Is the vehicle drivable?', type: 'single_select', required: true, status: 'active', sortOrder: 2, choices: ['Yes', 'No'] },
  { id: 'o3', serviceId: 's9', label: 'Do dashboard lights turn on?', type: 'single_select', required: false, status: 'active', sortOrder: 3, choices: ['Yes', 'No', 'Not sure'] },
  { id: 'o4', serviceId: 's9', label: 'Do you need mobile service?', type: 'boolean', required: true, status: 'active', sortOrder: 4 },
  // Brake Service (s16)
  { id: 'o5', serviceId: 's16', label: 'Front, rear, or both?', type: 'single_select', required: true, status: 'active', sortOrder: 1, choices: ['Front', 'Rear', 'Both', 'Not sure'] },
  { id: 'o6', serviceId: 's16', label: 'What noise do you hear?', type: 'single_select', required: false, status: 'active', sortOrder: 2, choices: ['Squealing', 'Grinding', 'Clicking', 'None'] },
  { id: 'o7', serviceId: 's16', label: 'Any vibration when braking?', type: 'boolean', required: false, status: 'active', sortOrder: 3 },
  { id: 'o8', serviceId: 's16', label: 'Is the brake warning light on?', type: 'boolean', required: false, status: 'active', sortOrder: 4 },
  { id: 'o9', serviceId: 's16', label: 'How urgent is this?', type: 'single_select', required: true, status: 'active', sortOrder: 5, choices: ['ASAP / unsafe to drive', 'Within a few days', 'This week', 'Flexible'] },
  // Full Detail (s3)
  { id: 'o10', serviceId: 's3', label: 'Vehicle size', type: 'single_select', required: true, status: 'active', sortOrder: 1, choices: ['Sedan / Coupe', 'SUV / Crossover', 'Truck', 'Van / Minivan'] },
  { id: 'o11', serviceId: 's3', label: 'Package type', type: 'single_select', required: true, status: 'active', sortOrder: 2, choices: ['Interior only', 'Exterior only', 'Full interior + exterior'] },
  { id: 'o12', serviceId: 's3', label: 'Pet hair present?', type: 'boolean', required: false, status: 'active', sortOrder: 3 },
  { id: 'o13', serviceId: 's3', label: 'Heavy stains?', type: 'boolean', required: false, status: 'active', sortOrder: 4 },
  { id: 'o14', serviceId: 's3', label: 'Mobile or shop?', type: 'single_select', required: true, status: 'active', sortOrder: 5, choices: ['Come to me (mobile)', 'I will visit the shop'] },
  // Oil Change (s6)
  { id: 'o15', serviceId: 's6', label: 'Oil type preference', type: 'single_select', required: true, status: 'active', sortOrder: 1, choices: ['Conventional', 'Synthetic blend', 'Full synthetic', 'Not sure'] },
  { id: 'o16', serviceId: 's6', label: 'Mobile service needed?', type: 'boolean', required: true, status: 'active', sortOrder: 2 },
];

export const users: User[] = [
  { id: 'u1', firstName: 'Alex', lastName: 'Customer', email: 'customer@zinder.com', phone: '(512) 555-0111', role: 'customer', status: 'active', createdAt: '2026-01-10T10:00:00Z', isProvider: false, providerApplicationStatus: 'none' },
  { id: 'u2', firstName: 'Maria', lastName: 'Mechanic', email: 'provider@zinder.com', phone: '(512) 555-0122', role: 'provider', status: 'active', createdAt: '2026-01-05T10:00:00Z', isProvider: true, providerApplicationStatus: 'approved' },
  { id: 'u3', firstName: 'Sam', lastName: 'Admin', email: 'admin@zinder.com', phone: '(512) 555-0133', role: 'admin', status: 'active', createdAt: '2025-12-01T10:00:00Z' },
  { id: 'u4', firstName: 'Jordan', lastName: 'Detailer', email: 'jordan@detail.com', phone: '(512) 555-0144', role: 'provider', status: 'active', createdAt: '2026-02-01T10:00:00Z', isProvider: true, providerApplicationStatus: 'approved' },
  { id: 'u5', firstName: 'Pat', lastName: 'Applicant', email: 'pat@newshop.com', phone: '(512) 555-0155', role: 'customer', status: 'active', createdAt: '2026-06-15T10:00:00Z', isProvider: false, providerApplicationStatus: 'pending' },
];

export const providers: ProviderProfile[] = [
  { id: 'p1', userId: 'u2', businessName: "Maria's Mobile Mechanics", bio: 'ASE-certified mobile mechanic serving greater Austin. 12+ years of experience in diagnostics, brakes, and electrical.', phone: '(512) 555-0122', email: 'provider@zinder.com', status: 'approved', serviceArea: 'Austin, TX (25 mi radius)', isCertified: true, isMobile: true, rating: 4.8, reviewCount: 214, responseRate: 92, categoryIds: ['c3', 'c5', 'c2', 'c10'], city: 'Austin, TX', distanceMiles: 3.2 },
  { id: 'p2', userId: 'u4', businessName: 'Lone Star Detailing', bio: 'Premium mobile and shop-based auto detailing. Ceramic coating specialists.', phone: '(512) 555-0144', email: 'jordan@detail.com', status: 'approved', serviceArea: 'Austin, TX (15 mi radius)', isCertified: true, isMobile: true, rating: 4.9, reviewCount: 388, responseRate: 88, categoryIds: ['c1'], city: 'Austin, TX', distanceMiles: 5.7 },
  { id: 'p3', userId: 'u6', businessName: 'Capital Tire & Wheel', bio: 'Fast, fair tire service. New tires, repairs, alignments, and balancing.', phone: '(512) 555-0166', email: 'info@capitaltire.com', status: 'approved', serviceArea: 'Austin, TX (shop)', isCertified: false, isMobile: false, rating: 4.5, reviewCount: 96, responseRate: 75, categoryIds: ['c4'], city: 'Austin, TX', distanceMiles: 8.1 },
  { id: 'p4', userId: 'u7', businessName: 'ATX Roadside Heroes', bio: '24/7 towing, lockout, jump start, and fuel delivery across Austin.', phone: '(512) 555-0177', email: 'dispatch@atxroadside.com', status: 'approved', serviceArea: 'Austin metro', isCertified: true, isMobile: true, rating: 4.6, reviewCount: 142, responseRate: 95, categoryIds: ['c8', 'c3'], city: 'Austin, TX', distanceMiles: 2.0 },
  { id: 'p5', userId: 'u8', businessName: 'Clearview Glass & Tint', bio: 'Window tint, windshield repair and replacement. Lifetime warranty on tint.', phone: '(512) 555-0188', email: 'hello@clearviewatx.com', status: 'approved', serviceArea: 'Austin, TX (shop + mobile)', isCertified: true, isMobile: true, rating: 4.7, reviewCount: 173, responseRate: 81, categoryIds: ['c6'], city: 'Austin, TX', distanceMiles: 6.4 },
];

export const providerServices: ProviderService[] = [
  // Maria's Mobile Mechanics
  { id: 'ps1', providerId: 'p1', serviceId: 's9', priceMin: 140, priceMax: 260, priceNote: 'Includes battery + mobile install', status: 'active' },
  { id: 'ps2', providerId: 'p1', serviceId: 's10', priceMin: 49, priceMax: 79, status: 'active' },
  { id: 'ps3', providerId: 'p1', serviceId: 's16', priceMin: 180, priceMax: 420, priceNote: 'Per axle, parts included', status: 'active' },
  { id: 'ps4', providerId: 'p1', serviceId: 's17', priceMin: 89, priceMax: 129, status: 'active' },
  { id: 'ps5', providerId: 'p1', serviceId: 's6', priceMin: 69, priceMax: 119, status: 'active' },
  { id: 'ps6', providerId: 'p1', serviceId: 's28', priceMin: 120, priceMax: 220, status: 'active' },
  // Lone Star Detailing
  { id: 'ps7', providerId: 'p2', serviceId: 's3', priceMin: 150, priceMax: 350, priceNote: 'Varies by vehicle size', status: 'active' },
  { id: 'ps8', providerId: 'p2', serviceId: 's4', priceMin: 600, priceMax: 1500, status: 'active' },
  { id: 'ps9', providerId: 'p2', serviceId: 's1', priceMin: 40, priceMax: 75, status: 'active' },
  { id: 'ps10', providerId: 'p2', serviceId: 's2', priceMin: 80, priceMax: 160, status: 'active' },
  // Capital Tire
  { id: 'ps11', providerId: 'p3', serviceId: 's13', priceMin: 100, priceMax: 240, priceNote: 'Per tire, mount + balance', status: 'active' },
  { id: 'ps12', providerId: 'p3', serviceId: 's14', priceMin: 25, priceMax: 45, status: 'active' },
  { id: 'ps13', providerId: 'p3', serviceId: 's15', priceMin: 89, priceMax: 149, status: 'active' },
  // Roadside
  { id: 'ps14', providerId: 'p4', serviceId: 's24', priceMin: 75, priceMax: 200, status: 'active' },
  { id: 'ps15', providerId: 'p4', serviceId: 's25', priceMin: 45, priceMax: 95, status: 'active' },
  { id: 'ps16', providerId: 'p4', serviceId: 's10', priceMin: 45, priceMax: 75, status: 'active' },
  { id: 'ps17', providerId: 'p4', serviceId: 's26', priceMin: 40, priceMax: 70, status: 'active' },
  // Glass & Tint
  { id: 'ps18', providerId: 'p5', serviceId: 's19', priceMin: 180, priceMax: 450, status: 'active' },
  { id: 'ps19', providerId: 'p5', serviceId: 's20', priceMin: 60, priceMax: 120, status: 'active' },
  { id: 'ps20', providerId: 'p5', serviceId: 's21', priceMin: 250, priceMax: 600, status: 'active' },
];

export const vehicles: Vehicle[] = [
  { id: 'v1', userId: 'u1', make: 'Toyota', model: 'Camry', year: 2019, color: 'Silver', vin: '4T1B11HK5KU000000' },
  { id: 'v2', userId: 'u1', make: 'Honda', model: 'CR-V', year: 2022, color: 'Blue' },
];

export const addresses: Address[] = [
  { id: 'a1', userId: 'u1', label: 'Home', line1: '1100 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', isDefault: true },
  { id: 'a2', userId: 'u1', label: 'Work', line1: '500 W 2nd St', city: 'Austin', state: 'TX', zip: '78701', isDefault: false },
];

export const orders: Order[] = [
  {
    id: 'ord1', customerId: 'u1', customerName: 'Alex C.', providerId: 'p1', providerName: "Maria's Mobile Mechanics",
    serviceId: 's16', serviceName: 'Brake Service',
    vehicleSnapshot: { make: 'Toyota', model: 'Camry', year: 2019, color: 'Silver' },
    addressSnapshot: { line1: '1100 Congress Ave', city: 'Austin', state: 'TX', zip: '78701' },
    selectedOptionsSnapshot: [
      { optionId: 'o5', label: 'Front, rear, or both?', value: 'Front' },
      { optionId: 'o9', label: 'How urgent is this?', value: 'Within a few days' },
    ],
    description: 'Squealing when braking at low speeds. Would like a quote for front pads.',
    photos: [], preferredDate: '2026-06-23', preferredTimeWindow: 'Morning (8am–12pm)',
    status: 'quote_sent', createdAt: '2026-06-19T14:00:00Z',
    quote: { id: 'q1', orderId: 'ord1', providerId: 'p1', finalPrice: 240, note: 'Front pads + rotor resurface. Mobile service included.', status: 'sent', createdAt: '2026-06-19T16:30:00Z' },
  },
  {
    id: 'ord2', customerId: 'u1', customerName: 'Alex C.', providerId: 'p2', providerName: 'Lone Star Detailing',
    serviceId: 's3', serviceName: 'Full Detail',
    vehicleSnapshot: { make: 'Honda', model: 'CR-V', year: 2022, color: 'Blue' },
    addressSnapshot: { line1: '1100 Congress Ave', city: 'Austin', state: 'TX', zip: '78701' },
    selectedOptionsSnapshot: [
      { optionId: 'o10', label: 'Vehicle size', value: 'SUV / Crossover' },
      { optionId: 'o11', label: 'Package type', value: 'Full interior + exterior' },
      { optionId: 'o14', label: 'Mobile or shop?', value: 'Come to me (mobile)' },
    ],
    description: 'Looking for a full detail before a road trip next weekend.',
    photos: [], preferredDate: '2026-06-25', preferredTimeWindow: 'Afternoon (12pm–5pm)',
    status: 'pending', createdAt: '2026-06-20T09:15:00Z',
  },
];

export const leadCharges: LeadCharge[] = [
  { id: 'lc1', providerId: 'p1', orderId: 'ord1', amount: 32, status: 'paid', createdAt: '2026-06-19T16:30:00Z' },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Quote received', body: "Maria's Mobile Mechanics sent you a quote of $240 for Brake Service.", read: false, createdAt: '2026-06-19T16:31:00Z', link: '/dashboard/orders/ord1' },
  { id: 'n2', userId: 'u2', title: 'New service request', body: 'You received a new Brake Service request from Alex C.', read: true, createdAt: '2026-06-19T14:01:00Z', link: '/provider/orders/ord1' },
  { id: 'n3', userId: 'u2', title: 'New service request', body: 'New Full Detail request is waiting for your response.', read: false, createdAt: '2026-06-20T09:16:00Z', link: '/provider/orders/ord2' },
];
