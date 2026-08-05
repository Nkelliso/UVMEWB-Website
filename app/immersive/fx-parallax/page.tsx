import PosterSection from "@/components/immersive/PosterSection";
import { getProjects, getSettings } from "@/lib/store";

// PREVIEW route — pronounced parallax reveal (Cal Poly style). Full-viewport
// photo sections scroll normally while their backgrounds move slower, so more of
// each photo is revealed as it scrolls and the previous one scrolls away (no
// pinning). Delete once an effect is chosen. The layout footer follows <main>.
const BASE = "/immersive";
const shortName = (t: string) => t.split("—")[0].split(",")[0].trim();
const STRENGTH = 180;

export default async function FxParallax() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const projectNames = projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)
    .map((p) => shortName(p.title));

  return (
    <>
      <PosterSection
        variant="hero"
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
        parallaxStrength={STRENGTH}
        image="/photos/projects.jpg"
        title="Projects, near and far"
        strip={projectNames}
        actions={[{ label: "See our projects", href: `${BASE}/projects`, variant: "gold" }]}
      />
      <PosterSection
        align="right"
        parallaxStrength={STRENGTH}
        image="/photos/giving.jpg"
        title="Giving"
        sub="Every gift trains the next generation of engineers while changing lives in the communities we serve."
        actions={[{ label: "Support our work", href: `${BASE}/sponsors`, variant: "gold" }]}
      />
      <PosterSection
        parallaxStrength={STRENGTH}
        image="/photos/join.jpg"
        title="Join us"
        sub="Want to join the chapter, partner with us, or support a project? We'd love to hear from you."
        actions={[{ label: "Get in touch", href: `${BASE}/contact`, variant: "gold" }]}
      />
    </>
  );
}
