"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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
};

const SECTION_SLOTS: Slot[] = [
  { id: "hero", label: "Home — Hero", kind: "hero", aspect: 16 / 9 },
  { id: "projects", label: "Home — Projects band", kind: "section", key: "projects", aspect: 16 / 9 },
  { id: "giving", label: "Home — Giving band", kind: "section", key: "giving", aspect: 16 / 9 },
  { id: "join", label: "Home — Join band", kind: "section", key: "join", aspect: 16 / 9 },
  { id: "about", label: "About header", kind: "section", key: "about", aspect: 16 / 9 },
  { id: "sponsors", label: "Sponsors header", kind: "section", key: "sponsors", aspect: 16 / 9 },
  { id: "contact", label: "Contact header", kind: "section", key: "contact", aspect: 16 / 9 },
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
    label: `Project — ${p.title}`,
    kind: "project",
    slug: p.slug,
    aspect: 16 / 9,
  }));

  const currentUrl = useCallback(
    (slot: Slot): string => {
      if (slot.kind === "hero") return settings.heroImages?.[0] || "/photos/hero.jpg";
      if (slot.kind === "section")
        return settings.sectionImages?.[slot.key!] || `/photos/${slot.key}.jpg`;
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
        const next = { ...settings, heroImages: [url] };
        setSettings(next);
        await saveSettingsAction(next);
      } else if (editing.kind === "section") {
        const next = {
          ...settings,
          sectionImages: { ...(settings.sectionImages || {}), [editing.key!]: url },
        };
        setSettings(next);
        await saveSettingsAction(next);
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
      <div className="flex justify-between items-center px-8 py-4 bg-neutral-950 sticky top-0 z-10">
        <div className="flex gap-4 items-center">
          <Link href="/admin" className="text-neutral-400 text-sm hover:text-white">← Admin</Link>
          <span className="text-white font-bold text-sm">Photos</span>
        </div>
        <Link href="/" className="text-neutral-400 text-sm hover:text-white">View site</Link>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Photos</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Every photo position on the Cal Poly (immersive) site. Click a slot to upload a new
          photo or edit the current one — crop it, adjust the color, and save.
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
                  className="shrink-0 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded hover:bg-neutral-800"
                >
                  Edit / Replace
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
              {/* source controls */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs font-semibold border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-900"
                >
                  Upload new file
                </button>
                <button
                  onClick={openGallery}
                  className="text-xs font-semibold border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-900"
                >
                  Reuse existing photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
              </div>

              {gallery !== null && (
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-neutral-200 rounded p-2">
                  {gallery.length === 0 && <span className="text-xs text-neutral-400 col-span-4">No photos found.</span>}
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
                <label className="flex items-center gap-2 text-xs text-neutral-500 w-full">
                  Zoom
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="flex-1" />
                </label>
              </div>

              {/* color sliders */}
              <div className="grid grid-cols-3 gap-3">
                {([["b", "Brightness"], ["c", "Contrast"], ["s", "Saturation"]] as const).map(([k, label]) => (
                  <label key={k} className="text-xs text-neutral-500">
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
                <span className="text-red-600 text-sm">Save failed — try again.</span>
              ) : (
                <span className="text-xs text-neutral-400">Saved photos replace the one currently in this slot.</span>
              )}
              <button
                onClick={save}
                disabled={status === "saving" || !area}
                className="bg-neutral-950 text-white font-semibold text-xs uppercase tracking-wide px-5 py-2.5 rounded hover:bg-neutral-800 disabled:opacity-50"
              >
                {status === "saving" ? "Saving…" : "Save to this slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
