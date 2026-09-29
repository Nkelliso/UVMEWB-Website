import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Placeholder from "@/components/Placeholder";
import { getProjects, getSettings } from "@/lib/store";
import { PROJECTS_TEXT, withDefaults } from "@/lib/page-text";
import { canOptimize } from "@/lib/can-optimize";

export const metadata: Metadata = {
  title: "Projects · EWB UVM",
  description:
    "International, domestic, and local engineering projects run by the EWB UVM chapter.",
};

export default async function ProjectsIndex() {
  const settings = await getSettings();
  const t = withDefaults(PROJECTS_TEXT, settings.projectsText);
  const projects = (await getProjects())
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  return (
    <PageShell
      title={t.title}
      narrow={false}
      image={settings.sectionImages?.projectsHeader || "/photos/site/projects-header.jpg"}
      imageRatio={4 / 3}
    >
      <p className="ewb-lede">{t.intro}</p>

      <div className="ewb-card-grid">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="ewb-project-card"
          >
            {p.heroImage ? (
              <div style={{ position: "relative", height: "11rem" }}>
                <Image
                  src={p.heroImage}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  unoptimized={!canOptimize(p.heroImage)}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <Placeholder label="Project photo placeholder" height="11rem" />
            )}
            <div className="ewb-project-card-body">
              {p.status &&
                p.status.toLowerCase() !== p.title.toLowerCase() && (
                  <span className="ewb-tag">{p.status}</span>
                )}
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <span className="ewb-project-more">
                View project <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
