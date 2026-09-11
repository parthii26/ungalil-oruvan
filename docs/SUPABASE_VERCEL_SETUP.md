# Supabase & Vercel Setup Guide — Ungalil Oruvan

This guide walks you through connecting **Supabase** (database & storage) and deploying to **Vercel**.

---

## 1. Supabase Setup

### A. Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project (or select an existing one).
2. Wait for the database to finish provisioning.

### B. Run Database Schema & Seed
1. In the Supabase Dashboard, open the **SQL Editor** (`/project/<project-id>/sql`).
2. **Step 1 — Schema**:
   - Copy the entire contents of [`supabase/migrations/0001_stage1_schema.sql`](file:///c:/Users/pchandrayan/Documents/antigravity/cool-meitner/ungalil-oruvan/supabase/migrations/0001_stage1_schema.sql).
   - Paste it into the SQL Editor and click **Run**.
   - This creates all tables (`categories`, `products`, `product_variants`, `dietary_tags`, `coupons`, `orders`, `profiles`, etc.), indexes, security-definer functions (`is_admin()`), and Row Level Security (RLS) policies.
3. **Step 2 — Seed Data**:
   - Copy the entire contents of [`supabase/seed.sql`](file:///c:/Users/pchandrayan/Documents/antigravity/cool-meitner/ungalil-oruvan/supabase/seed.sql).
   - Paste it into the SQL Editor and click **Run**.
   - This populates the catalog with all 13 organic products, variants, dietary tags, nutrition info, coupons (`WELCOME10`, `FLAT100`), and store settings.

### C. Create Storage Buckets
The seed script will attempt to create them, but you can verify them in **Storage** (`/project/<project-id>/storage/buckets`):
- `product-images` (Public: **Yes**)
- `marketing` (Public: **Yes**)
- `private-docs` (Public: **No**)

### D. Get Project API Keys
Go to **Project Settings** -> **API**:
- **Project URL**: e.g., `https://xyzcompany.supabase.co`
- **Project API Keys**:
  - `anon` `public`: Public anonymous key
  - `service_role` `secret`: Secret service role key (keep safe!)

Add these to your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

You can now run the automated database seed anytime:
```bash
npm run db:seed
```

---

## 2. Vercel Deployment

### Option A: Via GitHub (Recommended)
1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "feat: configure Supabase and Vercel"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository: **`parthii26/ungalil-oruvan`**.
4. In **Configure Project**:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Environment Variables**:
     | Variable Name | Value / Description |
     |---|---|
     | `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |
     | `AUTH_SECRET` | A long random secret (>= 32 chars) |
     | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
     | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Public Anon Key |
     | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Secret Service Role Key |
5. Click **Deploy**.

### Option B: Via Vercel CLI
1. Log in to Vercel:
   ```bash
   npx vercel login
   ```
2. Deploy preview:
   ```bash
   npm run deploy
   ```
3. Deploy to production:
   ```bash
   npm run deploy:prod
   ```

---

## 3. Verifying the Deployment
- Check the health check endpoint: `https://your-project.vercel.app/api/health`
- When Supabase is configured, it will report:
  ```json
  {
    "ok": true,
    "stage": 1,
    "store": "supabase",
    "time": "..."
  }
  ```
