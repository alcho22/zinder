'use client';

import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProviderLayout } from '@/views/provider/ProviderLayout';

export default function ProviderGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute roles={['provider', 'admin']}>
      <ProviderLayout>{children}</ProviderLayout>
    </ProtectedRoute>
  );
}
