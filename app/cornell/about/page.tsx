import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageRenderer from "@/components/PageRenderer";
import { getPageData } from "@/lib/store";

export const metadata: Metadata = {
  title: "About — EWB UVM",
  description: "About the University of Vermont chapter of Engineers Without Borders.",
};

export default async function CornellAboutPage() {
  const data = await getPageData("about");
  return (
    <PageShell eyebrow="About" title="Our chapter" narrow={false} image="/photos/about.jpg">
      <PageRenderer data={data} />
    </PageShell>
  );
}
