# EWB-UVM Website

The Engineers Without Borders — University of Vermont chapter website. Built to
be **edited by future officers without touching code**: content lives in a
database (Supabase) and is edited through a password-protected `/admin` area —
a drag-and-drop page builder plus simple forms for officers, projects, and
sponsors.

Design ported from the original Lovable concept
(github.com/Nkelliso/uvm-ewb-scroll-page) and restyled with a chapter identity
(UVM forest green + warm gold, Manrope/Nunito Sans). Same stack/pattern as the
"home-field" project.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + a hand-built design system (`app/globals.css`, `tokens.css`)
- **Puck** (`@measured/puck`) — drag-and-drop page builder
- **Supabase** (Postgres) — content persistence (optional in dev)

## Run it locally

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD; leave Supabase blank for now
npm run dev                  # http://localhost:3001
```

With Supabase left blank, all content reads from `lib/seed.ts` and **edits save
to JSON files under `/data`** — so the whole site and the editor work with zero
setup. Default admin password in `.env.local` is `ewbuvm2026`.

## Editing the site (`/admin`)

1. Go to `/login`, enter the admin password.
2. **Page layouts** → drag-and-drop builder (Puck) for the Home / About /
   Mission pages. Add sections, edit text, hit **Publish**.
3. **Chapter content** → forms for the **Officer Board**, **Projects**,
   **Sponsors**, and **Site Settings** (hero, tagline, contact email).

Hand the next webmaster the admin password — that's all they need.

## Going live (Supabase + deploy)

1. Create a free project at [supabase.com](https://supabase.com).
2. SQL editor → run `supabase/schema.sql`.
3. Project Settings → API → copy **Project URL**, **anon key**, **service_role
   key** into `.env.local` (and into your Vercel env vars):

   ```
   ADMIN_PASSWORD=...
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. Deploy to Vercel. With Supabase set, edits from `/admin` update the live site
   instantly. `/admin` shows a badge telling you whether you're in local-file or
   live-Supabase mode.

## Key files

| Path | What |
|------|------|
| `app/(site)/**` | Public pages |
| `app/admin/**` | Editing backend (Puck + forms) |
| `lib/store.ts` | Data access — Supabase, or JSON-file fallback |
| `lib/seed.ts` | Default content (ported from Lovable) |
| `lib/puck-config.tsx` | Drag-and-drop blocks |
| `lib/pages.ts` | Page registry + nav builder |
| `app/globals.css` | Design system (source of truth) |
| `supabase/schema.sql` | Database schema + RLS |
