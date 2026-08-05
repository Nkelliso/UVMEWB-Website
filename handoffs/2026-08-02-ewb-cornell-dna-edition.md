# Session Handoff — EWB site: Cornell-DNA design edition at /cornell

_Saved: 2026-08-02_

## Where it started
User ran `/hallmark study https://www.ewbcornell.org/`. Squarespace hid the type/color, so they supplied four screenshots; I extracted the design DNA and they chose to build with it, lock a design.md, and create a *second version* of their existing EWB site (`C:\Users\Nater\ewb-website`) without overwriting the current one. Key override: keep the UVM green/gold identity (dark green as main, gold secondary) but take Cornell's structure/type voice. User also asked for a reusable prompt to run the same flow on two more sites.

## Decisions locked + what shipped
- New design edition at route `/cornell`, coexisting with UVM site at `/` — follows the project's existing `/immersive` + `/stevens` convention (parallel route trees).
- Scoped theme, not a rewrite: `C:\Users\Nater\ewb-website\app\cornell-theme.css` — `.theme-cornell` re-points type tokens to Poppins + adds Cornell signatures (gradient headline, scroll-darkening solid-dark nav, statement band, minimal 3-zone footer). Colour tokens inherited unchanged from globals.css.
- Bespoke chrome/hero in `C:\Users\Nater\ewb-website\components\cornell\` — CornellHeader (transparent→solid on scroll, hamburger <760px), CornellHero (parallax photo, gradient headline, right-offset "at UVM"), CornellStatement (green pill CTA), CornellFooter (3-zone, real social links only).
- Route tree `C:\Users\Nater\ewb-website\app\cornell\` — layout (loads Poppins via next/font, wires `/cornell`-prefixed nav) + home + 7 interior pages. Interior pages are thin duplicates reusing shared components + live CMS data (deviated from approved plan's shared-body refactor to keep `(site)` files 100% untouched — safer, same result).
- Additive-only edit to existing code: `buildNav(projects, prefix="")` gained optional prefix arg — `C:\Users\Nater\ewb-website\lib\pages.ts`. No other existing files changed.
- Portable DNA locked: `C:\Users\Nater\ewb-website\cornell-design.md` + `C:\Users\Nater\ewb-website\tokens.cornell.css` (provenance: public reference for user's brand; azure-blue source accent deliberately dropped).
- Build verified: `npm run build` passes TypeScript, all `/cornell/*` routes prerender. Running server serves `/cornell` → 200 with Cornell markup.

## Key files for next session
- Plan file: `C:\Users\Nater\.claude\plans\study-https-www-ewbcornell-org-resilient-rain.md` — the approved plan + DNA read; read first.
- `C:\Users\Nater\ewb-website\app\cornell-theme.css` — where the entire Cornell look lives.
- `C:\Users\Nater\ewb-website\app\cornell\layout.tsx` — how Poppins + theme scope + prefixed nav are wired; the template for any future edition.
- `C:\Users\Nater\ewb-website\lib\pages.ts` — `buildNav(projects, prefix)` is how a new route tree reuses the nav.
- `C:\Users\Nater\ewb-website\cornell-design.md` — the locked DNA spec.
- Memory touched: `C:\Users\Nater\.claude\projects\c--Users-Nater-Ideas\memory\project-ewb-website.md` (new) + `...\memory\MEMORY.md` (index line added).

## Running state
- Background processes: shell `bli0u1175` (my `npm run dev` attempt) FAILED immediately (EADDRINUSE port 3001) — not running, nothing to kill.
- Dev servers / ports: a Next dev server is live on port 3001, started OUTSIDE this session (no shell ID). To find/kill on Windows: `netstat -ano | findstr :3001` then `taskkill /PID <pid> /F`. It hot-reloads, so it already serves `/cornell`.
- Open worktrees / branches: none.

## Verification — how to confirm things still work
- `cd C:\Users\Nater\ewb-website && npm run build` — compiles clean, `/cornell/*` routes prerender.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/cornell` — expect `200`.
- Browser: `localhost:3001/` (UVM unchanged) vs `localhost:3001/cornell` (Poppins + green/gold, dark scroll nav). Eyeball hero-scrim contrast and mobile hamburger at 320px — not pixel-verified this session.

## Deferred + open questions
- Open: user wants the same study→build→design.md flow on TWO more websites but has not given the URLs. A fill-in-the-blank reusable prompt was provided in chat (starts `/hallmark study <PASTE_URL_HERE>`, uses a `<ROUTE_NAME>` segment). Next agent should get the two URLs + desired route names, and confirm whether each keeps UVM green/gold or adopts the source's colors.
- Deferred: no hero image set in CMS shows a "replace via /admin" placeholder — set `heroImages[0]` at `/admin` to show a real photo (affects both editions).
- Deferred: visual/pixel QA of `/cornell` (hero contrast, 320px nav) — build + HTTP verified only.

## Pick up here
Get the two other reference URLs (+ route names + color choice) from the user and run the reusable prompt to build `/site2` and `/site3` editions the same way `/cornell` was built.
