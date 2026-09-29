import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { savePageData } from "@/lib/store";
import { getEditablePage } from "@/lib/pages";
import { isAuthed } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, data } = await request.json();
  const page = getEditablePage(slug);
  if (!page) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  try {
    await savePageData(slug, data);
    // Public pages are prerendered; without this the live site keeps serving
    // the pre-edit HTML until the next deploy.
    revalidatePath(page.path);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
