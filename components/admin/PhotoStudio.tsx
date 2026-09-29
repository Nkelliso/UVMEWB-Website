"use client";

import { useCallback, useRef, useState } from "react";
import AdminTopBar from "./AdminTopBar";
import { HERO_CUTOUTS } from "@/lib/hero-cutouts";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { saveSettingsAction, saveProjectsAction } from "@/app/admin/actions";
import type { SiteSettings, Project } from "@/lib/types";

/**
 * Photo studio — part of the /admin backend. Lists every image "slot" on the
 * immersive site with its current photo, and lets an officer Edit/Replace it:
 * choose a source (current photo, upload a new file, or reuse an existing one),
 * crop it, adjust brightness/contrast/saturation, then save. The edited image is
 * baked on a <canvas> and uploaded via /api/upload; the resulting URL is written
 * to the slot (settings.heroImages / settings.sectionImages / project.heroImage).
 */

type SlotKind = "hero" | "section" | "project";
type Slot = {
  id: string;
  label: string;
  kind: SlotKind;
  aspect: number;
  key?: string; // section key
  slug?: string; // project slug
  fallback?: string; // default image when the slot has no /photos/<key>.jpg
};

const SECTION_SLOTS: Slot[] = [
  { id: "hero", label: "Home page: top photo", kind: "hero", aspect: 16 / 9 },
  { id: "projects", label: "Home page: Projects section", kind: "section", key: "projects", aspect: 16 / 9 },
  { id: "giving", label: "Home page: Giving section", kind: "section", key: "giving", aspect: 16 / 9 },
  { id: "join", label: "Home page: Join section", kind: "section", key: "join", aspect: 16 / 9 },
  { id: "about", label: "About page: header", kind: "section", key: "about", aspect: 16 / 9 },
  { id: "mission", label: "Mission statement: header", kind: "section", key: "mission", aspect: 16 / 9, fallback: "/photos/site/rwanda-science-mountain.jpg" },
  { id: "team", label: "Officer board: team photo", kind: "section", key: "team", aspect: 3 / 2, fallback: "/photos/site/team-group.jpg" },
  { id: "projectsHeader", label: "Projects page: header", kind: "section", key: "projectsHeader", aspect: 4 / 3, fallback: "/photos/site/projects-header.jpg" },
  { id: "sponsorsHeader", label: "Sponsors page: header", kind: "section", key: "sponsorsHeader", aspect: 4 / 3, fallback: "/photos/site/rwanda-schoolkids-road.jpg" },
  { id: "contact", label: "Contact page: header", kind: "section", key: "contact", aspect: 16 / 9 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function bakeCrop(
  src: string,
  crop: Area,
  adj: { b: number; c: number; s: number }
): Promise<Blob> {
  const img = await loadImage(src);
  const maxW = 2400;
  const scale = Math.min(1, maxW / crop.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.width * scale);
  canvas.height = Math.round(crop.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.filter = `brightness(${adj.b}%) contrast(${adj.c}%) saturate(${adj.s}%)`;
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.9)
  );
}

export default function PhotoStudio({
  initialSettings,
  initialProjects,
}: {
  initialSettings: SiteSettings;
  initialProjects: Project[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [projects, setProjects] = useState(initialProjects);

  const projectSlots: Slot[] = projects.map((p) => ({
    id: `project:${p.slug}`,
    label: `Project page: ${p.title}`,
    kind: "project",
    slug: p.slug,
    aspect: 16 / 9,
  }));

  const currentUrl = useCallback(
    (slot: Slot): string => {
      if (slot.kind === "hero") return settings.heroImages?.[0] || "/photos/hero.jpg";
      if (slot.kind === "section")
        return settings.sectionImages?.[slot.key!] || slot.fallback || `/photos/${slot.key}.jpg`;
      const p = projects.find((x) => x.slug === slot.slug);
      return p?.heroImage || `/photos/projects/${slot.slug}.jpg`;
    },
    [settings, projects]
  );

  // Editor state
  const [editing, setEditing] = useState<Slot | null>(null);
  const [source, setSource] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(16 / 9);
  const [area, setArea] = useState<Area | null>(null);
  const [adj, setAdj] = useState({ b: 100, c: 100, s: 100 });
  const [gallery, setGallery] = useState<string[] | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  function openEditor(slot: Slot) {
    setEditing(slot);
    setSource(currentUrl(slot));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(slot.aspect);
    setAdj({ b: 100, c: 100, s: 100 });
    setStatus("idle");
    setGallery(null);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setSource(URL.createObjectURL(f));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    e.target.value = "";
  }

  async function openGallery() {
    setGallery([]);
    try {
      const res = await fetch("/api/photos");
      const json = await res.json();
      setGallery(json.images || []);
    } catch {
      setGallery([]);
    }
  }

  async function save() {
    if (!editing || !area) return;
    setStatus("saving");
    try {
      const blob = await bakeCrop(source, area, adj);
      const form = new FormData();
      form.append("file", new File([blob], `${editing.id.replace(/[:]/g, "-")}.jpg`, { type: "image/jpeg" }));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      const url: string = json.url;

      if (editing.kind === "hero") {
        // Send only the changed field; saveSettingsAction merges it onto the
        // latest settings, so edits made elsewhere since this page loaded survive.
        setSettings({ ...settings, heroImages: [url] });
        await saveSettingsAction({ heroImages: [url] });
      } else if (editing.kind === "section") {
        const sectionImages = { ...(settings.sectionImages || {}), [editing.key!]: url };
        setSettings({ ...settings, sectionImages });
        await saveSettingsAction({ sectionImages });
      } else {
        const next = projects.map((p) => (p.slug === editing.slug ? { ...p, heroImage: url } : p));
        setProjects(next);
        await saveProjectsAction(next);
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const allSlots = [...SECTION_SLOTS, ...projectSlots];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-24">
      <AdminTopBar title="Photos" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Photos</h1>
        <p className="text-neutral-600 mb-8 max-w-2xl">
          Every big photo on the site. Click <b>Change photo</b> to upload a new one, or to crop and
          brighten the one that&apos;s there. To change the photos inside a project&apos;s page,
          use Projects.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSlots.map((slot) => (
            <div key={slot.id} className="border border-neutral-300 rounded-lg bg-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl(slot)}
                alt={slot.label}
                className="w-full aspect-video object-cover bg-neutral-200"
              />
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{slot.label}</span>
                <button
                  onClick={() => openEditor(slot)}
                  className="shrink-0 bg-neutral-950 text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-neutral-800"
                >
                  Change photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
              <span className="font-semibold text-sm">{editing.label}</span>
              <button onClick={() => setEditing(null)} className="text-neutral-500 hover:text-neutral-900 text-sm">Cancel</button>
            </div>

            <div className="p-5 space-y-4">
              {editing.kind === "hero" && HERO_CUTOUTS[currentUrl(editing)] && (
                <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  This photo has a 3D depth effect: the people stand in front of the headline. It
                  only works with this exact photo, so saving here (even just a crop) turns it off.
                </p>
              )}
              {/* source controls */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-sm font-semibold border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-900"
                >
                  Upload a new photo
                </button>
                <button
                  onClick={openGallery}
                  className="text-sm font-semibold border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-900"
                >
                  Choose one already uploaded
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
              </div>

              {gallery !== null && (
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-neutral-200 rounded p-2">
                  {gallery.length === 0 && <span className="text-xs text-neutral-400 col-span-4">No photos uploaded yet.</span>}
                  {gallery.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt=""
                      onClick={() => { setSource(url); setGallery(null); setCrop({ x: 0, y: 0 }); setZoom(1); }}
                      className="aspect-video object-cover rounded cursor-pointer hover:ring-2 ring-neutral-900"
                    />
                  ))}
                </div>
              )}

              {/* cropper */}
              <div className="relative w-full h-64 bg-neutral-900 rounded overflow-hidden">
                <Cropper
                  image={source}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, px) => setArea(px)}
                  objectFit="contain"
                  style={{ mediaStyle: { filter: `brightness(${adj.b}%) contrast(${adj.c}%) saturate(${adj.s}%)` } }}
                />
              </div>

              {/* zoom — drag the photo to reposition, zoom to crop. The crop frame
                  is fixed to this slot's natural proportions (no shape picker). */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-neutral-600 w-full">
                  Drag the photo to move it inside the frame. Use Zoom to crop in closer.
                </p>
                <label className="flex items-center gap-2 text-sm text-neutral-600 w-full">
                  Zoom
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="flex-1" />
                </label>
              </div>

              {/* color sliders */}
              <div className="grid grid-cols-3 gap-3">
                {([["b", "Brightness"], ["c", "Contrast"], ["s", "Colour"]] as const).map(([k, label]) => (
                  <label key={k} className="text-sm text-neutral-600">
                    {label}: {adj[k]}%
                    <input
                      type="range" min={50} max={150} step={1} value={adj[k]}
                      onChange={(e) => setAdj((prev) => ({ ...prev, [k]: +e.target.value }))}
                      className="w-full"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-neutral-200">
              {status === "error" ? (
                <span className="text-red-700 text-sm">Couldn&apos;t save. Check your internet and try again.</span>
              ) : (
                <span className="text-sm text-neutral-500">Saving replaces the current photo. You can undo it from Undo a mistake.</span>
              )}
              <button
                onClick={save}
                disabled={status === "saving" || !area}
                className="shrink-0 bg-neutral-950 text-white font-semibold text-sm px-5 py-2.5 rounded hover:bg-neutral-800 disabled:opacity-50"
              >
                {status === "saving" ? "Saving…" : "Save photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
