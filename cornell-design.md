<!-- Hallmark · design system · studied: yes · DNA-source: url (https://www.ewbcornell.org/)
     macrostructure: Marquee Hero (photographic) · dress: UVM green + gold · display/body: Poppins -->

# Cornell-DNA Design System (EWB-UVM edition)

A portable design system extracted from the **structure** of
[ewbcornell.org](https://www.ewbcornell.org/) and dressed in the **UVM chapter's
identity** (dark green primary, gold secondary). The DNA is the shape — a
photographic marquee hero, a calm statement band, a scroll-darkening solid nav, a
minimal 3-zone footer, and a rounded-geometric type voice. The colour is UVM's.

Named `cornell-design.md` (not `design.md`) on purpose: the repo already has a
canonical UVM system for the site at `/`. This file governs only the parallel
`/cornell` edition, so it does not hijack the root project's design pre-flight.

## System

- **Genre:** editorial / field-authentic (humanitarian engineering).
- **Macrostructure:** Marquee Hero (photographic) → statement band → minimal footer.
- **Type:** **Poppins**, single family, medium weight (500) for display, roomy
  tracking on the headline. Rounded-geometric — matches the source's voice.
- **Colour dress (UVM):** dark forest green is the main colour (`--green` /
  `--green-deep`); warm gold is the secondary accent (`--gold` / `--gold-deep`).
  Paper is warm off-white; ink is a green-tinted near-black.
- **Nav:** transparent over the hero photo, darkening to a **solid dark bar** on
  scroll; right-aligned links + hover dropdowns; hamburger below 760px. Text is
  always light.
- **Hero:** full-bleed photo, dark scrim for legibility, a **solid-ink headline**
  (`--chalk`) with a smaller **right-offset second line** ("at UVM"). No button in
  the hero — the CTA lives in the band below. Note: the *source* uses a
  translucent gradient-clip headline; we deliberately ship solid ink instead —
  it's more legible over the photo and avoids the gradient-headline AI tell.
- **Statement band:** a light green-tinted calm band, one centered line, one
  green primary pill CTA.
- **Footer:** minimal 3-zone — wordmark (left) · italic disclaimer (center) ·
  social icons (right). Only real social links are rendered.
- **Rhythm:** generous, centred-symmetric.
- **Motion:** parallax hero layer, scroll-darkening nav, a bobbing scroll cue.
  All collapse under `prefers-reduced-motion`.

## Provenance

- **Source mode:** URL (`https://www.ewbcornell.org/`), plus four user-supplied
  screenshots for the surface / type / rhythm pass (Squarespace bundled its CSS,
  so type and colour weren't readable from the fetched HTML).
- **Extracted:** 2026-08-02.
- **Attestation:** public reference for the user's own brand (EWB). The DNA is
  **structural**; the specific tokens here are tuned to UVM's identity, not the
  source's. The source uses an azure-blue accent — deliberately **not** carried
  over.
- **Confidence:** structure, hero treatment, nav behaviour, and rhythm are from
  the screenshots and are high-confidence. Exact source fonts/colours were not
  machine-readable; the type voice is role-matched (Poppins) rather than copied.

## Tokens

See [`tokens.cornell.css`](tokens.cornell.css) for the full portable set. Scope
under `.theme-cornell` (as the live build does) or move to `:root` to theme a
whole page. Key values:

| Role | Token | Value |
| --- | --- | --- |
| Paper | `--paper` | `oklch(97% 0.008 95)` |
| Ink | `--ink` | `oklch(23% 0.03 158)` |
| Primary (main) | `--green` / `--green-deep` | `oklch(52% 0.11 158)` / `oklch(42% 0.10 158)` |
| Secondary | `--gold` / `--gold-deep` | `oklch(80% 0.13 80)` / `oklch(70% 0.14 72)` |
| Dark field | `--field` | `oklch(30% 0.055 158)` |
| Statement band | `--cornell-band` | `oklch(95% 0.01 150)` |
| Solid nav | `--cornell-dark` | `oklch(16% 0.02 158)` |
| Display / Body | `--font-display` / `--font-body` | Poppins |

## Notes — anti-patterns NOT to carry over

These are part of this system's identity — future runs should keep avoiding them:

- **Low-contrast text on a busy photo.** The source's headline fights the bright
  sky. Always ship the dark scrim overlay under the hero title.
- **Buried text-link CTA.** The source's original "Learn more" was a bare text
  link. Use a real pill button (green primary) instead.
- **Templated even section padding.** Squarespace's uniform rhythm reads
  generated. Vary section padding intentionally.
- **The source's azure-blue accent.** Off-brand for UVM — do not reintroduce it.
- **Gradient-clip headlines.** The source fills its headline with a translucent
  gradient (`background-clip: text`). It's the fastest AI tell — ship solid ink.
