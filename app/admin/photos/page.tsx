import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PhotoStudio from "@/components/admin/PhotoStudio";
import { getSettings, getProjects } from "@/lib/store";

export default async function AdminPhotosPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");

  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  return <PhotoStudio initialSettings={settings} initialProjects={projects} />;
}
