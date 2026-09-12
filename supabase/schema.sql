-- EWB-UVM website — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL → New query).
-- After running, paste your Project URL + anon key + service_role key into
-- .env.local (see .env.example). Until then the site runs on local JSON files.

-- ── Content (one row per editable collection / page) ───────────────────────
create table if not exists public.content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ── Contact form submissions ───────────────────────────────────────────────
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.content enable row level security;
alter table public.contact_submissions enable row level security;

-- Public site reads content with the anon key.
drop policy if exists "content public read" on public.content;
create policy "content public read"
  on public.content for select
  to anon
  using (true);

-- Anyone can submit the contact form (insert only, no read).
drop policy if exists "contact public insert" on public.contact_submissions;
create policy "contact public insert"
  on public.contact_submissions for insert
  to anon
  with check (true);

-- NOTE: all writes to `content` and all reads of `contact_submissions` happen
-- server-side with the service_role key, which bypasses RLS. No admin write
-- policies are needed here — the app gates writes behind the /admin password.

-- ── Storage: the `photos` bucket ───────────────────────────────────────────
-- Uploads go through the service_role key server-side (bypasses RLS), but the
-- /admin photo picker LISTS the bucket with the anon key, so anon needs select
-- on objects here. Public = true so getPublicUrl() links resolve for visitors.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "photos public read" on storage.objects;
create policy "photos public read"
  on storage.objects for select
  to anon
  using (bucket_id = 'photos');

-- ── No seed content on purpose ─────────────────────────────────────────────
-- Do NOT insert a `settings` row here. lib/store.ts falls back to lib/seed.ts
-- whenever a key is missing, so an empty database renders the current site
-- correctly. A seed row written here would be a SECOND copy of the site copy
-- that silently overrides seed.ts and goes stale the moment seed.ts changes —
-- which is exactly what the old version of this file did. The first save from
-- /admin creates the row with real values.
