import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Placeholder from "@/components/Placeholder";
import { getProjects } from "@/lib/store";

export const metadata: Metadata = {
  title: "Projects — EWB UVM",
  description:
    "International, domestic, and local engineering projects run by the EWB UVM chapter.",
};

export default async function ProjectsIndex() {
  const projects = (await getProjects())
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  return (
    <PageShell
      eyebrow="Our work"
      title="Projects, near and far"
      narrow={false}
      image="/photos/projects.jpg"
    >
      <p className="ewb-lede">
        From a clean-water pipeline in Rwanda to stormwater work in the
        Northeast and volunteering across Vermont — every project is designed
        for community ownership and built to last.
      </p>

      <div className="ewb-card-grid">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="ewb-project-card"
          >
            {p.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.heroImage}
                alt={p.title}
                style={{ width: "100%", height: "11rem", objectFit: "cover" }}
              />
            ) : (
              <Placeholder label="Project photo — placeholder" height="11rem" />
            )}
            <div className="ewb-project-card-body">
              <span className="ewb-tag">{p.status}</span>
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
