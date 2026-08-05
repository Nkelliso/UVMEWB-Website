import { NextRequest, NextResponse } from "next/server";
import { saveImage, sniffImageType } from "@/lib/storage";
import { isAuthed } from "@/lib/auth";

// Auth-gated image upload. The image is validated by magic bytes (not the
// client-declared type or filename), size-capped, and stored with an extension
// derived from the detected type — so no SVG/HTML/oversized files get through.
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 8 MB)" }, { status: 413 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = sniffImageType(bytes);
    if (!mime) {
      return NextResponse.json(
        { error: "Unsupported or invalid image (JPEG, PNG, WebP, or AVIF only)" },
        { status: 415 }
      );
    }
    const { url } = await saveImage(bytes, file.name || "photo", mime);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
