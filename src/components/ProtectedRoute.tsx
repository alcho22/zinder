'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from './ui';
import type { UserRole } from '@/types';

/**
 * Gate a route by authentication and (optionally) role. Role-based access is
 * a hard requirement in the Product Plan (§9). The backend must ALSO enforce
 * these rules — never trust the client alone.
 */
export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRole[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '';

  const wrongRole = !!user && !!roles && !roles.includes(user.role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (wrongRole) {
      const home =
        user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider/dashboard' : '/dashboard';
      router.replace(home);
    }
  }, [loading, user, wrongRole, router, pathname]);

  if (loading || !user || wrongRole) return <PageLoader />;

  return <>{children}</>;
}
