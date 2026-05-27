-- Klarify book commerce: products, orders, purchases, secure library
-- Table prefix: book_

-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase Auth users)
-- ---------------------------------------------------------------------------
create table if not exists public.book_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists book_profiles_email_idx on public.book_profiles (email);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.book_products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price_ngn_kobo integer not null check (price_ngn_kobo > 0),
  cover_image text,
  flipbook_path text,
  preview_max_page integer not null default 20,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists book_products_slug_idx on public.book_products (slug);
create index if not exists book_products_active_idx on public.book_products (active);

-- Downloadable assets (PDF, ZIP with Mac .app + Windows .EXE, etc.)
create table if not exists public.book_product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.book_products (id) on delete cascade,
  asset_type text not null check (asset_type in ('pdf', 'zip', 'epub')),
  label text not null,
  storage_path text not null,
  file_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, asset_type)
);

create index if not exists book_product_assets_product_idx
  on public.book_product_assets (product_id);

-- ---------------------------------------------------------------------------
-- Orders & purchases
-- ---------------------------------------------------------------------------
create table if not exists public.book_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  product_id uuid not null references public.book_products (id),
  customer_email text not null,
  customer_name text,
  payment_reference text not null unique,
  korapay_reference text,
  amount_ngn_kobo integer not null,
  currency text not null default 'NGN',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  payment_verified boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists book_orders_user_idx on public.book_orders (user_id);
create index if not exists book_orders_email_idx on public.book_orders (customer_email);
create index if not exists book_orders_status_idx on public.book_orders (status);
create index if not exists book_orders_payment_ref_idx on public.book_orders (payment_reference);

create table if not exists public.book_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.book_products (id),
  order_id uuid not null unique references public.book_orders (id) on delete cascade,
  download_count integer not null default 0,
  last_downloaded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists book_purchases_user_idx on public.book_purchases (user_id);
create index if not exists book_purchases_product_idx on public.book_purchases (product_id);

-- ---------------------------------------------------------------------------
-- Audit tables
-- ---------------------------------------------------------------------------
create table if not exists public.book_download_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.book_products (id),
  asset_id uuid references public.book_product_assets (id) on delete set null,
  ip_address text,
  user_agent text,
  downloaded_at timestamptz not null default now()
);

create index if not exists book_download_logs_user_idx on public.book_download_logs (user_id);
create index if not exists book_download_logs_product_idx on public.book_download_logs (product_id);

create table if not exists public.book_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'korapay',
  event_type text,
  payment_reference text,
  payload jsonb not null,
  status text not null default 'received'
    check (status in ('received', 'processed', 'ignored', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists book_webhook_events_ref_idx
  on public.book_webhook_events (payment_reference);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.book_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists book_profiles_updated_at on public.book_profiles;
create trigger book_profiles_updated_at
  before update on public.book_profiles
  for each row execute function public.book_set_updated_at();

drop trigger if exists book_products_updated_at on public.book_products;
create trigger book_products_updated_at
  before update on public.book_products
  for each row execute function public.book_set_updated_at();

drop trigger if exists book_orders_updated_at on public.book_orders;
create trigger book_orders_updated_at
  before update on public.book_orders
  for each row execute function public.book_set_updated_at();

-- Auto-create profile on auth signup
create or replace function public.book_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.book_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.book_profiles.full_name);
  return new;
end;
$$;

drop trigger if exists book_on_auth_user_created on auth.users;
create trigger book_on_auth_user_created
  after insert on auth.users
  for each row execute function public.book_handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.book_profiles enable row level security;
alter table public.book_products enable row level security;
alter table public.book_product_assets enable row level security;
alter table public.book_orders enable row level security;
alter table public.book_purchases enable row level security;
alter table public.book_download_logs enable row level security;
alter table public.book_webhook_events enable row level security;

-- Products: public catalog read
create policy book_products_public_read on public.book_products
  for select using (active = true);

-- Assets: no direct client access (downloads via signed URLs from API)
create policy book_product_assets_deny_all on public.book_product_assets
  for select using (false);

-- Profiles: own row only
create policy book_profiles_select_own on public.book_profiles
  for select using (auth.uid() = id);

create policy book_profiles_update_own on public.book_profiles
  for update using (auth.uid() = id);

-- Orders: own orders by user_id or matching email
create policy book_orders_select_own on public.book_orders
  for select using (
    auth.uid() = user_id
    or lower(customer_email) = lower(auth.jwt()->>'email')
  );

-- Purchases: own library only
create policy book_purchases_select_own on public.book_purchases
  for select using (auth.uid() = user_id);

-- Download logs & webhooks: service role only (no client policies)

-- ---------------------------------------------------------------------------
-- Seed products (update prices and storage paths before go-live)
-- Storage bucket: klarify-library (private — create in Supabase dashboard)
-- ---------------------------------------------------------------------------
insert into public.book_products (
  title,
  slug,
  description,
  price_ngn_kobo,
  cover_image,
  flipbook_path,
  preview_max_page,
  active
) values
  (
    'The Founder''s Guide to Building in Regulated Markets',
    'founders-guide',
    'A practical guide for founders navigating blockchain, fintech, and digital assets in African regulated markets.',
    2500000,
    '/images/mockup-book.png',
    '/founders/',
    20,
    true
  ),
  (
    'Seizing Opportunities in the Digital Asset Economy',
    'seizing-opportunities',
    'A comprehensive guide to opportunities across the digital asset economy.',
    2500000,
    '/images/mockup-book.png',
    '/opportunities/',
    20,
    true
  )
on conflict (slug) do nothing;

insert into public.book_product_assets (product_id, asset_type, label, storage_path, file_name, sort_order)
select p.id, v.asset_type, v.label, v.storage_path, v.file_name, v.sort_order
from public.book_products p
cross join (
  values
    ('pdf', 'PDF', 'books/founders-guide/founders-guide.pdf', 'founders-guide.pdf', 1),
    ('zip', 'Full Pack (Mac .app + Windows .EXE)', 'books/founders-guide/founders-guide-pack.zip', 'founders-guide-pack.zip', 2)
) as v(asset_type, label, storage_path, file_name, sort_order)
where p.slug = 'founders-guide'
on conflict (product_id, asset_type) do nothing;

insert into public.book_product_assets (product_id, asset_type, label, storage_path, file_name, sort_order)
select p.id, v.asset_type, v.label, v.storage_path, v.file_name, v.sort_order
from public.book_products p
cross join (
  values
    ('pdf', 'PDF', 'books/seizing-opportunities/seizing-opportunities.pdf', 'seizing-opportunities.pdf', 1),
    ('zip', 'Full Pack (Mac .app + Windows .EXE)', 'books/seizing-opportunities/seizing-opportunities-pack.zip', 'seizing-opportunities-pack.zip', 2)
) as v(asset_type, label, storage_path, file_name, sort_order)
where p.slug = 'seizing-opportunities'
on conflict (product_id, asset_type) do nothing;

comment on table public.book_products is 'Digital book catalog for book.klarify.africa commerce.';
comment on table public.book_product_assets is 'Private storage paths for PDF/ZIP downloads in klarify-library bucket.';
comment on table public.book_orders is 'Korapay checkout orders (NGN only).';
comment on table public.book_purchases is 'Entitlements granting library access after verified payment.';
