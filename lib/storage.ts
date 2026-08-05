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

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

/** Detect image type from magic bytes — never trust the client's declared type
 *  or filename extension. Returns a whitelisted MIME or null (reject). */
export function sniffImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "image/png";
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  )
    return "image/webp";
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = buf.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return null;
}

/** Filename derived from the VALIDATED content type — extension can't be spoofed
 *  (no .svg/.html reaching the served folder). */
function safeName(filename: string, contentType?: string): string {
  const ext = MIME_EXT[contentType ?? ""] || ".jpg";
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
  const name = safeName(filename, contentType);
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
