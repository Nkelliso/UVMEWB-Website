"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { saveOfficers, saveProjects, saveSponsors, saveSettings } from "@/lib/store";
import type { OfficerBoard, Project, Sponsor, SiteSettings } from "@/lib/types";

async function requireAuth() {
  const store = await cookies();
  if (!store.get("ewb_auth")) throw new Error("Unauthorized");
}

export async function saveOfficersAction(board: OfficerBoard) {
  await requireAuth();
  await saveOfficers(board);
  revalidatePath("/about/officer-board");
  return { ok: true };
}

export async function saveProjectsAction(projects: Project[]) {
  await requireAuth();
  await saveProjects(projects);
  revalidatePath("/projects");
  revalidatePath("/", "layout"); // nav dropdown reflects projects
  return { ok: true };
}

export async function saveSponsorsAction(sponsors: Sponsor[]) {
  await requireAuth();
  await saveSponsors(sponsors);
  revalidatePath("/sponsors");
  return { ok: true };
}

export async function saveSettingsAction(settings: SiteSettings) {
  await requireAuth();
  await saveSettings(settings);
  revalidatePath("/", "layout");
  return { ok: true };
}
