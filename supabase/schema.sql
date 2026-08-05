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

-- ── Seed content ────────────────────────────────────────────────────────────
-- Optional: the app already ships these exact defaults in lib/seed.ts and will
-- fall back to them when a key is missing, so seeding is not required. Insert
-- the settings row here if you want a row to exist immediately:
insert into public.content (key, value) values
  ('settings', '{
    "chapterName": "Engineers Without Borders",
    "tagline": "The University of Vermont student chapter — designing sustainable infrastructure alongside the communities we serve.",
    "contactEmail": "ewb@uvm.edu",
    "instagram": "",
    "heroHeading": "Engineering that listens first.",
    "heroSubline": "Student engineers, designers, and organizers at the University of Vermont, building lasting infrastructure with communities around the world.",
    "heroImages": []
  }'::jsonb)
on conflict (key) do nothing;
