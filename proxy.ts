import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 middleware (renamed to "proxy"). Guards the admin area: the cookie
// must equal the server-derived session token, not merely exist. Recomputed here
// with Web Crypto (Edge runtime) to match lib/auth.ts's Node HMAC.
const SECRET =
  process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "ewb-dev-insecure";

async function expectedToken(): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("ewb-admin-session-v1")
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("ewb_auth")?.value;
    if (!cookie || cookie !== (await expectedToken())) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
