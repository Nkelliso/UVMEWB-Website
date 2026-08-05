import PosterSection from "@/components/immersive/PosterSection";
import { getProjects, getSettings } from "@/lib/store";

const BASE = "/immersive";

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

  return (
    <>
      <PosterSection
        variant="hero"
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
        image={img("projects", "/photos/projects.jpg")}
        title="Projects, near and far"
        strip={projectNames}
        actions={[
          { label: "See our projects", href: `${BASE}/projects`, variant: "gold" },
        ]}
      />

      <PosterSection
        align="right"
        image={img("giving", "/photos/giving.jpg")}
        title="Giving"
        sub="Every gift trains the next generation of engineers while changing lives in the communities we serve."
        actions={[
          { label: "Support our work", href: `${BASE}/sponsors`, variant: "gold" },
        ]}
      />

      <PosterSection
        short
        image={img("join", "/photos/join.jpg")}
        title="Join us"
        sub="Want to join the chapter, partner with us, or support a project? We'd love to hear from you."
        actions={[
          { label: "Get in touch", href: `${BASE}/contact`, variant: "gold" },
        ]}
      />
    </>
  );
}
