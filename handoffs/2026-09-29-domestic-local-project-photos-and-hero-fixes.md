# Session Handoff — Domestic/local project photos, hero fixes, multi-session coordination

_Saved: 2026-09-29_

## Where it started
User sent a garbled voice note about adding photos to the EWB website's project pages (technical drawing into the "photo wheel," photos for the domestic/local volunteering project) and asked whether to hand photos to Claude directly or test the `/admin` upload backend. Ran it through `audio-ingest` first to disambiguate before touching anything.

## Decisions locked + what shipped
- **Catskills stormwater project** (`catskills-stormwater` in `lib/seed.ts`): moved the technical drawing (`catskills-cad.jpg`) from its own section into the gallery/carousel. Added two photos (domestic-team hero shot on a dumpster, farm/field shot) — **final state: farm photo is the header, people-on-dumpster photo is in the gallery** (user asked to swap them at the end of the session).
- **Local Volunteering project** (`local-volunteering`): added 5 HEIC photos (converted to JPEG via Pillow + pillow-heif, EXIF-rotated, resized). One (UVM awards-banner photo) was removed per user request. Final layout: hero photo + 3 photos placed into the **section photo boxes** (Overview / Fall 2025 projects / Spring 2026), not the carousel — user asked to move them out of the wheel into the boxes. This photo-to-section pairing was my judgment call, not confirmed by the user as correct.
- **`heroPosition` field added** to `lib/types.ts` (`Project.heroPosition?: string`) and wired into `app/(site)/projects/[slug]/page.tsx` (`backgroundPosition: project.heroPosition || "center"`). Set to `"center 38%"` on local-volunteering to stop the hero crop from cutting off the people (estimated from pixel inspection of the source photo, not visually confirmed by the user after the fix).
- **Bug fix**: `components/admin/AdminChrome.tsx`'s `ImageField` upload handler was silently swallowing upload errors (no UI feedback on failure — this is what made the backend "not work" from the user's perspective). Added error state + a visible red error message. **Note: this file changed on disk after I last read it** (likely ideas-27 building on it for the admin rework — re-read before touching).
- **CSS**: `app/globals.css` — `.proj-hero-title` changed from `text-wrap: balance` to `white-space: nowrap` with a lower `clamp()` minimum (fixes "location title" wrapping to two lines, e.g. "Greater Burlington Area"). `.proj-hero-scrim` changed from the site's brand-green hue (`oklch(_ _ 158)`) to neutral black/gray — removes a green tint that was washing over every project header photo. Both changes are global, affecting all project pages.
- **Gitignore catch (via peer session ideas-ae)**: `public/photos/uploads/` is gitignored (staging dump for the local `/admin` upload flow only). My 6 photos there would never have shipped. Recompressed all 6 to match the site's ~300–900KB convention and moved them into `public/photos/site/` (tracked), updating all `lib/seed.ts` references accordingly. Originals left in `uploads/`.
- Everything through the photo-move fix was **committed and pushed** by ideas-ae as `09065d8` on `master`. The final header/gallery photo swap on Catskills stormwater (done after that commit) is **not yet committed**.

