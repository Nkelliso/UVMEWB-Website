"use client";

import { useState } from "react";
import AdminChrome, { Field, ImageField, Row, AddButton } from "./AdminChrome";
import { saveProjectsAction } from "@/app/admin/actions";
import type { Project } from "@/lib/types";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const blankProject = (): Project => ({
  slug: "new-project",
  title: "New Project",
  eyebrow: "Projects",
  location: "",
  status: "Active",
  summary: "",
  heroImage: "",
  sections: [{ heading: "Overview", body: "" }],
  statusItems: [],
  stats: [],
  published: true,
  order: 99,
});

export default function ProjectsForm({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);

  const upd = (i: number, patch: Partial<Project>) =>
    setProjects((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  return (
    <AdminChrome
      title="Projects"
      intro="Each project gets its own page at /projects/[slug]. Photos are placeholders until you add an image URL. Drag order is set by the Order number."
      value={projects}
      onSave={saveProjectsAction}
    >
      {projects.map((p, i) => (
        <details key={i} className="border border-neutral-300 rounded-lg bg-white mb-4" open>
          <summary className="cursor-pointer px-4 py-3 font-semibold flex justify-between items-center">
            <span>{p.title || "(untitled)"}</span>
            <span
              onClick={(e) => {
                e.preventDefault();
                setProjects((ps) => ps.filter((_, j) => j !== i));
              }}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Remove
            </span>
          </summary>
          <div className="px-4 pb-4">
            <Row>
              <Field label="Title" value={p.title} onChange={(v) => upd(i, { title: v })} />
              <Field label="Slug (URL)" value={p.slug} onChange={(v) => upd(i, { slug: slugify(v) })} placeholder="rwanda-water" />
            </Row>
            <Row>
              <Field label="Eyebrow" value={p.eyebrow} onChange={(v) => upd(i, { eyebrow: v })} placeholder="Projects · Rwanda" />
              <Field label="Location" value={p.location} onChange={(v) => upd(i, { location: v })} />
            </Row>
            <Row>
              <Field label="Status label" value={p.status} onChange={(v) => upd(i, { status: v })} placeholder="In design / Active…" />
              <Field label="Order (lower = first)" value={String(p.order)} onChange={(v) => upd(i, { order: Number(v) || 0 })} />
            </Row>
            <Field label="Summary" value={p.summary} onChange={(v) => upd(i, { summary: v })} textarea />
            <ImageField label="Hero image (optional)" value={p.heroImage ?? ""} onChange={(v) => upd(i, { heroImage: v })} />

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">Content sections</p>
            {p.sections.map((sec, si) => (
              <div key={si} className="border border-neutral-200 rounded p-3 mb-2">
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500">Section {si + 1}</span>
                  <button className="text-xs text-red-600" onClick={() => upd(i, { sections: p.sections.filter((_, j) => j !== si) })}>
                    Remove
                  </button>
                </div>
                <Row>
                  <Field label="Heading" value={sec.heading} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, heading: v } : s)) })} />
                  <Field label="Date (timeline layout only)" value={sec.date ?? ""} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, date: v } : s)) })} placeholder="Spring 2024" />
                </Row>
                <Field label="Body" value={sec.body} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, body: v } : s)) })} textarea />
                <ImageField label="Section photo (optional)" value={sec.image ?? ""} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, image: v } : s)) })} />
              </div>
            ))}
            <AddButton label="Add section" onClick={() => upd(i, { sections: [...p.sections, { heading: "", body: "" }] })} />

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">Layout</p>
            <label className="block mb-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Page layout</span>
              <select
                className="w-full border border-neutral-300 rounded px-3 py-2 bg-white"
                value={p.layout ?? "standard"}
                onChange={(e) => upd(i, { layout: e.target.value as Project["layout"] })}
              >
                <option value="standard">Standard: alternating photo + text sections</option>
                <option value="timeline">Timeline: dated entries down a line (past projects)</option>
              </select>
            </label>
            <label className="flex items-center gap-2 mb-3 text-sm">
              <input type="checkbox" checked={!!p.photoSlots} onChange={(e) => upd(i, { photoSlots: e.target.checked })} />
              Show a &quot;photo coming soon&quot; slot beside sections without a photo
            </label>

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">Photo carousel</p>
            {p.gallery === undefined ? (
              <AddButton label="Add a photo carousel to this page" onClick={() => upd(i, { gallery: [] })} />
            ) : (
              <>
                {p.gallery.length === 0 && (
                  <p className="text-sm text-neutral-500 mb-2">No photos yet. The page shows labeled slots until you add some.</p>
                )}
                {p.gallery.map((src, gi) => (
                  <div key={gi} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <ImageField label={`Photo ${gi + 1}`} value={src} onChange={(v) => upd(i, { gallery: p.gallery!.map((x, j) => (j === gi ? v : x)) })} />
                    </div>
                    <button className="text-xs text-red-600 mt-6" onClick={() => upd(i, { gallery: p.gallery!.filter((_, j) => j !== gi) })}>
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-4">
                  <AddButton label="Add photo" onClick={() => upd(i, { gallery: [...p.gallery!, ""] })} />
                  <button className="text-xs text-red-600" onClick={() => upd(i, { gallery: undefined })}>
                    Remove carousel
                  </button>
                </div>
              </>
            )}

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">3D models</p>
            {(p.models ?? []).map((m, mi) => (
              <div key={mi} className="border border-neutral-200 rounded p-3 mb-2">
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500">Model {mi + 1}</span>
                  <button className="text-xs text-red-600" onClick={() => upd(i, { models: (p.models ?? []).filter((_, j) => j !== mi) })}>
                    Remove
                  </button>
                </div>
                <Row>
                  <Field label="Label" value={m.label} onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, label: v } : x)) })} />
                  <Field label="File URL (.glb)" value={m.src} onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, src: v } : x)) })} placeholder="/models/School%20Kitchen.glb" />
                </Row>
                <Field label="Description (for screen readers)" value={m.alt ?? ""} onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, alt: v } : x)) })} />
              </div>
            ))}
            <AddButton label="Add 3D model" onClick={() => upd(i, { models: [...(p.models ?? []), { src: "", label: "" }] })} />

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">Status checklist</p>
            {p.statusItems.map((item, ii) => (
              <div key={ii} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border border-neutral-300 rounded px-3 py-2 bg-white"
                  value={item}
                  onChange={(e) => upd(i, { statusItems: p.statusItems.map((x, j) => (j === ii ? e.target.value : x)) })}
                />
                <button className="text-xs text-red-600" onClick={() => upd(i, { statusItems: p.statusItems.filter((_, j) => j !== ii) })}>
                  ✕
                </button>
              </div>
            ))}
            <AddButton label="Add status item" onClick={() => upd(i, { statusItems: [...p.statusItems, ""] })} />

            <p className="text-xs uppercase tracking-wide text-neutral-500 mt-4 mb-2">Stats (by the numbers)</p>
            {p.stats.map((st, sti) => (
              <Row key={sti}>
                <Field label="Value" value={st.value} onChange={(v) => upd(i, { stats: p.stats.map((x, j) => (j === sti ? { ...x, value: v } : x)) })} />
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Field label="Label" value={st.label} onChange={(v) => upd(i, { stats: p.stats.map((x, j) => (j === sti ? { ...x, label: v } : x)) })} />
                  </div>
                  <button className="text-xs text-red-600 mb-4" onClick={() => upd(i, { stats: p.stats.filter((_, j) => j !== sti) })}>
                    ✕
                  </button>
                </div>
              </Row>
            ))}
            <AddButton label="Add stat" onClick={() => upd(i, { stats: [...p.stats, { value: "", label: "" }] })} />

            <label className="flex items-center gap-2 mt-4 text-sm">
              <input type="checkbox" checked={p.published} onChange={(e) => upd(i, { published: e.target.checked })} />
              Published (visible on the site & in the nav)
            </label>
          </div>
        </details>
      ))}
      <AddButton label="Add project" onClick={() => setProjects((ps) => [...ps, blankProject()])} />
    </AdminChrome>
  );
}
