import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/store";

export default async function AdminSettingsPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