## Key files for next session
- `C:\Users\Nater\ewb-website\lib\seed.ts` — all project content (photos, hero images, sections). Shared with ideas-ae/ideas-27 — re-read before editing, targeted replacements only.
- `C:\Users\Nater\ewb-website\lib\types.ts` — has the new `heroPosition` field. **Changed on disk since I last read it** — re-read first.
- `C:\Users\Nater\ewb-website\app\(site)\projects\[slug]\page.tsx` — hero rendering, `heroPosition` wiring. Shared file, coordinate before editing the hero section specifically.
- `C:\Users\Nater\ewb-website\components\admin\AdminChrome.tsx` — has the upload-error fix. **Changed on disk since I last read it**, and is now claimed by ideas-27 for an admin panel rework — don't edit without checking in.
- `C:\Users\Nater\ewb-website\app\globals.css` — `.proj-hero-title` and `.proj-hero-scrim` rules, global effect on all project headers.
- `C:\Users\Nater\ewb-website\public\photos\site\` — 6 new tracked photos (catskills-domestic-team-hero.jpg, catskills-domestic-team-field.jpg, local-volunteering-hero.jpg, local-volunteering-1.jpg, local-volunteering-3.jpg, local-volunteering-4.jpg).

## Running state
- Background processes: none started successfully by me this session (attempted `npm run dev`, got `EADDRINUSE` on port 3001 — a dev server was already running from an earlier/other session).
- Dev servers / ports: site is live at `http://localhost:3001` (already running, not started by this session — don't assume you own it).
- Open worktrees / branches: none opened by me; repo is on `master`, HEAD at `09065d8` (or later — check before assuming).
- **Multi-session coordination**: this repo was being edited concurrently by up to 5 Claude sessions this turn — `ideas-03` (this session), `ideas-ae`, `ideas-27`, `ideas-b2`, and `ideas-d2` (unaccounted, was "busy," never checked in). Current file claims as of end of session:
  - `ideas-27`: claimed `app/admin/**`, `components/admin/**` (incl. `AdminChrome.tsx`), new `lib/history.ts`, and a `supabase/schema.sql` addition, for an admin-panel rework — in progress, not yet "done".
  - `ideas-b2`: `sponsors/page.tsx`, `projects-header.jpg`.
  - Ownership of `lib/types.ts`, `lib/seed.ts`, `projects/[slug]/page.tsx`, and `.proj-*` CSS was ambiguous by end of session — ideas-27 believed these were ideas-ae's, but I (ideas-03) was the one actually editing them this session. Not fully reconciled with the other sessions before this handoff.

## Verification — how to confirm things still work
- Visit `http://localhost:3001/projects/catskills-stormwater` — farm photo should be the header, people-on-dumpster photo in the gallery, technical drawing also in gallery.
- Visit `http://localhost:3001/projects/local-volunteering` — hero photo shows the group centered (not cut off), no green tint on any project hero, title on one line, 3 section boxes have photos instead of a carousel.
- `git log --oneline -3` in `C:\Users\Nater\ewb-website` — should show `09065d8` plus anything since.
- `git status --short` — the Catskills header/gallery swap (last edit this session) should show as an uncommitted change to `lib/seed.ts` unless someone has since committed it.

## Deferred + open questions
- Open: is the local-volunteering photo-to-section pairing (cleanup→Overview, framing→Fall 2025, sanding→Spring 2026) actually correct? User hasn't confirmed.
- Open: does `heroPosition: "center 38%"` actually center the people well on the user's screen? Not visually confirmed after the fix.
- Open: the 5-concurrent-session sprawl was flagged to the user as worth consolidating; no response yet.
- Deferred: Catskills stormwater's individual sections (Background/Engineering/Our solution/Community ownership) still show "photo coming soon" placeholders — never asked to fill these, only local-volunteering's sections were.
- Unresolved: which session actually owns `lib/types.ts` / `lib/seed.ts` / `projects/[slug]/page.tsx` / `.proj-*` CSS going forward — ideas-27 and ideas-ae may still think ideas-ae owns files I've been the one editing.

## Pick up here
Re-read `lib/types.ts` and `components/admin/AdminChrome.tsx` (both flagged as changed on disk) before any further edits, confirm with the user whether the local-volunteering photo placement and hero centering look right on the live site, and hold off on `app/admin/**`, `components/admin/**`, `lib/history.ts`, and `supabase/schema.sql` until ideas-27 messages "done".

---

# Session Handoff — Sponsors page photos, brand-system audit, cross-session photo-crop coordination

_Saved: 2026-09-29 (session ideas-b2)_

## Where it started
User asked for a `/brand-system` audit of the EWB-UVM site, then asked to swap in two new photos (a kids-walking-a-road shot as the sponsors header, a misty-valley sunrise shot for the "Our work" page header) and fix the flat/hazy photo quality on the Sponsors page's "Corporate Partners" card. This ran concurrently with `ideas-ae`, `ideas-27`, and — unbeknownst until late in the session — `ideas-03` all editing the same repo, so much of this session was active file-ownership coordination via cross-session messages.

