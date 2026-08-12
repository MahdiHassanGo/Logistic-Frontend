# Frontend implementation map

| Frontend route | Status | Backend source |
|---|---|---|
| `/login` | Real | `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me` |
| `/app/dashboard` | Real | `GET /dashboard/summary` |
| `/app/customers` | Real | `GET /customers` |
| `/app/customers/new` | Real | `POST /customers` |
| `/app/customers/:id` | Real | `GET /customers/:id`, `/ledger` |
| `/app/products` | Real | `GET/POST /products` |
| `/app/purchases` | Real | `GET /purchases` |
| `/app/purchases/new` | Real | `POST /purchases` with idempotency |
| `/app/purchases/:id` | Real | `GET /purchases/:id` |
| `/app/invoices` | Derived | Purchase-linked invoices |
| `/app/invoices/:id` | Derived | Purchase detail includes invoice |
| `/app/payments` | Real | `GET /payments` |
| `/app/payments/new` | Real | `POST /payments` with idempotency |
| `/app/payments/:id` | Real | `GET /payments/:id`, reverse endpoint |
| `/app/dues` | Derived | `GET /customers?hasDue=true` |
| `/app/transport/deliveries` | Real | `GET /deliveries` |
| `/app/transport/deliveries/new` | Real | `POST /deliveries` |
| `/app/transport/deliveries/:id` | Real | `GET/PATCH /deliveries/:id/status` |
| `/app/transport/drivers` | Partial | Create endpoint only |
| `/app/transport/vehicles` | Partial | Create endpoint only |
| `/app/reports` | Prototype | Dashboard + bounded purchase/payment data |
| `/app/sms-history` | Waiting backend | No routed SMS endpoint |
| `/app/users` | Real | `GET/POST/PATCH /users` |
| `/app/settings` | Waiting backend | No routed settings endpoint |
