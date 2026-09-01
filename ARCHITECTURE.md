# Ungalil Oruvan architecture (Stage 1)

```
UI (App Router)
  → Server Actions / Route Handlers
    → Services (business rules)
      → Repositories (data access)
        → Local file store  OR  Supabase (when env is set)
```

## Money

All amounts are integer **paise**. `lib/money.ts` rejects floats.

## Auth

- Local mode: scrypt password hashes + httpOnly JWT (`vz_session`).
- Hosted: wire `lib/supabase/*` and keep the same session shape.
- Role lives on `profiles` / `admin_users`. Registration always creates `customer`.
- `is_admin()` is a security-definer SQL function for RLS.

## Cart

Stores `variant_id` + `quantity` only. Guest cart keyed by `vz_cart` cookie. Login merges quantities and never duplicates variants.

## Checkout boundary

`CheckoutService` snapshots catalogue prices, writes `orders` + `order_items` + `order_events`, status `pending_payment`. Razorpay is not called.

## Stage 2 adapters

`PaymentsService`, `InventoryService`, `InvoiceService`, `ShipmentService`, `NotificationService`, `ReportService` compile and refuse live work.
