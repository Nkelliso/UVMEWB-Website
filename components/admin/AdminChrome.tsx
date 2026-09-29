"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Editable } from "./useEditable";

/** Shared admin editing screen: a sticky bar with Save / Undo / Discard, an
 *  unsaved-changes warning, and a plain-English title + intro. Every admin form
 *  wraps itself in this so they all behave the same way. */
export default function AdminChrome<T>({
  title,
  intro,
  editor,
  onSave,
  viewHref,
  children,
}: {
  title: string;
  intro?: ReactNode;
  editor: Editable<T>;
  onSave: (value: T) => Promise<{ ok: boolean }>;
  /** Link to the public page this screen edits ("See this page on the site"). */
  viewHref?: string;
  children: ReactNode;
}) {
  const [saved, setSaved] = useState(() => JSON.stringify(editor.value));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const current = JSON.stringify(editor.value);
  const dirty = current !== saved;

  // Warn before closing the tab or leaving with unsaved edits. "All sections"
  // is a plain <a> (not next/link) so this warning also fires for it.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setStatus("saving");
    try {
      await onSave(editor.value);
      setSaved(current);
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  let message: ReactNode;
  if (status === "saving") message = <span className="text-neutral-300">Saving…</span>;
  else if (status === "error")
    message = (
      <span className="text-red-300">
        Couldn&apos;t save. Check your internet and try again. Your edits are still here.
      </span>
    );
  else if (dirty) message = <span className="text-amber-300">You have unsaved changes</span>;
  else if (status === "saved")
    message = <span className="text-green-300">Saved. It&apos;s live on the website.</span>;
  else message = <span className="text-neutral-400">No unsaved changes</span>;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-32">
      <div className="sticky top-0 z-20 bg-neutral-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-between items-center">
          <div className="flex gap-4 items-center">
            <a href="/admin" className="text-neutral-400 text-sm hover:text-white">
              ← All sections
            </a>
            <span className="font-bold text-sm">{title}</span>
          </div>
          <div className="flex flex-wrap gap-3 items-center text-sm">
            <span aria-live="polite">{message}</span>
            {editor.canUndo && (
              <button
                onClick={editor.undo}
                className="text-neutral-200 border border-neutral-600 rounded px-3 py-1.5 hover:border-white max-w-56 truncate"
                title={`Undo: ${editor.undoLabel}`}
              >
                ↶ Undo: {editor.undoLabel}
              </button>
            )}
            {dirty && status !== "saving" && (
              <button
                onClick={() => {
                  editor.reset(JSON.parse(saved));
                  setStatus("idle");
                }}
                className="text-neutral-300 hover:text-white px-2 py-1.5"
              >
                Discard changes
              </button>
            )}
            <button
              onClick={save}
              disabled={!dirty || status === "saving"}
              className="bg-white text-neutral-950 font-semibold rounded px-5 py-2 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <div className="flex gap-4 text-sm">
            {viewHref && (
              <a href={viewHref} target="_blank" rel="noreferrer" className="text-neutral-600 underline hover:text-neutral-900">
                See this page on the site ↗
              </a>
            )}
            <a
              href="/admin/help"
              target="_blank"
              className="font-semibold bg-amber-300 text-neutral-950 rounded px-2.5 py-0.5 hover:bg-amber-400"
            >
              How to edit the site
            </a>
          </div>
        </div>
        {intro && <div className="text-neutral-600 mb-8 max-w-2xl">{intro}</div>}
        {children}
      </div>
    </div>
  );
}

/* ── Building blocks (plain, admin-only styling) ─────────────────── */

const inputClass =
  "mt-1.5 w-full border border-neutral-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900";

export function Field({
  label,
  hint,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
  suggestions,
}: {
  label: string;
  /** One plain sentence: what this is and where it shows on the site. */
  hint?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  /** Offer these as type-ahead suggestions (e.g. existing sponsor groups). */
  suggestions?: string[];
}) {
  const listId = useId();
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold text-neutral-800">{label}</span>
      {hint && <span className="block text-sm text-neutral-500 mt-0.5">{hint}</span>}
      {textarea ? (
        <textarea
          className={inputClass}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          placeholder={placeholder}
          list={suggestions?.length ? listId : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {suggestions?.length ? (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      ) : null}
    </label>
  );
}

export function Checkbox({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex gap-3 items-start mb-5 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-semibold text-neutral-800">{label}</span>
        {hint && <span className="block text-sm text-neutral-500">{hint}</span>}
      </span>
    </label>
  );
}

/** A titled group of fields on a form. */
export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {hint && <p className="text-sm text-neutral-500 mt-1 mb-4">{hint}</p>}
      {!hint && <div className="mb-4" />}
      {children}
    </section>
  );
}

