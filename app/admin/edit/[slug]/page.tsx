import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import PuckEditor from "@/components/PuckEditor";
import { getEditablePage } from "@/lib/pages";

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");

  const { slug } = await params;
  const page = getEditablePage(slug);
  if (!page) notFound();

  return <PuckEditor slug={page.slug} title={page.title} />;
}
