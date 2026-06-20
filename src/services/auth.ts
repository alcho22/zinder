/**
 * Auth service. Real endpoints are shown above each function. In mock mode we
 * authenticate against seed users (any password works) and mint a fake token.
 */
import { http, mockDelay, setToken, USE_MOCK } from './http';
import { db, persist, uid } from './mock/store';
import type { AuthSession, RegisterPayload, User } from '@/types';

const CURRENT_USER_KEY = 'zinder.currentUserId';

/** POST /auth/login  { email, password } -> { token, user } */
export async function login(email: string, _password: string): Promise<AuthSession> {
  if (!USE_MOCK) {
    const session = await http.post<AuthSession>('/auth/login', { email, password: _password }, { auth: false });
    setToken(session.token);
    return session;
  }
  const user = db().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('No account found with that email. Try customer@zinder.com, provider@zinder.com, or admin@zinder.com.');
  const token = `mock.${user.id}`;
  setToken(token);
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  return mockDelay({ token, user });
}

/** POST /auth/register -> { token, user } */
export async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (!USE_MOCK) {
    const session = await http.post<AuthSession>('/auth/register', payload, { auth: false });
    setToken(session.token);
    return session;
  }
  const exists = db().users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) throw new Error('An account with that email already exists.');
  const user: User = {
    id: uid('u'),
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    role: 'customer',
    status: 'active',
    createdAt: new Date().toISOString(),
    isProvider: false,
    providerApplicationStatus: 'none',
  };
  db().users.push(user);
  persist();
  const token = `mock.${user.id}`;
  setToken(token);
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  return mockDelay({ token, user });
}

/** POST /auth/verify-otp  { code } -> { verified } */
export async function verifyOtp(code: string): Promise<{ verified: boolean }> {
  if (!USE_MOCK) return http.post('/auth/verify-otp', { code });
  // Mock: accept "123456" as the magic code.
  return mockDelay({ verified: code === '123456' || code.length === 6 });
}

/** POST /auth/forgot-password { email } */
export async function forgotPassword(email: string): Promise<{ sent: boolean }> {
  if (!USE_MOCK) return http.post('/auth/forgot-password', { email }, { auth: false });
  return mockDelay({ sent: true });
}

/** POST /auth/reset-password { token, password } */
export async function resetPassword(token: string, password: string): Promise<{ ok: boolean }> {
  if (!USE_MOCK) return http.post('/auth/reset-password', { token, password }, { auth: false });
  return mockDelay({ ok: true });
}

/** GET /auth/me -> User  (restores the session on page reload) */
export async function getCurrentUser(): Promise<User | null> {
  if (!USE_MOCK) {
    try {
      return await http.get<User>('/auth/me');
    } catch {
      return null;
    }
  }
  const id = localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  return db().users.find((u) => u.id === id) ?? null;
}

export function logout(): void {
  setToken(null);
  localStorage.removeItem(CURRENT_USER_KEY);
}
