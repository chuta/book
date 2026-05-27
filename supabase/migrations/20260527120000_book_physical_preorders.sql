-- Physical book pre-orders (paid via Korapay, Nigeria delivery only)

create table if not exists public.book_physical_preorders (
  id uuid primary key default gen_random_uuid(),
  payment_reference text not null unique,
  korapay_reference text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  book_slug text not null,
  book_title text not null,
  format text not null check (format in ('hardback', 'softback')),
  quantity integer not null check (quantity >= 1),
  unit_price_ngn_kobo integer not null check (unit_price_ngn_kobo > 0),
  shipping_ngn_kobo integer not null check (shipping_ngn_kobo > 0),
  total_ngn_kobo integer not null check (total_ngn_kobo > 0),
  street_address text not null,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  fulfillment_status text not null default 'pending'
    check (fulfillment_status in ('pending', 'processing', 'shipped', 'delivered')),
  payment_verified boolean not null default false,
  admin_notified boolean not null default false,
  confirmation_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists book_physical_preorders_payment_ref_idx
  on public.book_physical_preorders (payment_reference);

create index if not exists book_physical_preorders_email_idx
  on public.book_physical_preorders (customer_email);

create index if not exists book_physical_preorders_payment_status_idx
  on public.book_physical_preorders (payment_status);

create index if not exists book_physical_preorders_fulfillment_status_idx
  on public.book_physical_preorders (fulfillment_status);

create index if not exists book_physical_preorders_created_at_idx
  on public.book_physical_preorders (created_at desc);

drop trigger if exists book_physical_preorders_updated_at on public.book_physical_preorders;
create trigger book_physical_preorders_updated_at
  before update on public.book_physical_preorders
  for each row execute function public.book_set_updated_at();

alter table public.book_physical_preorders enable row level security;

-- No public client access; API uses service role
create policy book_physical_preorders_deny_all on public.book_physical_preorders
  for select using (false);

comment on table public.book_physical_preorders is
  'Paid physical book pre-orders with Nigeria shipping — book.klarify.africa';
