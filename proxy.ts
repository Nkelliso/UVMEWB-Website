import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 middleware (renamed to "proxy"). Guards the admin area:
// anyone without the auth cookie is bounced to /login.
export function proxy(request: NextRequest) {
  const auth = request.cookies.get("ewb_auth");
  if (!auth && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
