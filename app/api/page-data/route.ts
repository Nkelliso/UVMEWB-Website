import { NextRequest, NextResponse } from "next/server";
import { getPageData } from "@/lib/store";
import { isEditablePage } from "@/lib/pages";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "home";
  if (!isEditablePage(slug)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  return NextResponse.json(await getPageData(slug));
}
