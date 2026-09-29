"use client";

import { useState } from "react";
import AdminChrome, {
  Field,
  ImageField,
  Row,
  Card,
  AddButton,
  Checkbox,
  Section,
  Advanced,
  MoveButtons,
} from "./AdminChrome";
import { useEditable, move } from "./useEditable";
import { saveProjectsAction } from "@/app/admin/actions";
import type { Project, ProjectSection } from "@/lib/types";
import { DEFAULT_MODELS_CAPTION } from "@/lib/project-defaults";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// eyebrow / location / statusItems / stats are kept in the data for older
// pages but aren't shown anywhere on the site, so the form doesn't ask for them.
const blankProject = (): Project => ({
  slug: "new-project",
  title: "New project",
  eyebrow: "",
  location: "",
  status: "",
  summary: "",
  heroImage: "",
  sections: [{ heading: "Overview", body: "" }],
  statusItems: [],
  stats: [],
  published: false,
  order: 99,
});

const FOCUS_OPTIONS = [
  { value: "", label: "Middle of the photo (default)" },
  { value: "center 15%", label: "Top of the photo" },
  { value: "center 35%", label: "Upper part of the photo" },
  { value: "center 65%", label: "Lower part of the photo" },
  { value: "center 85%", label: "Bottom of the photo" },
];

const selectClass =
  "mt-1.5 w-full border border-neutral-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900";

