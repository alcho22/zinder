import { DashboardLayout, type NavItem } from '@/components/DashboardLayout';

const NAV: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: '📊', end: true },
  { to: '/admin/provider-approvals', label: 'Approvals', icon: '✅' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/providers', label: 'Providers', icon: '🏢' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/services', label: 'Services', icon: '🧰' },
  { to: '/admin/service-options', label: 'Service Options', icon: '⚙️' },
  { to: '/admin/settings', label: 'Settings', icon: '🔧' },
];

export function AdminLayout() {
  return <DashboardLayout nav={NAV} title="Admin" />;
}
