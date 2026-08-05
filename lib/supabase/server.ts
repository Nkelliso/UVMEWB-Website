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

/** Write client (service role, bypasses RLS). Server-only; never expose. */
export function writeClient(): SupabaseClient | null {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
