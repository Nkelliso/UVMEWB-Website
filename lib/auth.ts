import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

// Admin session token. The cookie value is an HMAC derived from a server secret,
// so it cannot be forged without knowing the secret (unlike the old presence-only
// "1" cookie, which anyone could set). The middleware (proxy.ts) recomputes the
// same token with Web Crypto for the /admin page gate; API routes + server
// actions verify here in the Node runtime.
const SECRET =
  process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "ewb-dev-insecure";
const MESSAGE = "ewb-admin-session-v1";

export function sessionToken(): string {
  return createHmac("sha256", SECRET).update(MESSAGE).digest("hex");
}

/** True only when the request carries a cookie equal to the derived token. */
export async function isAuthed(): Promise<boolean> {
  const value = (await cookies()).get("ewb_auth")?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
