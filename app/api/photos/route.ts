import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listImages } from "@/lib/storage";

// Auth-gated listing of available photos for the studio's "reuse existing" picker.
export async function GET() {
  const store = await cookies();
  if (!store.get("ewb_auth")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ images: await listImages() });
}
