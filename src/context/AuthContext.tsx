import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import * as authService from '@/services/auth';
import type { RegisterPayload, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  /** Refresh the user from the API (e.g. after becoming a provider). */
  refresh: () => Promise<void>;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    setUser(session.user);
    return session.user;
  };

  const register = async (payload: RegisterPayload) => {
    const session = await authService.register(payload);
    setUser(session.user);
    return session.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refresh = async () => {
    const u = await authService.getCurrentUser();
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
