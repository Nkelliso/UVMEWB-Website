import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/store";

// No generateStaticParams: project content is CMS-backed and edited at runtime
// via /admin, so these detail pages render on demand (always fresh).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: project ? `${project.title} · EWB UVM` : "Project · EWB UVM",
    description: project?.summary,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.published) notFound();

  const hero = project.heroImage || `/photos/projects/${project.slug}.jpg`;

  return (
    <article className="proj">
      <header className="proj-hero">
        <div
          className="proj-hero-bg"
          style={{ backgroundImage: `url(${hero})` }}
        />
        <div className="proj-hero-scrim" />
        <div className="proj-hero-inner">
          {project.eyebrow && (
            <p className="proj-hero-eyebrow">{project.eyebrow}</p>
          )}
          <h1 className="proj-hero-title">{project.title}</h1>
          <p className="proj-hero-meta">
            {project.status} · {project.location}
          </p>
        </div>
      </header>

      <div className="proj-body">
        {project.sections.map((s, i) => (
          <section
            key={s.heading}
            className={`proj-section${
              s.image ? (i % 2 === 1 ? " is-flip" : "") : " is-text"
            }`}
          >
            <div className="proj-section-text">
              <h2 className="proj-section-heading">{s.heading}</h2>
              <p className="proj-section-body">{s.body}</p>
            </div>
            {s.image && (
              <div className="proj-section-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.heading} loading="lazy" />
              </div>
            )}
          </section>
        ))}

        {project.technicalDrawings && project.technicalDrawings.length > 0 && (
          <section className="proj-tech">
            <h2 className="proj-section-heading">Technical drawings</h2>
            <div className="proj-tech-grid">
              {project.technicalDrawings.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="Technical drawing" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        <div className="proj-cta">
          <Link href="/sponsors" className="ewb-btn ewb-btn-gold">
            Support this project <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
