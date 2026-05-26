-- Book landing page: virtual event registrations
-- Table prefix: book_virtual_event_registration → book_virtual_event_registrations

create table if not exists public.book_virtual_event_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text,
  role text not null,
  country text not null,
  registration_type text not null
    check (registration_type in ('launch', 'klarify', 'book-updates')),
  admin_notified boolean not null default false,
  confirmation_sent boolean not null default false,
  resend_contact_synced boolean not null default false,
  follow_ups_scheduled text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint book_virtual_event_registrations_email_type_unique
    unique (email, registration_type)
);

create index if not exists book_virtual_event_registrations_created_at_idx
  on public.book_virtual_event_registrations (created_at desc);

create index if not exists book_virtual_event_registrations_type_idx
  on public.book_virtual_event_registrations (registration_type);

create index if not exists book_virtual_event_registrations_country_idx
  on public.book_virtual_event_registrations (country);

create or replace function public.book_virtual_event_registrations_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists book_virtual_event_registrations_updated_at
  on public.book_virtual_event_registrations;

create trigger book_virtual_event_registrations_updated_at
  before update on public.book_virtual_event_registrations
  for each row
  execute function public.book_virtual_event_registrations_set_updated_at();

alter table public.book_virtual_event_registrations enable row level security;

comment on table public.book_virtual_event_registrations is
  'Registrations from book.klarify.africa — virtual launch and related forms.';
