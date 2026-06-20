'use client';

import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/views/admin/AdminLayout';

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute roles={['admin']}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
