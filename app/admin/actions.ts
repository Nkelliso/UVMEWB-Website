"use server";

import { revalidatePath } from "next/cache";
import {
  getSettings,
  saveOfficers,
  saveProjects,
  saveSponsors,
  saveSettings,
  setContent,
} from "@/lib/store";
import { getVersion } from "@/lib/history";
import { isAuthed } from "@/lib/auth";
import type { OfficerBoard, Project, Sponsor, SiteSettings } from "@/lib/types";

async function requireAuth() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
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

/** Settings are edited from several admin screens (home text, contact, site
 *  details, photos). Each sends only the fields it shows, merged onto the
 *  latest saved settings, so one screen can't overwrite another's edits. */
export async function saveSettingsAction(patch: Partial<SiteSettings>) {
  await requireAuth();
  const current = await getSettings();
  await saveSettings({ ...current, ...patch });
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Put an older version back. The restore is itself saved as a new version,
 *  so restoring the wrong one can be undone the same way. */
export async function restoreVersionAction(id: string) {
  await requireAuth();
  const version = await getVersion(id);
  if (!version) throw new Error("That version no longer exists.");
  await setContent(version.key, version.value);
  revalidatePath("/", "layout");
  return { ok: true };
}
