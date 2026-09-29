import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { isAuthed } from "@/lib/auth";
import { getSettings } from "@/lib/store";

export default async function AdminSponsorsPage() {
  if (!(await isAuthed())) redirect("/login");
  const settings = await getSettings();
  return <SettingsForm initial={settings} screen="sponsorsPage" />;
}
