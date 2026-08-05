import { NextResponse } from "next/server";
import { listImages } from "@/lib/storage";
import { isAuthed } from "@/lib/auth";

// Auth-gated listing of available photos for the studio's "reuse existing" picker.
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ images: await listImages() });
}
