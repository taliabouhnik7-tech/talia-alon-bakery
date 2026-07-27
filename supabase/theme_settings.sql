-- ============================================================
-- Talia Alon Bakery — theme_settings table
-- Live theme editor: stores design tokens as key/value pairs.
-- Run this once in your Supabase SQL editor (after schema.sql).
-- Safe to re-run.
-- ============================================================

create table if not exists public.theme_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every change (reuses set_updated_at from schema.sql).
drop trigger if exists theme_settings_set_updated_at on public.theme_settings;
create trigger theme_settings_set_updated_at
  before update on public.theme_settings
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
-- Everyone can READ the theme (the public site needs it at runtime);
-- only authenticated users (admins) can change it.
alter table public.theme_settings enable row level security;

drop policy if exists "theme read" on public.theme_settings;
create policy "theme read" on public.theme_settings
  for select using (true);

drop policy if exists "theme write" on public.theme_settings;
create policy "theme write" on public.theme_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
