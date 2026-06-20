# Zinder API Contract

This is the endpoint contract the frontend expects. All request/response shapes
map to the TypeScript types in [`src/types/index.ts`](./src/types/index.ts) —
treat that file as the source of truth for field names and shapes.

**Conventions**

- Base URL configured via `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://api.zinder.com`).
- JSON in, JSON out. `Content-Type: application/json`.
- Auth: `Authorization: Bearer <token>` header. Token issued at login/register.
- Errors: non-2xx with `{ "message": "..." }`. The client surfaces `message`.
- IDs are strings.
- Enforce **role-based authorization server-side** (customer / provider / admin).
- Enforce the **privacy rule**: do not include a customer's full contact details
  (email/phone/street line) in provider-facing order responses until the order
  is `accepted` (or a quote has been sent).

---

## Auth

| Method | Path                    | Body                                            | Returns               |
| ------ | ----------------------- | ----------------------------------------------- | --------------------- |
| POST   | `/auth/register`        | `RegisterPayload`                               | `{ token, user }`     |
| POST   | `/auth/login`           | `{ email, password }`                           | `{ token, user }`     |
| POST   | `/auth/verify-otp`      | `{ code }`                                       | `{ verified }`        |
| POST   | `/auth/forgot-password` | `{ email }`                                      | `{ sent }`            |
| POST   | `/auth/reset-password`  | `{ token, password }`                            | `{ ok }`              |
| GET    | `/auth/me`              | —                                               | `User`                |

## Catalog (public reads)

| Method | Path                         | Notes                                  | Returns           |
| ------ | ---------------------------- | -------------------------------------- | ----------------- |
| GET    | `/categories`                | include `serviceCount`                 | `Category[]`      |
| GET    | `/categories/:slug`          |                                        | `Category`        |
| GET    | `/services`                  | query: `categoryId`, `q`               | `Service[]`       |
| GET    | `/services/:slug`            |                                        | `Service`         |
| GET    | `/services/:id/options`      | active options, sorted by `sortOrder`  | `ServiceOption[]` |

## Providers (public discovery)

| Method | Path                          | Notes                                                          | Returns            |
| ------ | ----------------------------- | ------------------------------------------------------------- | ------------------ |
| GET    | `/providers`                  | query: `q,zip,categoryId,serviceId,minRating,maxPrice,mobileOnly,certifiedOnly,sort` | `ProviderCard[]`   |
| GET    | `/providers/:id`              |                                                              | `ProviderProfile`  |
| GET    | `/providers/:id/services`     | each item includes its `service`                             | `ProviderService[]`|

`ProviderCard` = `ProviderProfile` plus optional `matchedPriceMin/matchedPriceMax`
when `serviceId` is provided. `distanceMiles` is computed from `zip`.

## Customer account

| Method | Path                              | Body / Notes               | Returns      |
| ------ | --------------------------------- | -------------------------- | ------------ |
| PUT    | `/account/profile`                | `Partial<User>`            | `User`       |
| GET    | `/account/vehicles`               |                            | `Vehicle[]`  |
| GET    | `/account/vehicles/:id`           |                            | `Vehicle`    |
| POST   | `/account/vehicles`               | vehicle fields             | `Vehicle`    |
| PUT    | `/account/vehicles/:id`           | vehicle fields             | `Vehicle`    |
| DELETE | `/account/vehicles/:id`           |                            | `204`        |
| GET    | `/account/addresses`              |                            | `Address[]`  |
| POST   | `/account/addresses`              | address fields             | `Address`    |
| PUT    | `/account/addresses/:id`          | address fields             | `Address`    |
| DELETE | `/account/addresses/:id`          |                            | `204`        |
| POST   | `/account/provider-application`   | `ProviderApplicationPayload` | `{ status }` |

## Orders & quotes

