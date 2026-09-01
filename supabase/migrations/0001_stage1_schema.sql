-- VariZel Organic Commerce Platform — Stage 1 schema
-- Apply on hosted or local Supabase. Local preview uses the file store until env is set.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    join public.profiles p on p.id = au.profile_id
    where p.id = auth.uid()
  );
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  notes text,
  created_at timestamptz not null default now()
);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  landmark text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_path text,
  position int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  name text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  ingredients text,
  origin text,
  storage_instructions text,
  shelf_life text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  hsn text,
  tax_rate_bps int not null default 0 check (tax_rate_bps >= 0),
  fssai_license text,
  seo_title text,
  seo_description text,
  search_text text not null default '',
  search_vector tsvector generated always as (to_tsvector('simple', coalesce(search_text, ''))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_search_idx on public.products using gin (search_vector);
create index products_status_idx on public.products (status);
create index products_category_idx on public.products (category_id);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  barcode text,
  title text not null,
  weight_grams int not null check (weight_grams > 0),
  price_paise int not null check (price_paise >= 0),
  compare_at_paise int check (compare_at_paise is null or compare_at_paise >= 0),
  cost_paise int check (cost_paise is null or cost_paise >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,
  alt text not null default '',
  position int not null default 0,
  is_thumbnail boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_certifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  number text,
  valid_from date,
  valid_until date,
  document_path text,
  created_at timestamptz not null default now()
);

create table public.product_nutrition (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products (id) on delete cascade,
  serving text not null,
  energy_kcal numeric,
  protein_g numeric,
  carbohydrates_g numeric,
  fat_g numeric,
  fiber_g numeric,
  sugar_g numeric,
  extra jsonb not null default '{}'::jsonb
);

create table public.dietary_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table public.product_dietary_tags (
  product_id uuid not null references public.products (id) on delete cascade,
  tag_id uuid not null references public.dietary_tags (id) on delete cascade,
  primary key (product_id, tag_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or session_id is not null)
);

create unique index carts_customer_uidx on public.carts (customer_id) where customer_id is not null;
create index carts_session_idx on public.carts (session_id);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  quantity int not null check (quantity > 0 and quantity <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  created_at timestamptz not null default now(),
  unique (wishlist_id, variant_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage', 'fixed')),
  value int not null check (value >= 0),
  min_subtotal_paise int not null default 0,
  max_discount_paise int,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  usage_limit int,
  per_customer_limit int,
  product_ids uuid[] not null default '{}',
  category_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons (id),
  customer_id uuid references public.customers (id),
  order_id uuid,
  created_at timestamptz not null default now()
);

create table public.document_sequences (
  name text primary key,
  value int not null default 0
);

insert into public.document_sequences (name, value) values ('orders', 0);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers (id),
  email text not null,
  status text not null check (status in (
    'pending_payment','cancelled','confirmed','processing','packed','shipped','out_for_delivery','delivered'
  )),
  coupon_code text,
  subtotal_paise int not null,
  discount_paise int not null,
  tax_paise int not null,
  shipping_paise int not null,
  grand_total_paise int not null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  notes text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index orders_idempotency_uidx on public.orders (customer_id, idempotency_key)
  where idempotency_key is not null;

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid,
  product_name text not null,
  variant_title text not null,
  sku text not null,
  quantity int not null,
  unit_price_paise int not null,
  discount_paise int not null default 0,
  tax_paise int not null default 0,
  line_total_paise int not null
);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Stage 2-ready structures
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants (id),
  supplier_id uuid references public.suppliers (id),
  lot_code text not null,
  manufactured_on date,
  expires_on date,
  created_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants (id),
  batch_id uuid references public.batches (id),
  qty int not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.inventory_balances (
  variant_id uuid primary key references public.product_variants (id),
  on_hand int not null default 0,
  reserved int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  provider text not null,
  provider_ref text,
  amount_paise int not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id),
  amount_paise int not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  number text not null unique,
  pdf_path text,
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  carrier text,
  tracking_number text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id),
  customer_id uuid not null references public.customers (id),
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  cover_path text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position int not null default 0,
  published boolean not null default false
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  published boolean not null default false
);

create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  template text not null,
  created_at timestamptz not null default now()
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications (id),
  status text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.admin_users enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_certifications enable row level security;
alter table public.product_nutrition enable row level security;
alter table public.dietary_tags enable row level security;
alter table public.product_dietary_tags enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.reviews enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;

create policy "public read published products" on public.products
  for select using (status = 'published' or public.is_admin());

create policy "public read active categories" on public.categories
  for select using (is_active or public.is_admin());

create policy "public read variants of published" on public.product_variants
  for select using (
    public.is_admin() or exists (
      select 1 from public.products p where p.id = product_id and p.status = 'published'
    )
  );

create policy "public read images" on public.product_images for select using (true);
create policy "public read nutrition" on public.product_nutrition for select using (true);
create policy "public read certs" on public.product_certifications for select using (true);
create policy "public read tags" on public.dietary_tags for select using (true);
create policy "public read pdt" on public.product_dietary_tags for select using (true);
create policy "public read published reviews" on public.reviews for select using (published or public.is_admin());
create policy "public read published posts" on public.blog_posts for select using (published or public.is_admin());
create policy "public read published faqs" on public.faqs for select using (published or public.is_admin());
create policy "public read published pages" on public.pages for select using (published or public.is_admin());
create policy "public read settings" on public.site_settings for select using (true);

create policy "own profile" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "own customer" on public.customers
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "own addresses" on public.addresses
  for all using (
    public.is_admin() or customer_id in (select id from public.customers where profile_id = auth.uid())
  )
  with check (
    public.is_admin() or customer_id in (select id from public.customers where profile_id = auth.uid())
  );

create policy "own orders" on public.orders
  for select using (
    public.is_admin() or customer_id in (select id from public.customers where profile_id = auth.uid())
  );

create policy "own order items" on public.order_items
  for select using (
    public.is_admin() or order_id in (
      select id from public.orders where customer_id in (select id from public.customers where profile_id = auth.uid())
    )
  );

create policy "admin write catalog" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage buckets (run in dashboard or via SQL if permitted)
-- insert into storage.buckets (id, name, public) values
--   ('product-images', 'product-images', true),
--   ('marketing', 'marketing', true),
--   ('private-docs', 'private-docs', false);
