"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";

/** Shared admin editing chrome: top bar, title, and a sticky save button that
 *  calls the provided async save function and shows status. */
export default function AdminChrome<T>({
  title,
  intro,
  value,
  onSave,
  children,
}: {
  title: string;
  intro?: string;
  value: T;
  onSave: (value: T) => Promise<{ ok: boolean }>;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function save() {
    setStatus("saving");
    try {
      await onSave(value);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-32">
      <div className="flex justify-between items-center px-8 py-4 bg-neutral-950 sticky top-0 z-10">
        <div className="flex gap-4 items-center">
          <Link href="/admin" className="text-neutral-400 text-sm hover:text-white">
            ← Admin
          </Link>
          <span className="text-white font-bold text-sm">{title}</span>
        </div>
        <div className="flex gap-4 items-center">
          {status === "saved" && (
            <span className="text-green-400 text-sm">Saved ✓</span>
          )}
          {status === "error" && (
            <span className="text-red-400 text-sm">Save failed</span>
          )}
          <button
            onClick={save}
            disabled={status === "saving"}
            className="bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wide px-5 py-2.5 rounded hover:bg-neutral-200 disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
        {intro && <p className="text-sm text-neutral-500 mb-8">{intro}</p>}
        {children}
      </div>
    </div>
  );
}

/* ── Small reusable inputs (plain, admin-only styling) ─────────── */

export function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
        {label}
      </span>
      {textarea ? (
        <textarea
          className="w-full border border-neutral-300 rounded px-3 py-2 bg-white"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full border border-neutral-300 rounded px-3 py-2 bg-white"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

/** Image field: paste a URL or upload a file (uploaded via /api/upload → the
 *  returned URL is written back). A thumbnail previews the current value. For
 *  the crop/color studio use /admin/photos; this inline control is a quick swap. */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) onChange(json.url);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <label className="block mb-3">
      <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
        {label}
      </span>
      <div className="flex gap-3 items-start">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-20 h-20 object-cover rounded border border-neutral-300 shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded border border-neutral-300 bg-neutral-100 grid place-items-center text-[10px] text-neutral-400 shrink-0">
            none
          </div>
        )}
        <div className="flex-1">
          <input
            className="w-full border border-neutral-300 rounded px-3 py-2 bg-white"
            value={value}
            placeholder="paste an image URL, or upload →"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="text-xs font-semibold border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-900 disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload file"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-neutral-500 hover:text-red-600 px-2 py-1.5"
              >
                Clear
              </button>
            )}
          </div>
          <input ref={ref} type="file" accept="image/*" hidden onChange={upload} />
        </div>
      </div>
    </label>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

export function Card({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="relative border border-neutral-300 rounded-lg bg-white p-4 mb-3">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 text-xs text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      )}
      {children}
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-semibold text-neutral-700 border border-dashed border-neutral-400 rounded px-4 py-2 hover:border-neutral-900 hover:text-neutral-900 mb-6"
    >
      + {label}
    </button>
  );
}
