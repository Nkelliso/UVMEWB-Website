import ScrollStack, { type Layer } from "@/components/immersive/ScrollStack";
import { getProjects, getSettings } from "@/lib/store";

// PREVIEW route — sticky-curtain scroll effect. Delete once an effect is chosen.
const BASE = "/immersive";
const shortName = (t: string) => t.split("—")[0].split(",")[0].trim();

export default async function FxCurtain() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const projectNames = projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)
    .map((p) => shortName(p.title));

  const layers: Layer[] = [
    { image: settings.heroImages?.[0] || "/photos/hero.jpg", eyebrow: `${settings.chapterName} · UVM`, title: settings.heroHeading, sub: settings.heroSubline, ctaLabel: "Who we are", ctaHref: `${BASE}/about` },
    { image: "/photos/projects.jpg", title: "Projects, near and far", strip: projectNames, ctaLabel: "See our projects", ctaHref: `${BASE}/projects` },
    { image: "/photos/giving.jpg", title: "Giving", sub: "Every gift trains the next generation of engineers while changing lives in the communities we serve.", ctaLabel: "Support our work", ctaHref: `${BASE}/sponsors` },
    { image: "/photos/join.jpg", title: "Join us", sub: "Want to join the chapter, partner with us, or support a project? We'd love to hear from you.", ctaLabel: "Get in touch", ctaHref: `${BASE}/contact` },
    { footer: true, title: "" },
  ];

  return (
    <ScrollStack
      mode="curtain"
      layers={layers}
      copyright={`© ${new Date().getFullYear()} EWB-USA · University of Vermont Chapter`}
    />
  );
}
