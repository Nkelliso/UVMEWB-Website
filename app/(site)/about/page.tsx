import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageRenderer from "@/components/PageRenderer";
import { getPageData, getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "About · EWB UVM",
  description: "About the University of Vermont chapter of Engineers Without Borders.",
};

export default async function AboutPage() {
  const [data, settings] = await Promise.all([getPageData("about"), getSettings()]);
  return (
    <PageShell
      eyebrow="About"
      title="Our chapter"
      narrow={false}
      tall
      image={settings.sectionImages?.about || "/photos/about.jpg"}
    >
      <PageRenderer data={data} />
    </PageShell>
  );
}