| Method | Path                               | Body / Notes                         | Returns   |
| ------ | ---------------------------------- | ------------------------------------ | --------- |
| POST   | `/orders`                          | `CreateOrderPayload`                 | `Order`   |
| GET    | `/orders`                          | query `role=customer`                | `Order[]` |
| GET    | `/orders/:id`                      |                                      | `Order`   |
| POST   | `/orders/:id/accept-quote`         | customer accepts provider's quote    | `Order`   |
| GET    | `/provider/orders`                 | requests for the logged-in provider  | `Order[]` |
| POST   | `/provider/orders/:id/quote`       | `{ finalPrice, note }` → charges lead fee | `Order` |
| POST   | `/provider/orders/:id/reject`      | `{ reason? }`                        | `Order`   |

On `quote`, the backend should create the `LeadCharge` (Product Plan §5.2) and
notify the customer.

## Provider self-management

| Method | Path                          | Body / Notes                | Returns            |
| ------ | ----------------------------- | --------------------------- | ------------------ |
| GET    | `/provider/me`                |                             | `ProviderProfile`  |
| PUT    | `/provider/me`                | `Partial<ProviderProfile>`  | `ProviderProfile`  |
| POST   | `/provider/services`          | provider-service fields     | `ProviderService`  |
| PUT    | `/provider/services/:id`      | provider-service fields     | `ProviderService`  |
| DELETE | `/provider/services/:id`      |                             | `204`              |
| GET    | `/provider/wallet`            | the provider's lead charges | `LeadCharge[]`     |

## Notifications

| Method | Path                          | Returns          |
| ------ | ----------------------------- | ---------------- |
| GET    | `/notifications`              | `Notification[]` |
| POST   | `/notifications/:id/read`     | `204`            |
| POST   | `/notifications/read-all`     | `204`            |

## Admin

| Method | Path                                          | Body / Notes                          | Returns           |
| ------ | --------------------------------------------- | ------------------------------------- | ----------------- |
| GET    | `/admin/stats`                                |                                       | `AdminStats`      |
| GET    | `/admin/users`                                | query `q`                             | `User[]`          |
| PATCH  | `/admin/users/:id`                            | `{ status }`                          | `User`            |
| GET    | `/admin/providers`                            |                                       | `ProviderProfile[]` |
| PATCH  | `/admin/providers/:id`                        | `{ status }`                          | `ProviderProfile` |
| GET    | `/admin/provider-approvals`                   | applicants pending review             | `User[]`          |
| POST   | `/admin/provider-approvals/:userId/decision`  | `{ decision: approve\|reject\|more_info, reason? }` | `User` |
| GET    | `/admin/orders`                               | query `q`, `status`                   | `Order[]`         |
| GET    | `/admin/lead-charges`                         |                                       | `LeadCharge[]`    |
| GET    | `/admin/settings`                             |                                       | `PlatformSettings`|
| PUT    | `/admin/settings`                             | `Partial<PlatformSettings>`           | `PlatformSettings`|
| POST   | `/admin/categories` · PUT `/admin/categories/:id` · DELETE `…/:id` | catalog CRUD | `Category` |
| POST   | `/admin/services` · PUT `/admin/services/:id` · DELETE `…/:id`     | catalog CRUD | `Service` |
| POST   | `/admin/service-options` · PUT `…/:id` · DELETE `…/:id`            | dynamic form CRUD | `ServiceOption` |

## File uploads

| Method | Path        | Body                          | Returns       |
| ------ | ----------- | ----------------------------- | ------------- |
| POST   | `/uploads`  | `multipart/form-data` (`file`) | `{ url }`     |

Used for provider documents/logo and customer request photos. Return a publicly
accessible URL (e.g. S3).

---

## Payloads

See `src/types/index.ts` for the exact shapes. Key ones:

- `RegisterPayload`: `{ firstName, lastName, email, phone, password }`
- `CreateOrderPayload`: `{ providerId, serviceId, vehicleId, addressId, selectedOptions[], description, photos[], preferredDate?, preferredTimeWindow? }`
- `ProviderApplicationPayload`: business info + `categoryIds[]` + `serviceIds[]` + document URLs + acceptance flags.
- `SelectedOption`: `{ optionId, label, value }` where `value` is string | string[] | boolean | number.