## Decisions locked + what shipped
- Brand-system audit (read-only, findings reported in chat only, not written to a file): logo mismatch (national EWB-USA blue/serif wordmark vs. the site's green/gold Montserrat identity, plus a second unrelated favicon mark), no positioning statement surfaced on the homepage, no semantic color tokens (form errors render in the brand gold accent — same token as hover states), and radius/shadow one-off values bypassing the token system in a couple of components.
- `app/(site)/sponsors/page.tsx`: hardcoded the header photo to `/photos/site/rwanda-schoolkids-road.jpg` (matches the existing "Our work" page's pattern of a hardcoded header). Added a typed `filter?: string` field to the `WAYS` array and applied CSS `filter` corrections to two sponsor-card photos: Corporate Partners (`giving.jpg`, flat/overcast) gets `saturate(1.3) contrast(1.12) brightness(1.08)`; Alumni & Friends (`cooper-uvm.jpg`, dusk) gets `saturate(1.12) brightness(1.1)`. Professional Mentors (`projects.jpg`) left untouched — already well-exposed. `tsc --noEmit` clean after the edit.
- Added `public/photos/site/rwanda-schoolkids-road.jpg` (new, user-supplied) and overwrote `public/photos/site/projects-header.jpg` (the "Our work" header) with a new user-supplied sunrise/misty-valley shot.
- **Crop investigation, then reverted.** No browser tool was connected this session, so instead of guessing, wrote a Python/Pillow script (`simulate_crop.py`, session scratchpad only, not in the repo) to simulate the actual `background-size:cover; background-position:center 22%` crop math against both photos. Confirmed visually that on typical desktop widths the fixed-band crop cut the subjects entirely (kids photo showed only sky/treetops; sunrise photo showed only clouds). Manually re-cropped both source images to compensate and shipped those. **`ideas-27` then shipped a better fix** — `PageShell`'s new `imageRatio` prop / a manual `is-fit` + `--head-ratio` CSS mechanism that sizes the header band to the photo's real aspect ratio instead of cropping — which made the manual crop wrong (mismatched aspect ratio would cause a new, sideways crop). **Reverted both photos back to the full uncropped 2048×1536 (4:3) originals** to match `imageRatio={4 / 3}` now used in `projects/page.tsx` and `--head-ratio: 4/3` in `sponsors/page.tsx`. Final state: both header photos are the true, uncropped originals, sized correctly for the new `is-fit` mechanism.
- Saved true uncropped originals to `public/photos/_originals/rwanda-schoolkids-road.jpg` and `public/photos/_originals/projects-header.jpg` (repo's existing convention) at `ideas-27`'s request, before cropping — now redundant with the live files since the crop was reverted, but kept per convention in case a future crop is wanted.
- Solved the `heroPosition` mystery from earlier in this document: it was `ideas-03` (confirmed by the handoff above, written by that session) — flagged to `ideas-ae` and `ideas-27` while it was still unresolved.
- Coordinated repeatedly with `ideas-ae` and `ideas-27` over cross-session messages; confirmed clear of `app/admin/**`, `components/admin/**`, `lib/history.ts`, `supabase/schema.sql`, `lib/seed.ts`, `PageShell.tsx`, `projects/page.tsx`, `contact/page.tsx`, `EmailSignupForm.tsx` — never touched any of them. `ideas-27` was, as of the last message in this session, making one more targeted edit to `sponsors/page.tsx` to wire the header image back to `settings.sectionImages?.sponsors` (falling back to `rwanda-schoolkids-road.jpg`) so the admin Photos screen can change it.

## Key files for next session
- `C:\Users\Nater\ewb-website\app\(site)\sponsors\page.tsx` — header image + `WAYS` filter changes from this session; `ideas-27` was mid-edit on this file as of the last message this session (wiring `settings.sectionImages?.sponsors`) — re-read first, it has likely changed again.
- `C:\Users\Nater\ewb-website\public\photos\site\rwanda-schoolkids-road.jpg` and `projects-header.jpg` — both currently the full uncropped 2048×1536 originals (crop was reverted; do not re-crop without checking the current `is-fit`/`imageRatio` setup first).
- `C:\Users\Nater\ewb-website\public\photos\_originals\rwanda-schoolkids-road.jpg` and `projects-header.jpg` — backups, currently byte-identical to the live site versions.
- `C:\Users\Nater\ewb-website\components\PageShell.tsx` and `app\(site)\projects\page.tsx` — not edited by me this session, but read; both use the `imageRatio`/`is-fit` mechanism the sponsors header now also depends on matching.

## Running state
- Background processes: none started by me.
- Dev servers / ports: `http://localhost:3001` already running (confirmed via `curl`, not started by me this session — don't assume ownership).
- Open worktrees / branches: none opened by me. Repo on `master`, HEAD at `09065d8` per `git log` this session; working tree has extensive uncommitted changes from multiple concurrent sessions, not just mine.
- No browser automation tool was available this session (built-in browser can't reach localhost; Claude-in-Chrome extension wasn't connected) — the rendered page was never checked visually, only via the crop-math simulation described above.

## Verification — how to confirm things still work
- `cd C:\Users\Nater\ewb-website && npx tsc --noEmit` — expect clean (confirmed this session after the `sponsors/page.tsx` edits).
- Visit `http://localhost:3001/sponsors` — header should show the kids-walking photo in full (via `is-fit`, no crop); Corporate Partners card photo should look noticeably less flat/hazy than the other two cards.
- Visit `http://localhost:3001/projects` ("Our work") — header should show the full misty-valley sunrise photo, no crop.
- `git status --short` — `app/(site)/sponsors/page.tsx`, `public/photos/site/rwanda-schoolkids-road.jpg`, and `public/photos/site/projects-header.jpg` should all show modified, uncommitted.

## Deferred + open questions
- Open: the pre-existing `projects-header.jpg` (whatever photo was there before this session touched it) was overwritten without an explicit backup — likely still recoverable via `git show 09065d8:public/photos/site/projects-header.jpg` (or whichever commit last touched it) since nothing has been committed over it yet, but this was never actually verified.
- Open: never visually confirmed the final rendered sponsors/projects headers in a real browser (no browser tool available this session) — the fix relies on `is-fit` matching the photos' real 4:3 ratio, which is correct by construction, but hasn't been eyeballed.
- Deferred: the brand-system audit findings (logo mismatch, missing positioning statement, missing semantic colors, UI-token one-offs) were reported in chat only — user hasn't said which, if any, to act on.
- Open: whether `ideas-27`'s in-flight edit wiring `sponsors/page.tsx`'s header to `settings.sectionImages?.sponsors` had landed by the time this was written — not confirmed.

## Pick up here
Re-read `app/(site)/sponsors/page.tsx` (ideas-27 may have just finished editing it) before touching it again. If the user wants any of the brand-system audit findings (logo, positioning, semantic colors) actually fixed, start there — none of it has been implemented yet.

---

# Session Handoff — Brand-system audit, quick wins, UVM green, headline-face preview

_Saved: 2026-09-29 (session ideas-d2)_

## Where it started
User asked for a `/brand-system` audit of the site (run separately from ideas-b2's audit above; this one measured the CSS and contrast). Then asked for the audit's quick wins plus a visual preview of the two open brand decisions (colours, display face). After the preview, picked **Oswald headlines** and **UVM green**, and was emphatic: **DON'T TOUCH THE HEADER FOR THE LANDING PAGE** (masthead/nav + home hero).

## Decisions locked + what shipped (all uncommitted)
- **Audit findings, reported in chat only.** Three greens in use (`#1e7c50` tokens, `#154734` hero "UVM", `#1f6b4a` favicon) and three golds (`#e9b452`, `#FFD100`, `#e6b23e`). No semantic colours. 44 distinct font-sizes, 5 font families. Chapter name written 6 different ways. Sponsorship PDF uses its own blue identity. Input borders were 1.32:1 (fails WCAG 1.4.11). The hero "UVM" in `#154734` measures 1.8:1 against the darkest overlay.
- **Preview artifact (private):** https://claude.ai/artifact/MbjqmqxgXmJ778AUaWxXpN. It mocks up the homepage with real photos and toggles between 3 colour sets (UVM official / current site / EWB-USA blue `#005cbc`, sampled from `public/logo.png`) and 3 headline faces (Montserrat / Oswald / Fraunces), with live contrast checks. Source is in the session scratchpad only.
- **UVM green**, `app/globals.css` `:root`:
  - `--green: oklch(35.9% 0.063 164.4)` (= `#154734`, UVM Catamount Green)
  - `--green-deep: oklch(28% 0.055 164.4)`
  - `.ewb-tag` background tint updated to the new green
  - Contrast: button text 9.7:1, hover 13.1:1, tag text 11:1, eyebrow on paper 13:1. Green vs green-deep is only 1.35:1, so the hover is subtle; the button lift and shadow carry it.
- **Oswald headlines:** I first added a site-wide `.theme-immersive :is(...)` rule at the end of globals.css and removed the Fraunces loader. Nater then asked, via ideas-ae, for **Oswald on the landing page only**. ideas-ae narrowed the rule (now "headline face: Oswald on the home page", ~line 2519) and restored the Fraunces loader in `app/(site)/layout.tsx`. Interior pages keep Montserrat titles, and the officer board keeps Fraunces.
- **Quick wins:**
  - New tokens `--field-border` (3.6:1 on paper; now used by `.ewb-input` / `.ewb-textarea`), `--danger: oklch(50% 0.17 27)` and `--success: var(--green)`.
  - `role="alert"` on error messages and `role="status"` on success messages in `components/ContactForm.tsx` and `EmailSignupForm.tsx`. The inline `--gold-ink` error colour is unchanged.
  - `app/actions.ts`: error strings lose their em dashes and now name the chapter inbox via a new `emailUs()` helper. It reads `getSettings().contactEmail` and falls back if that lookup fails. Honeypot, `rateLimited` and `SIGNUP_TAG` are untouched (ideas-27's condition).
- **Blocked by the permission classifier ("Modify Shared Resources") and NOT done:**
  - Rewriting the stale globals.css header comment (it still says "Manrope display, sentence case") and syncing `tokens.css`.
  - Adding `.ewb-note.is-error` / `.is-success` rules. As a result, `--danger` / `--success` exist but nothing uses them yet.

## Key files for next session
- `C:\Users\Nater\ewb-website\app\globals.css`: `:root` green, field-border and semantic tokens (lines ~23–40); the home-page Oswald rule at the end of the file (ideas-ae's narrowed version).
- `C:\Users\Nater\ewb-website\app\actions.ts`: `emailUs()` helper and error strings.
- `C:\Users\Nater\ewb-website\components\ContactForm.tsx`, `EmailSignupForm.tsx`: ARIA roles.
- `C:\Users\Nater\ewb-website\app\(site)\layout.tsx`: font loaders (Fraunces restored by ideas-ae).
- Memory: `C:\Users\Nater\.claude\projects\c--Users-Nater-Ideas\memory\project-ewb-website.md` (records the decisions and the "don't touch the landing header" rule).

## Running state
- Background processes: none started by me.
- Dev server: `http://localhost:3001`, already running (not mine). Confirmed it serves `--green: #154734`; `/`, `/about/officer-board`, `/projects` and `/contact` all returned 200.
- Repo: `master`, HEAD `09065d8`. The large uncommitted tree is spread across sessions. At the time of writing, ideas-27 had released its claimed files and no other session had an active claim.

## Verification
- `cd C:\Users\Nater\ewb-website && npx tsc --noEmit`: clean after my edits.
- Visit `http://localhost:3001/contact` and submit a bad email. The error should be announced and should include the chapter address for server-side failures. The field outlines should be visibly darker than before.
- Primary (green) buttons and eyebrows should be the darker UVM green. The home hero should look exactly as before.
- None of this was checked in a browser; there was no browser tool this session.

## Deferred + open questions
- Blocked, needs Nater's OK: the header comment and `tokens.css` sync, and the `.is-error` / `.is-success` rules that would put the semantic tokens to use.
- Open: positioning statement and one canonical chapter name (audit Top Fix #2). Not started.
- Open: favicon (`app/icon.svg`, "EWB" in Verdana, old green/gold) is not updated to UVM green / `#FFD100`. Nor is the gold token; Nater only changed the green.
- Open: sponsorship PDF (`public/sponsorship-package.pdf`) is off-brand (blue). Not touched.
- Open: type scale (44 sizes → ~8 tokens) and the 46 untokenized `oklch(…/α)` values. Not started.
- No `brand/BRAND.md` written yet (brand-system skill Step 6).

## Pick up here
Ask Nater whether to allow the two blocked edits (header comment + tokens.css, and the error/success colour rules). Then ask whether the favicon and gold should move to UVM `#FFD100` to match the new green. Never change the landing-page masthead or home hero without asking first.

---

# Session Handoff — Brand-system skill, task audit, depth hero, nav rework, admin inbox, logo + photo sharpness, commit 09065d8

_Saved: 2026-09-29 (session ideas-ae)_

## Where it started
Started in the Ideas vault: turned Stefan Downs' "Branding for Digital Products" deck (Lumin, SaaSathon 2026) into a reusable `brand-system` skill. Nater's rule from that part was "content, not inference": use only what the deck actually says. The session then moved to the EWB-UVM website: audited the task list against the code, worked every `[claude]` task, and ran a long run of homepage-hero, nav and photo requests. Throughout, up to five sessions were editing the same repo, so every shared-file edit was preceded by a cross-session heads-up.

## Decisions locked + what shipped
- **brand-system skill:** `C:\Users\Nater\.claude\skills\brand-system\SKILL.md` + `references\examples.md`, covering positioning, the five identity components, tokens, design-system levels, and Audit/Quick modes. It has Wise type and colour specs, copied exactly from the deck. The deck was not ingested into the wiki.
- **Task audit:** tasks.md was stale. Supabase has been live since 09-12. I added three missing items: Preview env keys, a contact-submissions read path, and the vestigial `NEXT_PUBLIC_` prefix.
- **Committed and pushed as `09065d8`** on master, one combined commit across all sessions. Before committing: `next build` clean, and every referenced `/photos` and `/models` file checked to exist and be git-tracked. Deploy confirmed live about 30 seconds later.
  - 3D model fullscreen: a corner button, with an iPhone overlay fallback.
  - `/admin/inbox`: uses the `isAuthed()` token check, has a signups tab, a BCC box, and a listserv bulk-add box.
  - Project pages: `PhotoCarousel` (`gallery`), `photoSlots`, a `layout: "timeline"` option, and the ProjectsForm fields for all of these, including models.
  - Mission header and team group photo, both with photo-studio slots that fall back to a default image.
  - Poppins fonts deleted.
- **Depth hero, homepage only.** The cut-out file is `public\photos\site\home-hero-team-cutout.webp`.
  - The people are cut out with rembg (isnet), and the layers stack photo, scrim, title, then cut-out.
  - The title shares the photo's parallax transform (a `titleRef` in `components\immersive\PosterSection.tsx`). The tallest head covers the bottom quarter of the W: `top: calc(26.8% - 0.764 * min(6vw, 7rem))`.
  - Desktop only. It only renders for `home-hero-team.jpg`; the mapping is now in `lib\hero-cutouts.ts` (moved there by ideas-27).
  - **Encoding gotcha:** save the WebP with `exact=True`, keeping the full photo RGB under the alpha. Lossy encoding of the transparent pixels caused a dark rim around the people.
  - "at" is `#FFD100` and "UVM" is `#154734`. Low contrast on grey sky; I offered a glow and got no answer.
- **Nav rework (uncommitted),** `components\immersive\ImmersiveHeader.tsx`, `lib\pages.ts`, and the `.imm-nav*` / `.imm-dropdown*` CSS:
  - Sentence-case bold links with a chalk underline.
  - A compact paper dropdown card with no descriptions (Nater removed them).
  - The Contact link was removed. A gold "Get involved" button goes to `/contact`.
  - Hovering a no-menu item closes any open menu.
  - Nater rejected outlined boxes around the links, and variations 2–5.
  - **Logo untouched by request,** except for sharpness (next item).
- **Logo sharpness (uncommitted):** `public\logo.svg` is a potrace vector trace of `logo.png`, trimmed of its ~36% padding. The header maps `logoUrl "/logo.png"` to `/logo.svg` at render time (`crispLogo`), and the height changed from 3.8rem to 2.75rem.
- **Header photos show in full (uncommitted):**
  - New `PageShell` `imageRatio` prop and `.ewb-shell-head.is-fit` (4:3, max-height 100svh, desktop only).
  - Uncropped originals restored to `projects-header.jpg` and `rwanda-schoolkids-road.jpg`.
- **Sponsor card photos (uncommitted):** they now render through next/image `fill` with `sizes` instead of a 7x-downscaled CSS background, which was aliasing. Unknown image hosts get `unoptimized` via the new `lib\can-optimize.ts`.
- **Other changes (uncommitted):**
  - Contact hero subline removed.
  - Gold eyebrows no longer render, either in `PosterSection` or in the Puck SectionIntro and WorldMap blocks.
  - Oswald headlines scoped to the homepage only (`.theme-immersive .imm-poster-title`).
  - Fraunces loader and font file restored for the officer board, after ideas-d2's site-wide Oswald pass.
- **Rejected / reverted:** Oswald everywhere, the outlined nav boxes, dropdown descriptions, and nav-lab options A–E and variations 2–5. The nav-lab preview page was deleted.

## Key files for next session
- `C:\Users\Nater\Ideas\projects\ewb-website\tasks.md`: the checklist. It is NOT yet updated for the nav, logo, sponsor-card and font changes made after `09065d8`.
- `C:\Users\Nater\ewb-website\components\immersive\ImmersiveHeader.tsx` and `C:\Users\Nater\ewb-website\lib\pages.ts`: the nav.
- `C:\Users\Nater\ewb-website\components\immersive\PosterSection.tsx`, `C:\Users\Nater\ewb-website\app\(site)\page.tsx` and `C:\Users\Nater\ewb-website\lib\hero-cutouts.ts`: the depth hero.
- `C:\Users\Nater\ewb-website\app\globals.css`: `.imm-poster.has-depth*`, `.imm-nav*`, `.imm-dropdown*`, `.ewb-shell-head.is-fit`, `.spon-way-media`, and the home-only Oswald rule at the end of the file.
- `C:\Users\Nater\ewb-website\.env.development.local`: blanks the Supabase vars, so localhost runs on `/data` JSON, not production. It is gitignored. Delete it to point dev back at Supabase.
- Memory files touched: `C:\Users\Nater\.claude\projects\c--Users-Nater-Ideas\memory\feedback-source-content-not-inference.md`, plus its line in `MEMORY.md`.

## Running state
- Background processes:
  - Shell `bigkodv0z`: `npm run dev` on port 3001, started by this session. To kill it: `netstat -ano | findstr :3001`, then `taskkill /PID <pid> /F /T`.
- Dev servers / ports: `http://localhost:3001`, on local JSON data (see `.env.development.local`).
- Open worktrees / branches: none. On `master`, HEAD `09065d8` at time of writing. There's a large uncommitted tree from ideas-ae, ideas-27 (admin rework: history, help, checklist, page-text), ideas-03 and ideas-d2.
- Scratchpad venv with rembg, pillow-heif and potracer, used for the cut-out and the logo trace (session-local, disposable).

## Verification — how to confirm things still work
- `cd C:\Users\Nater\ewb-website && npx --no-install tsc --noEmit`: clean.
- `npx next build`: stop the dev server first. It passed at `09065d8` but has not been re-run since.
- Home page at 1440 wide, scrolled 0–600px: the headline gap to the photo should be constant, and the tallest head should cover only the bottom quarter of the W.
- Any page: the nav reads About, Projects, Sponsors, Get involved. Hovering Sponsors or Get involved after About should close About's menu. The logo should be crisp at 2x.
- `/sponsors`: the card images should come from `/_next/image?...&w=640` (or `w=1080` on high-DPI screens).

## Deferred + open questions
- **Deferred: commit and push everything since `09065d8`.** Nater hasn't said "push" yet. Before committing, run `next build`, re-check that all referenced photos are tracked, and freeze the other sessions.
- **Open: run the new `supabase/schema.sql` block** (ideas-27's `content_history`) in the Supabase SQL editor after deploying, or admin save history won't record.
- **Open: add the Supabase env vars to Vercel Preview.** Nater said he'd do this.
- **Open: a glow behind the green "UVM" in the hero** for contrast. Offered, not answered.
- **Open: Alumni & Friends sponsor card crop.** `cooper-uvm.jpg` is portrait, so the person is cut at the right edge. Offered to reframe it; not answered.
- **Open: the Montessori school's name for the Domestic rename.** The seed says "Montessori School of Catskill", unconfirmed.
- **Deferred: delete the officer-board test rows** ("John doh", "d", "ds") in production via `/admin`. Nater's task.

## Pick up here
Ask Nater whether to push. If yes, freeze the other sessions, run `next build` and the tracked-photo check, then commit, push, and remind him to run the Supabase `schema.sql` block.
