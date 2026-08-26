-- FarmSet database schema
-- Run against a Supabase project (SQL editor or `supabase db push`).
-- Supports: multiple farms per owner, multiple managers per farm,
-- and a manager assigned to more than one farm.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Farms
-- ---------------------------------------------------------------------------
create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- Many-to-many: a farm can have multiple owners, an owner can own multiple farms
create table if not exists public.farm_owners (
  farm_id uuid not null references public.farms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (farm_id, user_id)
);

-- Many-to-many: a farm can have multiple managers, a manager can be assigned
-- to multiple farms
create table if not exists public.farm_managers (
  farm_id uuid not null references public.farms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (farm_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Animals
-- ---------------------------------------------------------------------------
create type public.animal_status as enum ('healthy', 'sick', 'pregnant', 'dry');
create type public.animal_sex as enum ('female', 'male');

create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  tag text not null,
  name text not null,
  breed text not null,
  sex public.animal_sex not null default 'female',
  birth_date date,
  status public.animal_status not null default 'healthy',
  photo_url text,
  created_at timestamptz not null default now(),
  unique (farm_id, tag)
);

-- ---------------------------------------------------------------------------
-- Daily operations logs
-- ---------------------------------------------------------------------------
create table if not exists public.medicine_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  animal_id uuid not null references public.animals (id) on delete cascade,
  medicine text not null,
  dosage text,
  notes text,
  logged_by uuid not null references public.profiles (id),
  logged_at timestamptz not null default now()
);

create table if not exists public.milk_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  animal_id uuid references public.animals (id) on delete set null,
  litres numeric(6, 2) not null check (litres >= 0),
  session text not null check (session in ('morning', 'evening')),
  logged_by uuid not null references public.profiles (id),
  logged_at timestamptz not null default now()
);

create type public.task_status as enum ('pending', 'done');

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  title text not null,
  status public.task_status not null default 'pending',
  assigned_to uuid references public.profiles (id),
  due_date date,
  completed_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms (id) on delete cascade,
  type text not null check (type in ('sick-animal', 'overdue-task', 'daily-digest')),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Access-check helpers (security definer so RLS policies can call them)
-- ---------------------------------------------------------------------------
create or replace function public.is_farm_owner(target_farm_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.farm_owners
    where farm_id = target_farm_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_farm_manager(target_farm_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.farm_managers
    where farm_id = target_farm_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_farm_member(target_farm_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_farm_owner(target_farm_id) or public.is_farm_manager(target_farm_id);
$$;

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_owners enable row level security;
alter table public.farm_managers enable row level security;
alter table public.animals enable row level security;
alter table public.medicine_logs enable row level security;
alter table public.milk_logs enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;

-- profiles: a user can read their own profile and profiles of people who
-- share a farm with them; can only update their own
create policy "profiles: read own or farm co-members" on public.profiles
  for select using (
    id = auth.uid()
    or exists (
      select 1 from public.farm_owners fo1
      join public.farm_owners fo2 on fo1.farm_id = fo2.farm_id
      where fo1.user_id = auth.uid() and fo2.user_id = profiles.id
    )
    or exists (
      select 1 from public.farm_owners fo
      join public.farm_managers fm on fo.farm_id = fm.farm_id
      where fo.user_id = auth.uid() and fm.user_id = profiles.id
    )
    or exists (
      select 1 from public.farm_managers fm
      join public.farm_owners fo on fm.farm_id = fo.farm_id
      where fm.user_id = auth.uid() and fo.user_id = profiles.id
    )
  );

create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

create policy "profiles: insert own" on public.profiles
  for insert with check (id = auth.uid());

-- farms: visible to owners and managers of that farm
create policy "farms: members can read" on public.farms
  for select using (public.is_farm_member(id));

create policy "farms: owners can update" on public.farms
  for update using (public.is_farm_owner(id));

create policy "farms: authenticated users can create" on public.farms
  for insert with check (auth.uid() is not null);

-- farm_owners / farm_managers: members of a farm can see its roster;
-- only owners can manage who's on it
create policy "farm_owners: members can read" on public.farm_owners
  for select using (public.is_farm_member(farm_id));

create policy "farm_owners: owners manage roster" on public.farm_owners
  for all using (public.is_farm_owner(farm_id))
  with check (public.is_farm_owner(farm_id));

create policy "farm_managers: members can read" on public.farm_managers
  for select using (public.is_farm_member(farm_id));

create policy "farm_managers: owners manage roster" on public.farm_managers
  for all using (public.is_farm_owner(farm_id))
  with check (public.is_farm_owner(farm_id));

-- animals: members read; owners + managers can write
create policy "animals: members can read" on public.animals
  for select using (public.is_farm_member(farm_id));

create policy "animals: members can write" on public.animals
  for all using (public.is_farm_member(farm_id))
  with check (public.is_farm_member(farm_id));

-- logs: members read; owners + managers can write (managers log from the field)
create policy "medicine_logs: members can read" on public.medicine_logs
  for select using (public.is_farm_member(farm_id));

create policy "medicine_logs: members can write" on public.medicine_logs
  for all using (public.is_farm_member(farm_id))
  with check (public.is_farm_member(farm_id));

create policy "milk_logs: members can read" on public.milk_logs
  for select using (public.is_farm_member(farm_id));

create policy "milk_logs: members can write" on public.milk_logs
  for all using (public.is_farm_member(farm_id))
  with check (public.is_farm_member(farm_id));

create policy "tasks: members can read" on public.tasks
  for select using (public.is_farm_member(farm_id));

create policy "tasks: members can write" on public.tasks
  for all using (public.is_farm_member(farm_id))
  with check (public.is_farm_member(farm_id));

create policy "notifications: members can read" on public.notifications
  for select using (public.is_farm_member(farm_id));

create policy "notifications: members can write" on public.notifications
  for all using (public.is_farm_member(farm_id))
  with check (public.is_farm_member(farm_id));
