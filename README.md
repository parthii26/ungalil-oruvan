# Ungalil Oruvan — Organic Commerce Platform (Stage 1)

Repository: [parthii26/ungalil-oruvan](https://github.com/parthii26/ungalil-oruvan)

Single-brand organic D2C store. Next.js 16 App Router, TypeScript, Tailwind, Zod, Framer-ready UI, Supabase-shaped schema.

When Supabase env vars are empty the app uses a **local file store** (`data/db.json`) so the preview runs without a cloud project. Connect Supabase without rewriting services.

## Development accounts (not real people)

| Role     | Email                 | Password       |
|----------|-----------------------|----------------|
| Admin    | admin@varizel.dev     | Admin123!Dev   |
| Customer | ananya@varizel.dev    | Customer123!   |
| Customer | kabir@varizel.dev     | Customer123!   |

Coupons: `WELCOME10` (10% over ₹500, max ₹200), `FLAT100` (₹100 over ₹799). `OLD50` is expired.

## Local run

```bash
cp .env.example .env.local   # AUTH_SECRET is required
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## Netlify

Connect the GitHub repo to Netlify (Next.js is auto-detected). Set:

- `AUTH_SECRET` — long random string
- `NEXT_PUBLIC_SITE_URL` — `https://your-site.netlify.app`
- `NODE_VERSION` — `20` (already in `netlify.toml`)

The catalog is seeded in memory on first request. Cart and admin writes on the free serverless filesystem are ephemeral until Supabase is connected.

## Production build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Environment

See `.env.example`. Service-role keys are server-only.

## Stage 2 (intentionally deferred)

Razorpay capture, inventory/FEFO, invoice PDF, shipping, WhatsApp, Resend, GST/COD, subscriptions, courier APIs.

Checkout **always** ends at `pending_payment`. The UI never claims payment succeeded.
