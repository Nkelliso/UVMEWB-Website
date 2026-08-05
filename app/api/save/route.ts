import { NextRequest, NextResponse } from "next/server";
import { savePageData } from "@/lib/store";
import { isEditablePage } from "@/lib/pages";
import { isAuthed } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, data } = await request.json();
  if (!isEditablePage(slug)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  try {
    await savePageData(slug, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
