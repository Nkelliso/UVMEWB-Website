"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const inputClass =
  "mt-1.5 w-full border border-neutral-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900";

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
      <div className="mt-2 flex flex-wrap gap-4 items-start">
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
        <div className="flex-1 min-w-[13rem]">
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
