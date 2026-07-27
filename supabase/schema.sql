-- ============================================================
-- Talia Alon Bakery — Supabase schema
-- Run this once in your Supabase SQL editor.
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  description text,
  package_info text,
  price numeric(10,2),
  image_url text,
  sort_order int not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  notes text,
  items jsonb not null,
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id bigserial primary key,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views(created_at);

create table if not exists public.product_add_events (
  id bigserial primary key,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Live theme editor: design tokens stored as key/value pairs.
create table if not exists public.theme_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------

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
  for each row execute function public.set_updated_at();

drop trigger if exists theme_settings_set_updated_at on public.theme_settings;
create trigger theme_settings_set_updated_at
  before update on public.theme_settings
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
-- Public visitors can READ categories/products, and INSERT into orders/page_views/product_add_events.
-- Only authenticated users (admins) can modify the catalog or read the analytics/orders tables.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.page_views enable row level security;
alter table public.product_add_events enable row level security;
alter table public.theme_settings enable row level security;

-- Categories: everyone can read; only authenticated can modify
drop policy if exists "categories read" on public.categories;
create policy "categories read" on public.categories
  for select using (true);

drop policy if exists "categories write" on public.categories;
create policy "categories write" on public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Products: everyone can read available items; only authenticated can modify
drop policy if exists "products read" on public.products;
create policy "products read" on public.products
  for select using (true);

drop policy if exists "products write" on public.products;
create policy "products write" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders: anyone can insert; only authenticated can read/update/delete
drop policy if exists "orders insert public" on public.orders;
create policy "orders insert public" on public.orders
  for insert with check (true);

drop policy if exists "orders read auth" on public.orders;
create policy "orders read auth" on public.orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "orders modify auth" on public.orders;
create policy "orders modify auth" on public.orders
  for update using (auth.role() = 'authenticated');

drop policy if exists "orders delete auth" on public.orders;
create policy "orders delete auth" on public.orders
  for delete using (auth.role() = 'authenticated');

-- Page views: anyone can insert; only authenticated can read
drop policy if exists "page_views insert public" on public.page_views;
create policy "page_views insert public" on public.page_views
  for insert with check (true);

drop policy if exists "page_views read auth" on public.page_views;
create policy "page_views read auth" on public.page_views
  for select using (auth.role() = 'authenticated');

-- Product add events: anyone can insert; only authenticated can read
drop policy if exists "product_add_events insert public" on public.product_add_events;
create policy "product_add_events insert public" on public.product_add_events
  for insert with check (true);

drop policy if exists "product_add_events read auth" on public.product_add_events;
create policy "product_add_events read auth" on public.product_add_events
  for select using (auth.role() = 'authenticated');

-- Theme settings: everyone can read (public site needs it); only authenticated can modify
drop policy if exists "theme read" on public.theme_settings;
create policy "theme read" on public.theme_settings
  for select using (true);

drop policy if exists "theme write" on public.theme_settings;
create policy "theme write" on public.theme_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Storage bucket for product images ----------
-- Create a public bucket named "product-images".
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

-- Anyone can read images; only authenticated users can upload/update/delete
drop policy if exists "product images read" on storage.objects;
create policy "product images read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images write" on storage.objects;
create policy "product images write" on storage.objects
  for all using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
