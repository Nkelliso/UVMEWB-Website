import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Placeholder from "@/components/Placeholder";
import { getProject, getProjects } from "@/lib/store";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: project ? `${project.title} — EWB UVM` : "Project — EWB UVM",
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

  return (
    <PageShell eyebrow={project.eyebrow} title={project.title} narrow={false} image={project.heroImage}>
      <div className="ewb-wrap-narrow" style={{ paddingInline: 0 }}>
        <p className="ewb-lede">{project.summary}</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <span className="ewb-tag">{project.status}</span>
          <span className="ewb-tag" style={{ background: "transparent" }}>
            {project.location}
          </span>
        </div>

        {project.sections.map((s) => (
          <div key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </div>
        ))}

        {project.statusItems.length > 0 && (
          <>
            <h2>Project status</h2>
            <ul>
              {project.statusItems.map((item, i) => (
                <li key={i}>→ {item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {project.stats.length > 0 && (
        <>
          <h2 style={{ marginTop: "var(--space-xl)" }}>By the numbers</h2>
          <div className="ewb-stats">
            {project.stats.map((s, i) => (
              <div className="ewb-stat" key={i}>
                <div className="ewb-stat-val">{s.value}</div>
                <div className="ewb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: "var(--space-xl)" }}>
        <Placeholder
          label="Project photos & map — placeholder · replace via /admin"
          height="14rem"
        />
      </div>

      <div style={{ marginTop: "var(--space-lg)" }}>
        <Link href="/uvm/sponsors" className="ewb-btn ewb-btn-primary">
          Support this project <span aria-hidden>→</span>
        </Link>
      </div>
    </PageShell>
  );
}
