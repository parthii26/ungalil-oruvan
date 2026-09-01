# Stage 1 build report

## 1. Architecture
Next.js 16 App Router + TypeScript + Tailwind. UI → Server Actions / Route Handlers → Services → Repositories → local JSON store (or Supabase when env is set). Money is integer paise.

## 2. Routes
Storefront: `/` `/shop` `/category/[slug]` `/product/[slug]` `/cart` `/checkout` `/order/success` `/order/track` `/about` `/contact` `/faq` `/blog` `/blog/[slug]` `/policies/[slug]`
Account: `/account` orders wishlist addresses profile invoices reviews
Admin: dashboard products (CRUD) categories customers orders inventory batches reports settings
Auth: login register otp forgot-password callback
API: `/api/health` `/api/search` `/api/webhooks/razorpay` `/api/cron/outbox`

## 3. Database tables
profiles customers admin_users addresses categories products product_variants product_images product_certifications product_nutrition dietary_tags product_dietary_tags carts cart_items wishlists wishlist_items coupons coupon_redemptions orders order_items order_events webhook_events site_settings + Stage 2: batches suppliers inventory_* payments refunds invoices shipments reviews blog_posts faqs pages outbox_events notifications notification_deliveries

SQL: `supabase/migrations/0001_stage1_schema.sql` (RLS + `is_admin()`).

## 4. Services
Implemented: Catalog Cart Pricing Coupon Checkout Order Settings Auth Reviews
Stage 2 stubs: Payments Inventory Invoice Shipment Notification Report

## 5. Authentication
Email/password. Registration always creates `customer`. Admin is seeded. JWT httpOnly cookie. Phone OTP route is a placeholder.

## 6. RLS
Policies in the migration. Local preview enforces isolation in services (customer A cannot read B’s order).

## 7. Storage
Local `/public/uploads` + `/public/images`. Buckets documented for Supabase (`product-images`, `marketing`, `private-docs`).

## 8. Admin modules
Dashboard (real Stage 1 counts; Stage 2 KPIs marked not configured), products, variants, images, categories, customers, orders (cancel pending), settings.

## 9. Customer modules
Account, orders, wishlist, addresses, profile. Invoices/reviews marked not configured.

## 10. Tests
Vitest: money, pricing, coupons, empty cart, merge, idempotency, draft hidden, A≠B, no self-admin. `npm test` — 14 passing.

## 11. Environment
`NEXT_PUBLIC_SITE_URL` `AUTH_SECRET` optional Supabase keys. See `.env.example`.

## 12. Local run
`npm install && npm run dev`

## 13. Production build
`npm run build && npm start`

## 14. Remaining Stage 1 notes
- Hosted Supabase is not attached in this preview (no project URL). File store is the development database.
- Playwright e2e not run in CI (unit coverage for the mandatory rules).
- Password-reset email needs Supabase Auth.
- Jaggery product image reuses honey photography (image quota).

## 15. Stage 2 deferred
Razorpay capture, inventory/FEFO, invoice PDF, shipping, WhatsApp, Resend, GST/COD, subscriptions, courier APIs, advanced analytics.
