import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OfficersForm from "@/components/admin/OfficersForm";
import { getOfficers } from "@/lib/store";

export default async function AdminOfficersPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");
  const board = await getOfficers();
  return <OfficersForm initial={board} />;
}
