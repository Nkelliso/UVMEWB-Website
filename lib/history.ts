import "server-only";
import fs from "fs";
import path from "path";
import { writeClient } from "./supabase/server";

/**
 * Version history for admin edits. Every successful save records the new value,
 * so an officer can go back to any recent version from /admin/history. The first
 * save of a section also records what was there before, so the very first edit
 * is undoable too.
 *
 * Supabase: `content_history` table (see supabase/schema.sql). Service-role only
 * — RLS has no policies, so history is never readable with the public anon key.
 * Local dev: data/history.json (gitignored with the rest of /data).
 *
 * History is best-effort: if recording fails (e.g. the table hasn't been created
 * yet) the save itself still succeeds.
 */

export interface Version {
  id: string;
  key: string;
  value: unknown;
  savedAt: string;
}

const KEEP_PER_KEY = 25;
const LOCAL_FILE = path.join(process.cwd(), "data", "history.json");

function readLocal(): Version[] {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")) as Version[];
  } catch {
    return [];
  }
}

function writeLocal(all: Version[]) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(all, null, 2));
}

/** True when a Supabase error means the history table doesn't exist yet. */
function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /content_history/.test(error.message ?? "")
  );
}

export async function recordVersion(
  key: string,
  value: unknown,
  loadPrevious: () => Promise<unknown>
): Promise<void> {
  try {
    const client = writeClient();
    if (client) {
      const { count, error: countError } = await client
        .from("content_history")
        .select("id", { count: "exact", head: true })
        .eq("key", key);
      if (countError) throw countError;

      const rows: { key: string; value: unknown; saved_at?: string }[] = [];
      if (!count) {
        const previous = await loadPrevious();
        // Backdate by a second so it sorts before the save that follows.
        if (previous !== undefined)
          rows.push({ key, value: previous, saved_at: new Date(Date.now() - 1000).toISOString() });
      }
      rows.push({ key, value });
      const { error } = await client.from("content_history").insert(rows);
      if (error) throw error;

      // Prune everything past the newest KEEP_PER_KEY for this key.
      const { data: old } = await client
        .from("content_history")
        .select("id")
        .eq("key", key)
        .order("saved_at", { ascending: false })
        .range(KEEP_PER_KEY, KEEP_PER_KEY + 500);
      if (old?.length) {
        await client.from("content_history").delete().in("id", old.map((r) => r.id));
      }
      return;
    }

    const all = readLocal();
    const now = Date.now();
    if (!all.some((v) => v.key === key)) {
      const previous = await loadPrevious();
      if (previous !== undefined)
        all.push({ id: `${now - 1000}`, key, value: previous, savedAt: new Date(now - 1000).toISOString() });
    }
    all.push({ id: `${now}`, key, value, savedAt: new Date(now).toISOString() });
    const forKey = all.filter((v) => v.key === key);
    const drop = new Set(forKey.slice(0, Math.max(0, forKey.length - KEEP_PER_KEY)).map((v) => v.id));
    writeLocal(all.filter((v) => !drop.has(v.id)));
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (isMissingTable(err)) {
      console.warn("[history] content_history table missing — run supabase/schema.sql to turn on version history.");
    } else {
      console.error("[history] could not record version:", err.message ?? e);
    }
  }
}

export type VersionList =
  | { ok: true; versions: Version[] }
  | { ok: false; reason: "not-set-up" | "error" };

/** Newest first, across every section. */
export async function listVersions(): Promise<VersionList> {
  const client = writeClient();
  if (client) {
    const { data, error } = await client
      .from("content_history")
      .select("id, key, value, saved_at")
      .order("saved_at", { ascending: false })
      .limit(300);
    if (error) {
      return { ok: false, reason: isMissingTable(error) ? "not-set-up" : "error" };
    }
    return {
      ok: true,
      versions: (data ?? []).map((r) => ({
        id: String(r.id),
        key: r.key,
        value: r.value,
        savedAt: r.saved_at,
      })),
    };
  }
  const all = readLocal();
  return { ok: true, versions: [...all].reverse() };
}

export async function getVersion(id: string): Promise<Version | null> {
  const client = writeClient();
  if (client) {
    const { data, error } = await client
      .from("content_history")
      .select("id, key, value, saved_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return { id: String(data.id), key: data.key, value: data.value, savedAt: data.saved_at };
  }
  return readLocal().find((v) => v.id === id) ?? null;
}
