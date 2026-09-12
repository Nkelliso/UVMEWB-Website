import "server-only";
import fs from "fs";
import path from "path";
import { readClient, writeClient, isWriteMisconfigured } from "./supabase/server";
import {
  SEED_SETTINGS,
  SEED_OFFICERS,
  SEED_PROJECTS,
  SEED_SPONSORS,
  SEED_PAGES,
} from "./seed";
import type {
  OfficerBoard,
  Project,
  Sponsor,
  SiteSettings,
  ContactSubmission,
  PuckData,
} from "./types";

/**
 * Content store. Editable content lives in a single Supabase table
 * `content(key text primary key, value jsonb)` keyed by strings like
 * "settings", "officers", "projects", "sponsors", "page:home".
 *
 * When Supabase is not configured, the exact same shapes are read from / written
 * to JSON files under /data, so the whole site (including the editor) works with
 * zero external services during development.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function filePath(key: string): string {
  return path.join(DATA_DIR, `${key.replace(/:/g, "__")}.json`);
}

async function getContent<T>(key: string, fallback: T): Promise<T> {
  const client = readClient();
  if (client) {
    const { data, error } = await client
      .from("content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) console.error(`[store] read ${key}:`, error.message);
    return (data?.value as T) ?? fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath(key), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

const WRITE_MISCONFIGURED =
  "Supabase is configured for reads but SUPABASE_SERVICE_ROLE_KEY is missing. " +
  "Refusing to fall back to local files: the write would be lost on the next " +
  "deploy while reads kept coming from the database. Set the service role key.";

export async function setContent<T>(key: string, value: T): Promise<void> {
  if (isWriteMisconfigured()) throw new Error(`[store] ${WRITE_MISCONFIGURED}`);
  const client = writeClient();
  if (client) {
    const { error } = await client
      .from("content")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw new Error(`[store] write ${key}: ${error.message}`);
    return;
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(key), JSON.stringify(value, null, 2));
}

/* ── Settings ─────────────────────────────────────────────── */
export const getSettings = () => getContent<SiteSettings>("settings", SEED_SETTINGS);
export const saveSettings = (v: SiteSettings) => setContent("settings", v);

/* ── Officers ─────────────────────────────────────────────── */
export const getOfficers = () => getContent<OfficerBoard>("officers", SEED_OFFICERS);
export const saveOfficers = (v: OfficerBoard) => setContent("officers", v);

/* ── Projects ─────────────────────────────────────────────── */
export const getProjects = () => getContent<Project[]>("projects", SEED_PROJECTS);
export const saveProjects = (v: Project[]) => setContent("projects", v);
export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

/* ── Sponsors ─────────────────────────────────────────────── */
export const getSponsors = () => getContent<Sponsor[]>("sponsors", SEED_SPONSORS);
export const saveSponsors = (v: Sponsor[]) => setContent("sponsors", v);

/* ── Puck pages ───────────────────────────────────────────── */
const emptyPage: PuckData = { root: {}, content: [] };
export const getPageData = (slug: string) =>
  getContent<PuckData>(`page:${slug}`, SEED_PAGES[slug] ?? emptyPage);
export const savePageData = (slug: string, data: PuckData) =>
  setContent(`page:${slug}`, data);

/* ── Contact submissions ──────────────────────────────────── */
export async function addContactSubmission(
  entry: ContactSubmission
): Promise<void> {
  const record: ContactSubmission = {
    ...entry,
    createdAt: new Date().toISOString(),
  };
  if (isWriteMisconfigured()) throw new Error(`[store] ${WRITE_MISCONFIGURED}`);
  const client = writeClient();
  if (client) {
    const { error } = await client.from("contact_submissions").insert({
      name: record.name,
      email: record.email,
      message: record.message,
    });
    if (error) throw new Error(`[store] contact insert: ${error.message}`);
    return;
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const p = filePath("contact_submissions");
  let all: ContactSubmission[] = [];
  try {
    all = JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    all = [];
  }
  all.push(record);
  fs.writeFileSync(p, JSON.stringify(all, null, 2));
}
