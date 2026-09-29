/** People cut out of a specific home hero photo, so the headline can sit
 *  behind their heads (the "depth" effect). Keyed by the exact hero photo URL:
 *  a different photo, or a re-cropped copy, renders without the effect. The
 *  admin reads this too, to warn before the effect gets switched off. */
export const HERO_CUTOUTS: Record<string, string> = {
  "/photos/site/home-hero-team.jpg": "/photos/site/home-hero-team-cutout.webp",
};
