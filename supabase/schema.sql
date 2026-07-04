-- ============================================================================
-- GUNDI ENGROS AS — Database schema for Supabase (Postgres)
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES  (one row per auth.users, extra B2B customer info + role)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_name text not null,
  org_number text,                     -- Norwegian org.nr
  contact_person text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  approved boolean not null default false,  -- admin must approve new B2B customers
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile (not role/approved)"
  on public.profiles for update
  using (auth.uid() = id);

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- SECURITY: the "update own profile" policy above only restricts *which rows*
-- a user may update (their own), not *which columns*. Without this trigger,
-- any authenticated customer could PATCH their own row and set
-- role='admin', approved=true — granting themselves admin access and
-- bypassing the manual approval step entirely. This trigger forcibly
-- pins role/approved back to their existing values unless the actor
-- performing the update is already an admin.
--
-- auth.uid() is null when a query runs outside PostgREST's authenticated
-- context (e.g. the Supabase SQL Editor, migrations, service_role) — that
-- is trusted project-owner access, so it is deliberately exempted here.
-- Only authenticated-but-non-admin app requests get clamped.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.approved := old.approved;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_role_escalation();

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, company_name, org_number, contact_person, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    new.raw_user_meta_data->>'org_number',
    new.raw_user_meta_data->>'contact_person',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. CATEGORIES
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

alter table public.categories enable row level security;

create policy "Anyone can read categories"
  on public.categories for select
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. PRODUCTS
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  sku text unique,
  description text,
  unit text not null default 'stk',            -- 'kg', 'stk', 'kolli', 'sekk', 'liter'
  package_size text,                            -- e.g. "18 kg sekk", "10 x 1 L"
  price_ex_vat numeric(10, 2) not null default 0,
  vat_rate numeric(4, 2) not null default 15,   -- Norway: 15% on næringsmidler
  stock_status text not null default 'på_lager'
    check (stock_status in ('på_lager', 'lav_beholdning', 'utsolgt')),
  image_url text,
  active boolean not null default true,
  min_order_qty int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);

alter table public.products enable row level security;

create policy "Anyone can read active products"
  on public.products for select
  using (active = true);

create policy "Admins can read all products"
  on public.products for select
  using (public.is_admin());

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. ORDERS + ORDER_ITEMS
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'mottatt'
    check (status in ('mottatt', 'bekreftet', 'under_pakking', 'sendt', 'levert', 'kansellert')),
  total_amount numeric(10, 2) not null default 0,
  note text,
  delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,       -- snapshot at time of order
  package_size text,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Customers can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Customers can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update all orders"
  on public.orders for update
  using (public.is_admin());

create policy "Customers can read own order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "Customers can insert own order items"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "Admins can read all order items"
  on public.order_items for select
  using (public.is_admin());

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. SEED DATA (example categories + products — replace with your real catalog)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, sort_order) values
  ('Mel og bakevarer', 'mel-og-bakevarer', 1),
  ('Olje og fett', 'olje-og-fett', 2),
  ('Emballasje', 'emballasje', 3),
  ('Frysevarer', 'frysevarer', 4),
  ('Kjøttprodukter', 'kjottprodukter', 5),
  ('Meieri', 'meieri', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 6. HOW TO CREATE YOUR FIRST ADMIN USER
-- ---------------------------------------------------------------------------
-- 1. Sign up normally through /logg-inn (or Supabase Dashboard -> Authentication -> Add user)
-- 2. Then run:
--    update public.profiles set role = 'admin', approved = true where id = '<the user uuid>';
