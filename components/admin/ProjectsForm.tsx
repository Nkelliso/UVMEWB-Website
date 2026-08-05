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
                <Field label="Heading" value={sec.heading} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, heading: v } : s)) })} />
                <Field label="Body" value={sec.body} onChange={(v) => upd(i, { sections: p.sections.map((s, j) => (j === si ? { ...s, body: v } : s)) })} textarea />
              </div>
            ))}
            <AddButton label="Add section" onClick={() => upd(i, { sections: [...p.sections, { heading: "", body: "" }] })} />

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
