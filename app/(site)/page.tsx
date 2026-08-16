import PosterSection from "@/components/immersive/PosterSection";
import { getProjects, getSettings } from "@/lib/store";

const BASE = "";

// Pronounced Cal-Poly-style parallax reveal — backgrounds travel slower than the
// page so more of each photo is revealed as it scrolls in. 180 = the strong
// reveal (auto-applies the .is-parallax bleed override past 120).
const STRENGTH = 180;

function shortName(title: string): string {
  return title.split("—")[0].split(",")[0].trim();
}

export default async function ImmersiveHome() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);

  const projectNames = projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)
    .map((p) => shortName(p.title));

  // Per-slot images are editable via /admin/photos; fall back to the defaults.
  const img = (key: string, fallback: string) =>
    settings.sectionImages?.[key] || fallback;

  // Section copy is editable via /admin/settings ("Home page sections"); any
  // blank field falls back to the built-in default text below.
  const home = settings.home ?? {};

  return (
    <>
      <PosterSection
        variant="hero"
        warm
        parallaxStrength={STRENGTH}
        image={settings.heroImages?.[0] || "/photos/hero.jpg"}
        eyebrow={`${settings.chapterName} · UVM`}
        title={settings.heroHeading}
        sub={settings.heroSubline}
        showScroll
        actions={[
          { label: "Who we are", href: `${BASE}/about`, variant: "gold" },
          { label: "Join us", href: `${BASE}/contact`, variant: "ghost" },
        ]}
      />

      <PosterSection
        align="left"
        warm
        parallaxStrength={STRENGTH}
        image={img("projects", "/photos/projects.jpg")}
        title={home.projectsTitle || "Projects, near and far"}
        strip={projectNames}
        actions={[
          { label: "See our projects", href: `${BASE}/projects`, variant: "gold" },
        ]}
      />

      <PosterSection
        align="right"
        warm
        parallaxStrength={STRENGTH}
        image={img("giving", "/photos/giving.jpg")}
        title={home.givingTitle || "Giving"}
        sub={
          home.givingBody ||
          "Every gift trains the next generation of engineers while changing lives in the communities we serve."
        }
        actions={[
          { label: "Support our work", href: `${BASE}/sponsors`, variant: "gold" },
        ]}
      />

      <PosterSection
        short
        parallaxStrength={STRENGTH}
        image={img("join", "/photos/join.jpg")}
        title={home.joinTitle || "Join us"}
        sub={
          home.joinBody ||
          "Want to join the chapter, partner with us, or support a project? We'd love to hear from you."
        }
        actions={[
          { label: "Get in touch", href: `${BASE}/contact`, variant: "gold" },
        ]}
      />
    </>
  );
}
