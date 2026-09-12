/**
 * One-time import of the local JSON fallback into Supabase.
 *
 * Before Supabase is configured the site reads and writes /data/*.json. Those
 * files are gitignored, so anything edited through /admin locally lives only on
 * this machine. Once Supabase is connected, getContent() reads the database and
 * falls back to lib/seed.ts when a key is missing — it never looks at /data
 * again. Without this import those local edits silently revert to the seed.
 *
 * Run once, after the schema is applied and .env.local has the keys:
 *   node scripts/import-local-data.mjs          # dry run, shows what would change
 *   node scripts/import-local-data.mjs --write  # actually upsert
 *
 * Safe to re-run. Existing rows are only overwritten with --write.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const WRITE = process.argv.includes("--write");

// Real submissions belong in their own table, and the only local row is a test.
const SKIP = new Set(["contact_submissions.json"]);

function loadEnv(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Fill those in first — see .env.example."
  );
  process.exit(1);
}

const db = createClient(url, service, { auth: { persistSession: false } });

if (!fs.existsSync(DATA_DIR)) {
  console.log("No /data directory — nothing to import.");
  process.exit(0);
}

const files = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith(".json") && !SKIP.has(f));

if (files.length === 0) {
  console.log("No importable files in /data.");
  process.exit(0);
}

console.log(WRITE ? "Importing /data into Supabase:\n" : "DRY RUN (pass --write to apply):\n");

let changed = 0;
for (const file of files) {
  // filePath() in lib/store.ts encodes ":" as "__" on disk; undo that.
  const key = path.basename(file, ".json").replace(/__/g, ":");
  let value;
  try {
    value = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
  } catch (e) {
    console.log(`  SKIP  ${key.padEnd(18)} unreadable JSON (${e.message})`);
    continue;
  }

  const { data: existing, error: readErr } = await db
    .from("content")
    .select("key")
    .eq("key", key)
    .maybeSingle();
  if (readErr) {
    console.log(`  FAIL  ${key.padEnd(18)} ${readErr.message}`);
    continue;
  }

  const verb = existing ? "overwrite" : "create";
  if (!WRITE) {
    console.log(`  would ${verb.padEnd(9)} ${key.padEnd(18)} from ${file}`);
    changed++;
    continue;
  }

  const { error } = await db
    .from("content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) console.log(`  FAIL  ${key.padEnd(18)} ${error.message}`);
  else {
    console.log(`  ${verb === "create" ? "created " : "updated "} ${key.padEnd(18)} from ${file}`);
    changed++;
  }
}

console.log(
  `\n${changed} key${changed === 1 ? "" : "s"} ${WRITE ? "written" : "would change"}.`
);
