import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when Supabase env vars are present. When false, the app uses the
 *  local JSON-file fallback so it runs with zero configuration. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon);
}

/** Read client (anon key, respects RLS public-select policies). */
export function readClient(): SupabaseClient | null {
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

/** True when SOME but not all three vars are set. Any partial configuration
 *  splits reads from writes, in either direction, and both directions lose
 *  data silently:
 *
 *   - url + anon, no service -> reads hit the database, writes fall through to
 *     the local-JSON branch and a filesystem that is read-only on Vercel.
 *   - url + service, no anon -> readClient() is null so reads come from local
 *     JSON, while writes land in the database. The editor saves successfully
 *     and the site never shows the change.
 *
 *  Neither is a degraded-but-working state, so writes must refuse rather than
 *  take a fallback that cannot be correct. */
export function isPartiallyConfigured(): boolean {
  const set = [url, anon, service].filter(Boolean).length;
  return set > 0 && set < 3;
}

/** Write client (service role, bypasses RLS). Server-only; never expose. */
export function writeClient(): SupabaseClient | null {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
