'use client';

import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerLayout } from '@/views/customer/CustomerLayout';

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
  );
}