/** Tucked-away options most people never need. */
export function Advanced({ children }: { children: ReactNode }) {
  return (
    <details className="mt-2 mb-5 border border-dashed border-neutral-300 rounded-md px-4 py-3">
      <summary className="cursor-pointer text-sm font-semibold text-neutral-600">
        More options (rarely needed)
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-x-4">{children}</div>;
}

export function MoveButtons({
  onUp,
  onDown,
  isFirst,
  isLast,
  what,
}: {
  onUp: () => void;
  onDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  /** Read out to screen readers: "Move Kajinge, Rwanda up". */
  what: string;
}) {
  const btn =
    "w-8 h-8 grid place-items-center rounded border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed";
  return (
    <span className="inline-flex gap-1">
      <button type="button" className={btn} onClick={onUp} disabled={isFirst} aria-label={`Move ${what} up`} title="Move up">
        ↑
      </button>
      <button type="button" className={btn} onClick={onDown} disabled={isLast} aria-label={`Move ${what} down`} title="Move down">
        ↓
      </button>
    </span>
  );
}

/** A bordered box for one item in a list (a sponsor, an officer…). */
export function Card({
  title,
  onRemove,
  removeLabel = "Remove",
  move,
  children,
}: {
  title?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  move?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border border-neutral-300 rounded-lg bg-white p-4 mb-3">
      {(title || onRemove || move) && (
        <div className="flex justify-between items-center gap-3 mb-3">
          <span className="font-semibold text-neutral-800">{title}</span>
          <span className="flex gap-3 items-center">
            {move}
            {onRemove && (
              <button type="button" onClick={onRemove} className="text-sm text-red-700 hover:text-red-900">
                {removeLabel}
              </button>
            )}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-semibold text-neutral-700 border border-dashed border-neutral-400 rounded-md px-4 py-2 hover:border-neutral-900 hover:text-neutral-900 mb-6"
    >
      + {label}
    </button>
  );
}

/* ── Photos ───────────────────────────────────────────────────────── */

// Vercel rejects request bodies over ~4.5 MB before our upload route runs, so
// photos are shrunk here, in the browser, before they're sent.
const UPLOAD_LIMIT = 4 * 1024 * 1024;
const MAX_EDGE = 2400;

/** Resize a phone photo to web size (longest side 2400px) and re-save it as a
 *  JPEG. Re-saving also drops hidden photo metadata, including GPS location.
 *  PNGs (logos with transparent backgrounds) and anything the browser can't
 *  read are sent unchanged. */
async function shrinkForWeb(file: File): Promise<File> {
  if (!/^image\/(jpeg|webp|heic|heif)$/i.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/** Pick a photo: upload one, choose one already uploaded, or (rarely) paste a
 *  web link. Warns when a photo is too small to look sharp on the site. */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  minWidth = 1200,
}: {
  label: string;
  hint?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  /** Warn below this pixel width. 0 turns the warning off (logos, icons). */
  minWidth?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [picking, setPicking] = useState(false);
  const [size, setSize] = useState<{ src: string; w: number; h: number } | null>(null);
  const [broken, setBroken] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setBusy(true);
    setError(null);
    try {
      const f = await shrinkForWeb(picked);
      if (f.size > UPLOAD_LIMIT) {
        setError(
          "This file is too big to upload (over 4 MB). Save it as a JPEG or use a smaller copy, then try again."
        );
        return;
      }
      const form = new FormData();
      form.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) {
        onChange(json.url);
      } else {
        setError(json.error || "Upload failed.");
      }
    } catch {
      setError("Upload failed. Check your internet connection and try again.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const known = size?.src === value ? size : null;
  const tooSmall = minWidth > 0 && known && known.w < minWidth;
  const small = "text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 bg-white hover:border-neutral-900 disabled:opacity-50";

  return (
    <div className="mb-5">
      <span className="block text-sm font-semibold text-neutral-800">{label}</span>
      {hint && <span className="block text-sm text-neutral-500 mt-0.5">{hint}</span>}
      <div className="mt-2 flex gap-4 items-start">
        {value && broken !== value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={value}
            src={value}
            alt=""
            onLoad={(e) =>
              setSize({ src: value, w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            onError={() => setBroken(value)}
            className="w-32 h-24 object-cover rounded-md border border-neutral-300 shrink-0 bg-neutral-100"
          />
        ) : (
          <div className="w-32 h-24 rounded-md border border-dashed border-neutral-300 bg-neutral-50 grid place-items-center text-xs text-neutral-500 text-center px-2 shrink-0">
            {value ? "Can't load this photo" : "No photo yet"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className={small}>
              {busy ? "Uploading…" : "Upload a photo"}
            </button>
            <button type="button" onClick={() => setPicking(true)} className={small}>
              Choose one already uploaded
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="text-sm text-red-700 hover:text-red-900 px-2 py-1.5">
                Remove photo
              </button>
            )}
          </div>
          {known && (
            <p className="text-xs text-neutral-500 mt-2">
              {known.w} × {known.h} pixels
            </p>
          )}
          {tooSmall && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2">
              This photo is small ({known!.w} pixels wide), so it may look blurry on the site. If
              you can, get the original. AirDrop keeps the full size, and so does downloading the
              original file from Google Drive or iCloud. Texting a photo shrinks it.
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowLink((s) => !s)}
            className="text-xs text-neutral-500 underline mt-2"
          >
            {showLink ? "Hide web link" : "Use a web link instead"}
          </button>
          {showLink && (
            <input
              className={inputClass}
              value={value}
              placeholder="https://…"
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          <input ref={ref} type="file" accept="image/*" hidden onChange={upload} />
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
      </div>
      {picking && (
        <PhotoPicker
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

function PhotoPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setImages(j.images ?? []))
      .catch(() => setFailed(true));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Choose a photo"
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-200">
          <p className="font-bold">Choose a photo</p>
          <button type="button" onClick={onClose} className="text-sm text-neutral-600 hover:text-neutral-900">
            Close
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          {failed && <p className="text-sm text-red-700">Couldn&apos;t load the photo list. Try again in a moment.</p>}
          {!failed && images === null && <p className="text-sm text-neutral-500">Loading photos…</p>}
          {images?.length === 0 && <p className="text-sm text-neutral-500">No photos uploaded yet.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images?.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => onPick(src)}
                className="aspect-[4/3] rounded-md overflow-hidden border border-neutral-200 hover:ring-2 hover:ring-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900"
                title={decodeURIComponent(src.split("/").pop() ?? src)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
