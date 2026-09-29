import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Placeholder from "@/components/Placeholder";
import { getProjects } from "@/lib/store";

export const metadata: Metadata = {
  title: "Projects · EWB UVM",
  description:
    "International, domestic, and local engineering projects run by the EWB UVM chapter.",
};

// Cards show photos ~390px wide, but uploads are often 2400px+. Letting the
// browser shrink them ~6x on the fly aliases fine detail, so resize through
// Next's optimizer instead. Only local and Supabase paths are allowlisted
// (next.config.ts); any other pasted URL renders as-is rather than erroring.
const canOptimize = (src: string) =>
  src.startsWith("/") || /^https:\/\/[^/]+\.supabase\.co\//.test(src);

export default async function ProjectsIndex() {
  const projects = (await getProjects())
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  return (
    <PageShell title="Our work" narrow={false} image="/photos/site/projects-header.jpg">
      <p className="ewb-lede">
        From a clean-water pipeline in Rwanda to stormwater work in the
        Northeast and volunteering across Vermont, every project is designed
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
