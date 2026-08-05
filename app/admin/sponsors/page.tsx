import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SponsorsForm from "@/components/admin/SponsorsForm";
import { getSponsors } from "@/lib/store";

export default async function AdminSponsorsPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");
  const sponsors = await getSponsors();
  return <SponsorsForm initial={sponsors} />;
}
