# LogiKhata Web

React + TypeScript + Vite frontend for the provided LogiKhata backend and supplied HTML designs.

## Stack
- React 19 + TypeScript + Vite
- React Router
- TanStack Query
- Zustand
- Axios
- React Hook Form + Zod
- Tailwind CSS
- Recharts

## Run
```bash
npm install
npm run dev
```
Default API:
```env
VITE_API_BASE_URL=https://logistic-backend-beta.vercel.app/api/v1
```

## Authentication
The web client sends `clientType: "WEB"`, stores the access token **only in memory**, sends `credentials`/cookies, and performs a single-flight `/auth/refresh` before retrying a 401.

### Important deployment requirement
The backend ZIP currently contains:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
COOKIE_SECURE=false
```
and the refresh cookie is configured with `SameSite=Strict`.

For a deployed frontend, update the backend environment to include the exact frontend origin, use HTTPS, and configure cookie policy/domain for your deployment topology. A frontend deployed on a different site from the API cannot depend on a `SameSite=Strict` refresh cookie.

## Backend routes actually implemented
- `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`
- `/dashboard/summary`
- `/customers` + customer details/ledger
- `/products`
- `/purchases`
- `/payments`
- `/deliveries` + create driver/vehicle + delivery status
- `/users`

## Planned UI routes whose dedicated backend endpoints are not yet implemented
- Dedicated invoice list/detail/PDF/SMS API
- Dedicated dues/aging API
- Reports aggregate/export API
- SMS history/resend API
- Settings/company/SMS/backup API
- Driver list/update API
- Vehicle list/update API

The frontend exposes these screens but marks the gap. Invoice list/detail is derived from purchases; dues are derived from customers with `hasDue=true`; reports use bounded fetched transactions as a prototype. Replace these derivations when the corresponding backend endpoints are added.

## Security notes
- Do not put backend secrets in `VITE_*` variables.
- Backend remains the authorization boundary.
- Financial writes use idempotency keys.
- Monetary inputs are sent as decimal strings.
- Payment reversal uses the backend compensating reversal flow; records are not deleted.

## Production deployment
For Vercel/Cloudflare/Nginx, configure SPA fallback to `index.html` and update the backend CORS/cookie environment for the production frontend origin.
