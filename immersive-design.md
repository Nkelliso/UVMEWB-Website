<!-- Hallmark · design.md · studied: yes · DNA-source: url (https://www.ewb.calpoly.edu/) + homepage screenshots
     scope: the /immersive re-skin ONLY — this file is intentionally NOT named design.md/DESIGN.md
     so it does not hijack the base UVM design system's pre-flight. -->

# Immersive — Design System

A portable spec for the **`/immersive`** re-skin of the EWB–UVM site: the *structure,
layout, type voice, hero treatment, and rhythm* extracted from Engineers Without
Borders at Cal Poly (https://www.ewb.calpoly.edu/), **dressed in UVM forest green
+ warm gold**. The source's white/neutral on-photo accent was deliberately **not**
adopted — the dress is UVM's.

## System

- **Genre** · editorial → photographic (atmospheric-leaning)
- **Macrostructure** · Photographic Stack — full-viewport posters stacked vertically, each with a giant uppercase overlay and a single primary action; scroll-linked parallax ties them together.
- **Nav** · N6 Masthead — transparent white-on-photo over the hero, collapses to a solid deep-green bar on scroll. Uppercase, wide-tracked. **Trimmed to 4 destinations** (About · Projects · Sponsors · Contact; the logo covers Home) — a deliberate fix of the source's ~10-link sitemap-nav.
- **Footer** · Ft1 Minimal — one dark band: mark, tagline, a compact centered link row, one copyright line.
- **Display type** · Montserrat, uppercase, `letter-spacing: 0.08em` (headers) / `0.22em` (labels), weight 400–500 — the studied light-geometric voice. Loaded via `next/font`, scoped to the route.
- **Body type** · Nunito Sans (inherited from the base UVM system).
- **Color** · UVM forest green primary (`--green`), warm gold secondary (`--gold`), light warm paper for interior reading surfaces, deep-green field bands for posters. Neutral source accent rejected.
- **Shape** · hard edges (`--radius: 0`) — the source's boxy button/frame voice.
- **Motion** · per-section background parallax on scroll · a bobbing scroll cue on the hero · hide-on-scroll masthead. All collapse under `prefers-reduced-motion`.

## Provenance

- **Source mode** · URL (`https://www.ewb.calpoly.edu/`) + three homepage screenshots supplied by the site owner.
- **Extracted** · 2026-08-02.
- **Attestation** · Public reference for the user's own brand (EWB–UVM is rebuilding its own chapter site; Cal Poly's chapter site is a sibling EWB-USA chapter used as a structural reference). The DNA captured here is **structural** — macrostructure, nav/footer archetype, type voice, hero treatment, rhythm. **No pixels, photography, or copy were copied.** Specific tokens are UVM's own brand values, not the source's.
- **Confidence** · Structure, nav, and footer are exact (read from DOM + screenshots). Type is *role-based* — the source is a JS-styled Squarespace build whose font names were not served in HTML; Montserrat is a canon match to the observed light-geometric uppercase voice, not the source's actual face. Color is UVM's own system, not extracted. Rhythm read from the screenshots (generous, full-viewport posters).

## Tokens

Effective tokens live in [`tokens.immersive.css`](./tokens.immersive.css) and in the
`.theme-immersive` block of [`app/globals.css`](./app/globals.css) (the live source
of truth). Highlights:

| Token | Value | Note |
| --- | --- | --- |
| `--green` | `oklch(52% 0.11 158)` | UVM forest green — primary |
| `--green-deep` | `oklch(42% 0.10 158)` | primary hover / ink-green |
| `--gold` | `oklch(80% 0.13 80)` | warm gold — secondary |
| `--field` | `oklch(27% 0.062 158)` | deepened poster band (override) |
| `--paper` | `oklch(97% 0.008 95)` | interior reading surface |
| `--font-display` | `Montserrat` (scoped) | uppercase, tracked |
| `--text-mega` | `clamp(3rem, 10vw, 8rem)` | poster headline (override) |
| `--radius` | `0` | hard edges (override) |
| `--imm-track` / `--imm-track-wide` | `0.08em` / `0.22em` | display / label tracking |

## Notes — anti-patterns from the source, NOT carried over

These are part of this system's identity — the studied DNA with its tells removed:

1. **White text on un-scrimmed photos** → every poster carries a green-tinted legibility scrim (`--poster-scrim`).
2. **Ghost-only CTAs** → posters use **solid** UVM buttons (gold / green); ghost is reserved for the secondary hero action only.
3. **Every panel identical (centered word + ghost button)** → one intentional light intro band breaks the poster run; the hero is left-biased while section posters are centered — a rhythm break, not a loop.
4. **10-link sitemap masthead** → trimmed to 4 real destinations.
5. **All-caps thin display at giant size as the *only* voice** → uppercase display is paired with sentence-case body and card titles for hierarchy.

## Exports

- CSS custom properties · [`tokens.immersive.css`](./tokens.immersive.css)
- Live source of truth · `.theme-immersive` block in [`app/globals.css`](./app/globals.css)
- Scoped to the `/immersive` route tree; the base `/` UVM system is untouched.