export default function ProjectsForm({ initial }: { initial: Project[] }) {
  const sorted = [...initial].sort((a, b) => a.order - b.order);
  const editor = useEditable<Project[]>(sorted);
  const projects = editor.value;
  const [open, setOpen] = useState<number | null>(null);
  const [savedSlugs] = useState(() => new Set(initial.map((p) => p.slug)));

  const upd = (i: number, patch: Partial<Project>, label?: string) =>
    editor.change(projects.map((p, j) => (j === i ? { ...p, ...patch } : p)), label);

  const updSection = (i: number, si: number, patch: Partial<ProjectSection>) =>
    upd(i, { sections: projects[i].sections.map((s, j) => (j === si ? { ...s, ...patch } : s)) });

  const moveProject = (i: number, dir: -1 | 1) => {
    editor.change(move(projects, i, dir), `Moved ${projects[i].title}`);
    if (open === i) setOpen(i + dir);
    else if (open === i + dir) setOpen(i);
  };

  const removeProject = (i: number) => {
    editor.change(projects.filter((_, j) => j !== i), `Removed ${projects[i].title || "project"}`);
    setOpen(null);
  };

  // The site sorts projects by `order`; the arrows here set it for you.
  const save = (list: Project[]) =>
    saveProjectsAction(list.map((p, i) => ({ ...p, order: i + 1 })));

  return (
    <AdminChrome
      title="Projects"
      editor={editor}
      onSave={save}
      viewHref="/projects"
      intro={
        <p>
          Each project has its own page and a card on the Projects page. Click a project to edit
          it. Use the arrows to change the order they appear in on the site and in the menu.
        </p>
      }
    >
      {projects.map((p, i) => {
        const isOpen = open === i;
        const isNew = !savedSlugs.has(p.slug);
        const dupSlug = projects.some((q, j) => j !== i && q.slug === p.slug);
        const focusKnown = FOCUS_OPTIONS.some((o) => o.value === (p.heroPosition ?? ""));
        return (
          <div key={i} className="border border-neutral-300 rounded-lg bg-white mb-3">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                {p.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.heroImage} alt="" className="w-16 h-12 object-cover rounded shrink-0" />
                ) : (
                  <span className="w-16 h-12 rounded bg-neutral-100 border border-dashed border-neutral-300 shrink-0" />
                )}
                <span className="min-w-0">
                  <span className="block font-semibold truncate">{p.title || "(no name yet)"}</span>
                  <span className="block text-sm text-neutral-500">
                    {p.published ? "Shown on the site" : "Hidden from the site"}
                    {p.status ? ` · ${p.status}` : ""}
                  </span>
                </span>
                <span className="ml-auto text-sm text-neutral-500 shrink-0">{isOpen ? "Close ▲" : "Edit ▼"}</span>
              </button>
              <MoveButtons
                what={p.title}
                onUp={() => moveProject(i, -1)}
                onDown={() => moveProject(i, 1)}
                isFirst={i === 0}
                isLast={i === projects.length - 1}
              />
            </div>

            {isOpen && (
              <div className="px-5 pb-6 pt-2 border-t border-neutral-200">
                <div className="flex justify-end gap-4 text-sm mb-4">
                  {!isNew && p.published && (
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" className="underline text-neutral-600 hover:text-neutral-900">
                      See this project on the site ↗
                    </a>
                  )}
                  <button type="button" onClick={() => removeProject(i)} className="text-red-700 hover:text-red-900">
                    Delete this project
                  </button>
                </div>

                <Section title="The basics">
                  <Field
                    label="Project name"
                    hint="The big title on the project's page and its card."
                    value={p.title}
                    onChange={(v) =>
                      upd(i, isNew ? { title: v, slug: slugify(v) || "new-project" } : { title: v })
                    }
                  />
                  <Field
                    label="Short description"
                    hint="One or two sentences that show on this project's card on the Projects page."
                    value={p.summary}
                    onChange={(v) => upd(i, { summary: v })}
                    textarea
                  />
                  <Row>
                    <Field
                      label="Tag on the card"
                      hint="A word or two like Active or In design. Leave blank for no tag."
                      value={p.status}
                      onChange={(v) => upd(i, { status: v })}
                    />
                    <Field
                      label="Name in the site menu"
                      hint="A shorter name for the Projects menu. Leave blank to use the project name."
                      value={p.navLabel ?? ""}
                      placeholder={p.title}
                      onChange={(v) => upd(i, { navLabel: v || undefined })}
                    />
                  </Row>
                  <Checkbox
                    label="Show this project on the website"
                    hint="Untick to hide it from the site and the menu without deleting it."
                    checked={p.published}
                    onChange={(v) => upd(i, { published: v })}
                  />
                </Section>

                <Section title="Header photo">
                  <ImageField
                    label="Header photo"
                    hint="The big photo at the top of the project's page. It's also the photo on its card."
                    value={p.heroImage ?? ""}
                    onChange={(v) => upd(i, { heroImage: v })}
                  />
                  <label className="block mb-5">
                    <span className="block text-sm font-semibold text-neutral-800">Which part of the photo to keep in view</span>
                    <span className="block text-sm text-neutral-500 mt-0.5">
                      The header is a wide strip, so part of the photo gets trimmed. If heads are cut off, try another option.
                    </span>
                    <select
                      className={selectClass}
                      value={p.heroPosition ?? ""}
                      onChange={(e) => upd(i, { heroPosition: e.target.value || undefined })}
                    >
                      {!focusKnown && <option value={p.heroPosition}>Custom setting ({p.heroPosition})</option>}
                      {FOCUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </Section>

                <Section
                  title="Page sections"
                  hint="The main text of the project page, top to bottom. Each section has a heading, some text, and an optional photo."
                >
                  <label className="block mb-5">
                    <span className="block text-sm font-semibold text-neutral-800">How the sections are laid out</span>
                    <select
                      className={selectClass}
                      value={p.layout ?? "standard"}
                      onChange={(e) => upd(i, { layout: e.target.value as Project["layout"] })}
                    >
                      <option value="standard">Photos and text side by side, alternating</option>
                      <option value="timeline">Timeline: dated entries down a line (good for past projects)</option>
                    </select>
                  </label>
                  {p.sections.map((sec, si) => (
                    <Card
                      key={si}
                      title={`Section ${si + 1}${sec.heading ? `: ${sec.heading}` : ""}`}
                      move={
                        <MoveButtons
                          what={`section ${si + 1}`}
                          onUp={() => upd(i, { sections: move(p.sections, si, -1) }, `Moved a section`)}
                          onDown={() => upd(i, { sections: move(p.sections, si, 1) }, `Moved a section`)}
                          isFirst={si === 0}
                          isLast={si === p.sections.length - 1}
                        />
                      }
                      onRemove={() =>
                        upd(i, { sections: p.sections.filter((_, j) => j !== si) }, `Removed section "${sec.heading || si + 1}"`)
                      }
                    >
                      <Field label="Heading" value={sec.heading} onChange={(v) => updSection(i, si, { heading: v })} />
                      {p.layout === "timeline" && (
                        <Field
                          label="Date"
                          hint="Shown on the timeline, for example Spring 2024."
                          value={sec.date ?? ""}
                          onChange={(v) => updSection(i, si, { date: v })}
                        />
                      )}
                      <Field label="Text" value={sec.body} onChange={(v) => updSection(i, si, { body: v })} textarea rows={5} />
                      <ImageField
                        label="Photo for this section (optional)"
                        value={sec.image ?? ""}
                        onChange={(v) => updSection(i, si, { image: v })}
                      />
                    </Card>
                  ))}
                  <AddButton
                    label="Add a section"
                    onClick={() => upd(i, { sections: [...p.sections, { heading: "", body: "" }] }, "Added a section")}
                  />
                  <Checkbox
                    label={'Show a "photo coming soon" box next to sections without a photo'}
                    hint="This keeps the side-by-side look while you wait for photos."
                    checked={!!p.photoSlots}
                    onChange={(v) => upd(i, { photoSlots: v })}
                  />
                </Section>

                <Section title="Photo slideshow" hint="A set of photos visitors can click through, near the bottom of the page.">
                  {p.gallery === undefined ? (
                    <AddButton label="Add a photo slideshow to this page" onClick={() => upd(i, { gallery: [] }, "Added a slideshow")} />
                  ) : (
                    <>
                      {p.gallery.length === 0 && (
                        <p className="text-sm text-neutral-500 mb-3">
                          No photos yet. Until you add some, the page shows empty labeled boxes.
                        </p>
                      )}
                      {p.gallery.map((src, gi) => (
                        <Card
                          key={gi}
                          title={`Photo ${gi + 1}`}
                          move={
                            <MoveButtons
                              what={`photo ${gi + 1}`}
                              onUp={() => upd(i, { gallery: move(p.gallery!, gi, -1) }, "Moved a photo")}
                              onDown={() => upd(i, { gallery: move(p.gallery!, gi, 1) }, "Moved a photo")}
                              isFirst={gi === 0}
                              isLast={gi === p.gallery!.length - 1}
                            />
                          }
                          onRemove={() => upd(i, { gallery: p.gallery!.filter((_, j) => j !== gi) }, `Removed photo ${gi + 1}`)}
                        >
                          <ImageField
                            label="Photo"
                            value={src}
                            onChange={(v) => upd(i, { gallery: p.gallery!.map((x, j) => (j === gi ? v : x)) })}
                          />
                        </Card>
                      ))}
                      <div className="flex flex-wrap gap-4 items-start">
                        <AddButton label="Add a photo" onClick={() => upd(i, { gallery: [...p.gallery!, ""] }, "Added a photo")} />
                        <button
                          type="button"
                          className="text-sm text-red-700 hover:text-red-900 py-2"
                          onClick={() => upd(i, { gallery: undefined }, "Removed the slideshow")}
                        >
                          Remove the whole slideshow
                        </button>
                      </div>
                    </>
                  )}
                </Section>

                <Section title="3D models" hint="Interactive 3D scans visitors can spin around. Most projects won't have these.">
                  {(p.models ?? []).length > 0 && (
                    <Field
                      label="Caption under the 3D models heading"
                      hint="Leave it as is to keep the default. Delete all the text to show no caption."
                      value={p.modelsCaption ?? DEFAULT_MODELS_CAPTION}
                      onChange={(v) => upd(i, { modelsCaption: v })}
                    />
                  )}
                  {(p.models ?? []).map((m, mi) => (
                    <Card
                      key={mi}
                      title={m.label || `Model ${mi + 1}`}
                      onRemove={() => upd(i, { models: (p.models ?? []).filter((_, j) => j !== mi) }, `Removed model "${m.label || mi + 1}"`)}
                    >
                      <Field
                        label="Name shown above the model"
                        value={m.label}
                        onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, label: v } : x)) })}
                      />
                      <Field
                        label="Model file link (.glb)"
                        hint="Ask whoever made the scan for this link."
                        value={m.src}
                        placeholder="/models/School%20Kitchen.glb"
                        onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, src: v } : x)) })}
                      />
                      <Field
                        label="Describe the model in one sentence"
                        hint="Screen readers read this aloud to visitors who can't see the model."
                        value={m.alt ?? ""}
                        onChange={(v) => upd(i, { models: (p.models ?? []).map((x, j) => (j === mi ? { ...x, alt: v } : x)) })}
                      />
                    </Card>
                  ))}
                  <AddButton label="Add a 3D model" onClick={() => upd(i, { models: [...(p.models ?? []), { src: "", label: "" }] }, "Added a 3D model")} />
                </Section>

                <Advanced>
                  <Field
                    label="Web address"
                    hint={
                      isNew
                        ? "This fills in from the project name. The page will live at /projects/ followed by this."
                        : "The end of this project's link (/projects/…). Changing it breaks links people already have, so leave it unless you're sure."
                    }
                    value={p.slug}
                    onChange={(v) => upd(i, { slug: slugify(v) })}
                  />
                  {dupSlug && (
                    <p className="text-sm text-red-700 -mt-3 mb-4">
                      Another project already uses this web address. Change one of them before saving.
                    </p>
                  )}
                </Advanced>
              </div>
            )}
          </div>
        );
      })}
      <AddButton
        label="Add a project"
        onClick={() => {
          editor.change([...projects, blankProject()], "Added a project");
          setOpen(projects.length);
        }}
      />
      <p className="text-sm text-neutral-500">
        New projects start hidden. Tick &quot;Show this project on the website&quot; when it&apos;s ready.
      </p>
    </AdminChrome>
  );
}
