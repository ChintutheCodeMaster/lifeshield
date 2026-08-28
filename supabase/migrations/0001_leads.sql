create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid unique not null,
  motivation text[],
  who_to_protect text[],
  children_count int,
  state text,
  dob date,
  sex_at_birth text,
  tobacco text,
  health_level text,
  term_length int,
  coverage_amount int,
  first_name text,
  last_name text,
  phone text,
  email text,
  consent_at timestamptz,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_is_complete_idx on public.leads (is_complete);

-- Auto-update updated_at.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- RLS: block all client access; only service-role (server) can read/write.
alter table public.leads enable row level security;

-- Admin gating table.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read
  on public.admin_users for select
  using (auth.uid() = user_id);
