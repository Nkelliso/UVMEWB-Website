import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProjectsForm from "@/components/admin/ProjectsForm";
import { getProjects } from "@/lib/store";

export default async function AdminProjectsPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");
  const projects = await getProjects();
  return <ProjectsForm initial={projects} />;
}
