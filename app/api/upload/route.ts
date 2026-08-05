import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveImage } from "@/lib/storage";

// Auth-gated image upload. Receives the already-edited image (crop + color are
// baked in the browser) as multipart/form-data and persists via the storage
// adapter (dev disk or Supabase Storage). Mirrors the auth check in api/save.
export async function POST(request: NextRequest) {
  const store = await cookies();
  if (!store.get("ewb_auth")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { url } = await saveImage(bytes, file.name || "photo.jpg", file.type);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
