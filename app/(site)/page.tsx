import PosterSection from "@/components/immersive/PosterSection";
import { getSettings } from "@/lib/store";
import { HOME_COPY } from "@/lib/home-copy";

const BASE = "";

// Pronounced Cal-Poly-style parallax reveal — the photo stays closer to fixed
// while the page scrolls over it, so more of each photo is revealed like a window
// (text rides the normal linear scroll). Higher = more "pinned" photo. Past 120
// auto-applies the .is-parallax bleed override.
const STRENGTH = 210;

export default async function ImmersiveHome() {
  const settings = await getSettings();

  // Per-slot images are editable via /admin/photos; fall back to the defaults.
  const img = (key: string, fallback: string) =>
    settings.sectionImages?.[key] || fallback;

  // Section copy is editable via /admin/settings ("Home page sections"); any
  // blank field falls back to the built-in default text below.
  const home = settings.home ?? {};

  // The hero photo is the LCP element, but it's painted as a CSS background (so
  // the browser can't discover it early). Preload it at high priority; React 19
  // hoists this <link> into <head>.
  const heroImage = settings.heroImages?.[0] || "/photos/hero.jpg";

  return (
    <>
      <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      <PosterSection
        variant="hero"
        warm
        parallaxStrength={STRENGTH}
        image={heroImage}
        title={settings.heroHeading}
        titleSuffix="at UVM"
        sub={settings.heroSubline}
        showScroll
        actions={[
          { label: "Learn more", href: `${BASE}/about`, variant: "gold" },
        ]}
      />

      <PosterSection
        align="left"
        warm
        parallaxStrength={STRENGTH}
        image={img("projects", "/photos/projects.jpg")}
        title={home.projectsTitle || HOME_COPY.projectsTitle}
        sub={home.projectsBody || HOME_COPY.projectsBody}
        actions={[
          { label: "See our projects", href: `${BASE}/projects`, variant: "gold" },
        ]}
      />

      <PosterSection
        align="right"
        warm
        parallaxStrength={STRENGTH}
        image={img("giving", "/photos/giving.jpg")}
        title={home.givingTitle || HOME_COPY.givingTitle}
        sub={home.givingBody || HOME_COPY.givingBody}
        actions={[
          { label: "Support our work", href: `${BASE}/sponsors`, variant: "gold" },
        ]}
      />

      <PosterSection
        short
        scrimToFooter
        parallaxStrength={STRENGTH}
        image={img("join", "/photos/join.jpg")}
        title={home.joinTitle || HOME_COPY.joinTitle}
        sub={home.joinBody || HOME_COPY.joinBody}
        actions={[
          { label: "Get in touch", href: `${BASE}/contact`, variant: "gold" },
        ]}
      />
    </>
  );
}
