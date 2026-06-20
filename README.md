# Zinder — Frontend

Frontend for **Zinder**, an automotive services marketplace (Austin, TX).
Built with **Next.js (App Router) + TypeScript + Tailwind CSS**.

This repo is the **frontend only**. It ships with a complete mock backend so it
runs and demos standalone. A backend developer connects the real API by
implementing the endpoints documented in [`API.md`](./API.md) and setting two
environment variables — no component code needs to change.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (runs against mock data)
```

Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # next lint
```

### Demo accounts (mock mode — any password works)

| Role     | Email                 | Lands on               |
| -------- | --------------------- | ---------------------- |
| Customer | `customer@zinder.com` | `/dashboard`           |
| Provider | `provider@zinder.com` | `/provider/dashboard`  |
| Admin    | `admin@zinder.com`    | `/admin`               |

OTP verification screen accepts code **`123456`**.

---

## Connecting the real backend

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_API_BASE_URL=https://your-api`.
3. Implement the endpoints listed in [`API.md`](./API.md).

That's it. All network access is centralized — see "Architecture" below. For
local dev against a backend on another port, you can also uncomment the
`rewrites()` proxy in `next.config.mjs`.

---

## Architecture

```
app/                  # Next.js App Router — routing only (thin client wrappers)
├── layout.tsx        #   root layout: <html>, fonts, <AuthProvider>, Suspense
├── (public)/         #   route group with the public header/footer layout
│   ├── page.tsx      #     home
│   ├── categories/[slug]/page.tsx, services/[slug]/page.tsx, providers/[id]/page.tsx, …
│   └── terms/, privacy-policy/, …  (legal pages)
├── (auth)/           #   login, register, verify-otp, forgot/reset password
├── dashboard/        #   customer area  (layout = ProtectedRoute + sidebar)
├── provider/         #   provider area  (layout = ProtectedRoute[provider,admin])
├── admin/            #   admin area     (layout = ProtectedRoute[admin])
├── request/          #   service request wizard (protected, full-screen)
└── not-found.tsx

src/
├── types/            # ← THE DATA CONTRACT. All domain types (User, Order, …).
├── services/         # ← THE API LAYER. One file per domain.
│   ├── http.ts       #    fetch wrapper + USE_MOCK switch + auth token handling
│   ├── auth.ts catalog.ts providers.ts orders.ts account.ts notifications.ts admin.ts
│   └── mock/         #    in-memory seed data (DELETE once API is live)
├── context/          # AuthContext (session state)
├── components/       # Layouts (public/dashboard), route guard, shared UI
├── views/            # Screen components, grouped by area (public/auth/customer/provider/admin)
├── hooks/            # useAsync data-fetching helper
└── lib/
    ├── router.tsx    # react-router-dom→Next.js compatibility shim (Link/useNavigate/…)
    └── format.ts     # formatting helpers
```

Why `app/` is thin: each route file is a small client wrapper that renders a
screen component from `src/views`. The screens were written framework-agnostic
and use a small **router shim** (`src/lib/router.tsx`) that maps the
`react-router`-style helpers (`Link to=`, `useNavigate`, `useParams`,
`useSearchParams`) onto `next/navigation`. This keeps all the real UI in one
place and makes the routing layer trivial to read.

**Every backend call lives in `src/services/`.** Each service function has a
comment showing its real HTTP method + path, then a mock fallback. Example:

```ts
/** POST /orders -> Order */
export async function createOrder(payload, customerId) {
  if (!USE_MOCK) return http.post('/orders', payload);   // ← real backend
  /* ...mock implementation... */                         // ← used until then
}
```

### Auth

After login the JWT is stored in `localStorage` under `zinder.token` and sent as
`Authorization: Bearer <token>` on every request. `GET /auth/me` restores the
session on reload. Role-based routing is enforced in
`components/ProtectedRoute.tsx` (used by the dashboard/provider/admin layouts) —
**the backend must enforce the same rules.**

---

## What's implemented (per the Product Plan)

- **Public site:** home + search, categories, services, provider discovery with
  filters (distance/rating/price/mobile/certified), provider profiles, about,
  contact, FAQ, legal pages.
- **Auth:** register, login, OTP, forgot/reset password.
- **Customer dashboard:** overview, profile, addresses, vehicles, requests &
  request detail (with quote acceptance), notifications, become-a-provider
  onboarding (5 steps), and the full **service request wizard** with dynamic
  per-service questions.
- **Provider dashboard:** overview, request inbox + detail with **accept/quote
  (lead-fee confirmation)** and reject, services & pricing management, lead
  charges, business profile, documents, notifications.
- **Admin dashboard:** overview/stats, provider approvals, orders (search +
  filter), users, providers, category/service/service-option catalog management,
  dynamic-form builder, and platform settings (incl. lead-fee tiers).

## Notable conventions

- **Snapshots:** orders store vehicle/address/option snapshots so historical
  requests stay accurate even if the source records change later.
- **Privacy:** the UI hides full customer contact details from providers until a
  request is accepted (Product Plan §6). The backend must enforce this in the
  data it returns.
- **Lead fees:** computed from the service's `leadTier` × the tier amounts in
  platform settings, charged at quote time.

> Note: the app is currently client-rendered (data fetched in the browser in
> mock mode). Once the API exists, individual screens can be migrated to Server
> Components / server-side fetching incrementally without touching `src/services`.

See [`API.md`](./API.md) for the full endpoint list and payload shapes.
