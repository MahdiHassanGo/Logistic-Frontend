# Backend gaps identified while building the React frontend

The supplied backend source is the source of truth for integration. The planning README contains several routes that are not exposed by the current Express router.

## Implemented and wired
- Auth: login, refresh, logout, me
- Dashboard summary
- Customers: list/create/get/update/ledger
- Products: list/create/update
- Purchases: list/create/get
- Payments: list/create/get/reverse
- Deliveries: list/create/get/status; create driver; create vehicle
- Users: list/create/status/permission overrides

## Planned but not currently routed
- Invoice list/detail route
- Invoice PDF renderer endpoint
- Receipt PDF renderer endpoint
- Due aging endpoint
- Reports aggregates/exports
- SMS history/resend/provider settings
- Company settings
- Backup/restore
- Driver list/update
- Vehicle list/update

## Frontend fallback behavior
- Invoices are extracted from purchase responses (bounded to 100 rows on the list screen).
- Invoice detail prefers a linked purchase id and otherwise scans the bounded purchase list.
- Dues use `GET /customers?hasDue=true`.
- Reports use dashboard aggregates plus a bounded 100-row purchase/payment sample for visualization.
- SMS/settings show explicit backend-gap states rather than fabricated records.
- Driver/vehicle screens support create only, matching the available POST endpoints.

These fallbacks are intentionally isolated so they can be replaced in `src/services/endpoints.ts` when dedicated backend routes are added.
