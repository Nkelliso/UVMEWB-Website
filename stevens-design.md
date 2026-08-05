<!-- Hallmark · design.md · studied: yes · DNA-source: url (https://ducklink.stevens.edu/ewb/home/)
     scope: /stevens re-skin only · deliberately NOT named design.md so it does not
     hijack the canonical UVM system's pre-flight. -->

# Stevens-studied re-skin — design system (`/stevens`)

A portable spec for the `/stevens` route re-skin. It takes the **structure, layout,
type voice, hero treatment, and rhythm** of the Stevens EWB chapter homepage and
re-dresses them in the **UVM green + gold** brand. The source's brick-red accent is
**not** adopted. This system is additive and scoped; the canonical UVM site at `/`
is untouched.

## System

- **Genre** — editorial / civic non-profit, photographic.
- **Macrostructure** — Photographic Long Document: full-bleed photo sections
  alternating with contained white sections, stacked top to bottom.
- **Hero** — H6 Photographic: full-bleed parallax image, headline anchored
  bottom-left over a gradient scrim, light-weight display type.
- **Nav** — N6 masthead: wordmark left, inline links right, active link underlined;
  translucent-green over the hero, solid light on interior pages; hide-on-scroll-down.
- **Footer** — dark ink band: large chapter wordmark + two link columns + legal base.
- **Type voice** — light geometric sans display (weight 300, open tracking) paired
  with a humanist grotesque body. Emphasis is carried by **weight**, never italic
  (italic headers are banned).
- **Rhythm** — generous vertical exhale (`clamp(4.5rem, 11vw, 9.5rem)` sections),
  medium heading-to-body ratio, colored bands (stat + CTA) breaking the white flow.

## Provenance

- **Source mode** — URL. Studied from `https://ducklink.stevens.edu/ewb/home/`
  (structure + copy via server-rendered HTML) plus user-supplied screenshots
  (type, colour, and rhythm layer that the HTML fetch could not carry).
- **Extracted on** — 2026-08-02.
- **Attestation** — public reference for the user's own brand (the UVM EWB chapter
  site in this repo). The **structural DNA** is portable; the **colour + type dress
  is UVM's own**, regenerated to the chapter's identity rather than copied from the
  source. No Stevens imagery, colour, or typeface is reproduced.
- **Confidence** — Structure is exact (real DOM). Colour tokens are UVM's own brand
  values (not extracted from the source). Fonts: display role is Stevens' (light
  geometric sans); the specific face (Poppins) is a Hallmark-canon substitute, not
  the source's exact typeface. Rhythm is from the screenshot vision pass.

## Tokens

Colour is inherited from the base UVM system; the re-skin overrides only type voice,
rhythm, and adds a green flood band. Full portable copy in
[`tokens.stevens.css`](./tokens.stevens.css). Key values:

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `oklch(97% 0.008 95)` | warm off-white surface |
| `--ink` | `oklch(23% 0.03 158)` | green-black text |
| `--green` | `oklch(52% 0.11 158)` | **primary** (UVM forest green) |
| `--green-deep` | `oklch(42% 0.10 158)` | primary, deep |
| `--gold` | `oklch(80% 0.13 80)` | **secondary** (UVM warm gold) |
| `--field` / `--stevens-flood` | `oklch(30% 0.055 158)` | dark-green band flood |
| `--chalk` | `oklch(97% 0.01 95)` | text on green |
| `--font-display` | `Poppins`, weight **300** | light geometric display |
| `--font-body` | `Nunito Sans` | humanist body |
| section rhythm | `clamp(4.5rem, 11vw, 9.5rem)` | generous exhale |

## Implementation

- Scoped layer: [`app/stevens-theme.css`](./app/stevens-theme.css), everything
  under `.theme-stevens`. It re-points `--font-display` to Poppins (loaded scoped
  via `next/font` in `app/stevens/layout.tsx`) and re-voices the shared `.ewb-*`
  components — it does **not** fork them.
- Parallel route tree: `app/stevens/**` reuses the same token-driven components and
  the same CMS data (`getPageData`, `getProjects`, …) via a `basePath="/stevens"`
  prop threaded through `SiteHeader`, `SiteFooter`, `ParallaxHero`, and
  `PageRenderer`. Default `basePath=""` keeps `/` byte-identical.

## Notes — anti-patterns from the source NOT carried over

- Thin display type set over a busy photo with **no scrim** (legibility risk) —
  fixed here by keeping the gradient hero overlay.
- Rounded photo card with a heavy soft drop-shadow (dated template tell) — dropped;
  cards use a quiet border shift on hover instead of a shadow + translate.
- The source's **two competing accents** (navy-blue logo vs. brick-red stat band) —
  resolved to a single UVM system: green primary, gold secondary.
- Page-builder generic stat-counter icons — omitted.
