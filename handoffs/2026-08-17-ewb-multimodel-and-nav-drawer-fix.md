# Handoff — 2026-08-17 · Multi-model International section + mobile nav drawer fix

Follows `2026-08-17-ewb-3d-model-mobile-nav-fix.md` (whose two items were uncommitted).
This session finished both, plus expanded the 3D section from one model to five.

## What shipped (committed + pushed to `master` → auto-deploys to Vercel prod)

### 1. Mobile nav drawer clipping — real fix
- **Root cause found:** opening the drawer sets `data-over-dark="false"` on `.imm-header`,
  which turns on `backdrop-filter: blur(10px)`. A `backdrop-filter`/`transform` ancestor
  becomes the *containing block* for its `position:fixed` child, so the drawer `.imm-nav`
  (`inset:0 0 0 auto`) was sized to the ~72px header box, and `overflow-y:auto` clipped it
  ("ABOUT" cut off, scrollbars). The prior session only fixed accordion expansion, not this.
- **Fix:** `app/globals.css` — new rule after the `[data-over-dark]`/`[data-hidden]` blocks:
  ```css
  .imm-header[data-menu-open="true"] { backdrop-filter: none; transform: none; }
  ```
  Neutralizes the containing block while the menu is open → drawer sizes to viewport again.
  `data-menu-open` was already emitted by `components/immersive/ImmersiveHeader.tsx:110`.
- Unaffected: `/cornell`, `/stevens` use a separate `CornellHeader`.

### 2. International Project page (`rwanda-water`) — 5 labeled 3D models
- `lib/types.ts`: replaced single `Project.model` with `models?: ProjectModel[]`
  (`{ src, label, alt?, poster? }`).
- `lib/seed.ts` (`rwanda-water`): `models: [...]` with all five glb files, `label` = filename,
  `src` URL-encoded (`/models/Current%20Water%20Source.glb`, etc.). This also fixed the
  previously-broken `/models/kitchen.glb` ref (file had been renamed to `School Kitchen.glb`).
- `app/(site)/projects/[slug]/page.tsx`: section now maps over `project.models`, rendering a
  `<figure>` (label + `<ModelViewer>`) per model. `ModelViewer` component reused unchanged.
- `app/globals.css`: `.proj-models-grid` (2-col desktop / 1-col ≤760px), `.proj-model-item`,
  `.proj-model-label`. Reuses existing `.proj-model` 16:10 framed viewer; `loading="lazy"`
  keeps off-screen models (≈26MB total) from all loading at once.
- Files in `public/models/`: `Current Water Source.glb`, `Damaged Tapstand.glb`,
  `Kajinge Board.glb`, `School Handwashing Station.glb`, `School Kitchen.glb`.

## Verification done
- `npx tsc --noEmit` clean; `npx next build` exit 0.
- All 5 `/models/*.glb` → HTTP 200; `/projects/rwanda-water` server-renders all 5 labels;
  no remaining `kitchen.glb` reference.
- NOT verified headlessly: mobile drawer appearance (no Playwright). Needs an eyeball at
  ≤760px — if still off, the fix location is the same `data-menu-open` rule.

## Pick up here / still open (from prior handoffs, unchanged)
- Home ↔ editor mismatch: live `/` uses PosterSection (Settings/Photos), not Puck "home".
- Wix-style inline editing — wanted, not built.
- Remove `/uvm` reference pages.
- Placeholder copy on Catskills / Local project pages.
- Set `heroImages[0]` via `/admin` (still a placeholder).
- `models` not wired into the `/admin` Projects form (seed/code only; prod renders from seed).
- Pixel/responsive QA at 320/375/768 never automated — offer to add Playwright.
- Cornell/Stevens editions rollout to more sites — pending user input (URLs, color choice).

## State
- Branch `master`; this session's work committed and pushed.
- Dev server `localhost:3001` running (PID 20828 from a prior session).
