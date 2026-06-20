import { DashboardLayout, type NavItem } from '@/components/DashboardLayout';

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: '📊', end: true },
  { to: '/dashboard/orders', label: 'My Requests', icon: '📋' },
  { to: '/dashboard/vehicles', label: 'My Vehicles', icon: '🚗' },
  { to: '/dashboard/addresses', label: 'Addresses', icon: '📍' },
  { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
  { to: '/dashboard/become-provider', label: 'Become a Provider', icon: '🧰' },
];

export function CustomerLayout() {
  return <DashboardLayout nav={NAV} title="My Account" />;
}
