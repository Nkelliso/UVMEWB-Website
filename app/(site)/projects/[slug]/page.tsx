import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/store";
import ModelViewer from "@/components/ModelViewer";
import PhotoCarousel from "@/components/PhotoCarousel";
import Placeholder from "@/components/Placeholder";

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
          style={{
            backgroundImage: `url(${hero})`,
            backgroundPosition: project.heroPosition || "center",
          }}
        />
        <div className="proj-hero-scrim" />
        <div className="proj-hero-inner">
          <h1 className="proj-hero-title">{project.title}</h1>
        </div>
      </header>

      <div className="proj-body">
        {project.layout === "timeline" ? (
          <section className="proj-timeline" aria-label={`${project.title} timeline`}>
            <ol className="proj-timeline-list">
              {project.sections.map((s, i) => (
                <li key={`${s.heading}-${i}`} className="proj-timeline-item">
                  {s.date && <p className="proj-timeline-date">{s.date}</p>}
                  <h2 className="proj-timeline-heading">{s.heading}</h2>
                  <p className="proj-section-body">{s.body}</p>
                  {s.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="proj-timeline-img"
                      src={s.image}
                      alt={s.heading}
                      loading="lazy"
                    />
                  )}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          project.sections.map((s, i) => {
            const media = s.image || project.photoSlots;
            return (
              <section
                key={`${s.heading}-${i}`}
                className={`proj-section${
                  media ? (i % 2 === 1 ? " is-flip" : "") : " is-text"
                }`}
              >
                <div className="proj-section-text">
                  <h2 className="proj-section-heading">{s.heading}</h2>
                  <p className="proj-section-body">{s.body}</p>
                </div>
                {media && (
                  <div className="proj-section-media">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={s.heading} loading="lazy" />
                    ) : (
                      <Placeholder label={`${s.heading} photo coming soon`} height="22rem" />
                    )}
                  </div>
                )}
              </section>
            );
          })
        )}

        {project.gallery && (
          <section className="proj-gallery">
            <h2 className="proj-section-heading">Photos</h2>
            <PhotoCarousel photos={project.gallery} label={`${project.title} photos`} />
          </section>
        )}

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

        {project.models && project.models.length > 0 && (
          <section className="proj-model-section">
            <h2 className="proj-section-heading">Explore in 3D</h2>
            <p className="proj-model-caption">
              Photogrammetry scans captured in Kajinge, Assessment Trip 2025.
            </p>
            <div className="proj-models-grid">
              {project.models.map((m) => (
                <figure key={m.src} className="proj-model-item">
                  <figcaption className="proj-model-label">{m.label}</figcaption>
                  <ModelViewer src={m.src} alt={m.alt || m.label} poster={m.poster} />
                </figure>
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
