/**
 * Supabase health check. Proves the database, its row-level security, and the
 * storage bucket behave the way the app assumes — before trusting it with real
 * content. Every row and object it creates is named `healthcheck` and removed
 * before it exits.
 *
 *   node scripts/verify-supabase.mjs
 *
 * Reads .env.local. Run it again after configuring Vercel by pointing the same
 * three env vars at the production project.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anon || !service) {
  console.error("Missing one of the three SUPABASE vars in .env.local.");
  process.exit(1);
}

const A = createClient(url, anon, { auth: { persistSession: false } });
const S = createClient(url, service, { auth: { persistSession: false } });

let failures = 0;
const check = (pass, label, detail) => {
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(28)} ${detail}`);
};

// --- content: the public read path -----------------------------------------
const r1 = await A.from("content").select("key").limit(10);
check(!r1.error, "anon read content", r1.error?.message ?? `${r1.data.length} row(s): ${r1.data.map((d) => d.key).join(", ") || "(none)"}`);

const r2 = await A.from("content").select("value").eq("key", "officers").maybeSingle();
check(!r2.error && r2.data?.value?.asOf === "Fall 2026", "officers row imported", r2.data?.value?.asOf ?? r2.error?.message ?? "missing");

// --- content: the admin write path ------------------------------------------
const w = await S.from("content").upsert({ key: "__healthcheck", value: { t: Date.now() } });
const wb = await S.from("content").select("key").eq("key", "__healthcheck").maybeSingle();
await S.from("content").delete().eq("key", "__healthcheck");
check(!w.error && !!wb.data, "service write + readback", w.error?.message ?? "wrote and removed");

// --- content must be read-only to the public --------------------------------
const bad = await A.from("content").upsert({ key: "__anon_should_fail", value: {} });
if (!bad.error) await S.from("content").delete().eq("key", "__anon_should_fail");
check(!!bad.error, "anon write blocked", bad.error ? "rejected as expected" : "*** ANON WROTE A ROW ***");

// --- contact form ------------------------------------------------------------
const ins = await A.from("contact_submissions").insert({ name: "healthcheck", email: "hc@example.com", message: "automated verification" });
check(!ins.error, "anon contact insert", ins.error?.message ?? "inserted");

const leak = await A.from("contact_submissions").select("id").limit(1);
check(!!leak.error || leak.data.length === 0, "anon cannot read submissions", leak.error ? "rejected as expected" : leak.data.length ? "*** ANON READ SUBMISSIONS ***" : "returned nothing");

const seen = await S.from("contact_submissions").select("id").eq("name", "healthcheck");
check(!seen.error && seen.data.length > 0, "service sees submission", `${seen.data?.length ?? 0} row(s)`);
await S.from("contact_submissions").delete().eq("name", "healthcheck");

// --- storage -----------------------------------------------------------------
const b = await S.storage.getBucket("photos");
check(!b.error && b.data?.public === true, "photos bucket is public", b.error?.message ?? `public=${b.data.public}`);

const ls = await A.storage.from("photos").list("", { limit: 5 });
check(!ls.error, "anon can list bucket", ls.error?.message ?? `${ls.data.length} object(s)`);

// Smallest valid 1x1 PNG, so the upload exercises a real content type.
const png = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000100ffff03000006000557bfabd40000000049454e44ae426082",
  "hex"
);
const key = `__healthcheck-${Date.now()}.png`;
const up = await S.storage.from("photos").upload(key, png, { contentType: "image/png", upsert: true });
let detail = up.error?.message ?? "";
let pass = false;
if (!up.error) {
  const pub = S.storage.from("photos").getPublicUrl(key).data.publicUrl;
  const res = await fetch(pub);
  pass = res.ok;
  detail = `HTTP ${res.status} from public URL`;
}
check(pass, "upload + public fetch", detail);
await S.storage.from("photos").remove([key]);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) FAILED.`}`);
process.exit(failures === 0 ? 0 : 1);
