import "server-only";
import fs from "fs";
import path from "path";
import { isSupabaseConfigured, writeClient, readClient } from "./supabase/server";

/**
 * Image storage adapter. One interface, two backends chosen at runtime:
 *
 *  - Supabase configured → uploads to the `photos` Storage bucket (works in
 *    production / on serverless hosting).
 *  - Otherwise (dev, JSON-fallback) → writes into public/photos/uploads and
 *    returns a /photos/uploads/<name> URL the dev server serves statically.
 *
 * This is the "dev-first, Supabase-ready" seam: build + use locally now, flip to
 * cloud storage by adding Supabase env vars + a public `photos` bucket later.
 * Note: writing to public/ only works in dev — a hosted deploy needs Supabase.
 */

const BUCKET = "photos";
const UPLOAD_DIR = path.join(process.cwd(), "public", "photos", "uploads");
const UPLOAD_URL_BASE = "/photos/uploads";
const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

function safeName(filename: string): string {
  const ext = (path.extname(filename) || ".jpg").toLowerCase();
  const base =
    path
      .basename(filename, path.extname(filename))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "photo";
  return `${base}-${Date.now().toString(36)}${ext}`;
}

export async function saveImage(
  bytes: Buffer,
  filename: string,
  contentType?: string
): Promise<{ url: string }> {
  const name = safeName(filename);
  const client = writeClient();
  if (isSupabaseConfigured() && client) {
    const { error } = await client.storage.from(BUCKET).upload(name, bytes, {
      contentType: contentType || "image/jpeg",
      upsert: true,
    });
    if (error) throw new Error(`storage upload: ${error.message}`);
    const { data } = client.storage.from(BUCKET).getPublicUrl(name);
    return { url: data.publicUrl };
  }
  // dev fallback → write to disk under public/
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, name), bytes);
  return { url: `${UPLOAD_URL_BASE}/${name}` };
}

/** List available image URLs for the picker (newest-ish first). */
export async function listImages(): Promise<string[]> {
  const client = readClient();
  if (isSupabaseConfigured() && client) {
    const { data, error } = await client.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) return [];
    return (data || [])
      .filter((o) => o.name && IMG_RE.test(o.name))
      .map((o) => client.storage.from(BUCKET).getPublicUrl(o.name).data.publicUrl);
  }
  // dev: uploaded files first, then the curated /photos library
  const out: string[] = [];
  const read = (dir: string, urlBase: string) => {
    try {
      for (const f of fs.readdirSync(dir)) if (IMG_RE.test(f)) out.push(`${urlBase}/${f}`);
    } catch {
      /* dir may not exist yet */
    }
  };
  read(UPLOAD_DIR, UPLOAD_URL_BASE);
  read(path.join(process.cwd(), "public", "photos"), "/photos");
  return out;
}
