import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
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
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in but wrong role — send them to their own home.
    const home = user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider/dashboard' : '/dashboard';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
