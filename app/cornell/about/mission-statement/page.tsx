import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageRenderer from "@/components/PageRenderer";
import { getPageData } from "@/lib/store";

export const metadata: Metadata = {
  title: "Mission Statement — EWB UVM",
  description: "The mission of the EWB UVM chapter.",
};

export default async function CornellMissionPage() {
  const data = await getPageData("mission-statement");
  return (
    <PageShell eyebrow="About" title="Mission statement" narrow={false} image="/photos/about.jpg">
      <PageRenderer data={data} />
    </PageShell>
  );
}
