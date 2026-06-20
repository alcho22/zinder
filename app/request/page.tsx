'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import RequestService from '@/views/customer/RequestService';

export default function RequestPage() {
  return (
    <ProtectedRoute>
      <RequestService />
    </ProtectedRoute>
  );
}
