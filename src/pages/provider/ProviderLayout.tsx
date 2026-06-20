import { DashboardLayout, type NavItem } from '@/components/DashboardLayout';

const NAV: NavItem[] = [
  { to: '/provider/dashboard', label: 'Overview', icon: '📊' },
  { to: '/provider/orders', label: 'Requests', icon: '📥' },
  { to: '/provider/services', label: 'Services & Pricing', icon: '🧰' },
  { to: '/provider/wallet', label: 'Lead Charges', icon: '💳' },
  { to: '/provider/profile', label: 'Business Profile', icon: '🏢' },
  { to: '/provider/documents', label: 'Documents', icon: '📄' },
  { to: '/provider/notifications', label: 'Notifications', icon: '🔔' },
];

export function ProviderLayout() {
  return <DashboardLayout nav={NAV} title="Provider" accent="accent" />;
}
