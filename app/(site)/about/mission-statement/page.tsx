import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageRenderer from "@/components/PageRenderer";
import { getPageData, getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Mission Statement · EWB UVM",
  description: "The mission of the EWB UVM chapter.",
};

export default async function MissionPage() {
  const [data, settings] = await Promise.all([
    getPageData("mission-statement"),
    getSettings(),
  ]);
  return (
    <PageShell
      title="Mission statement"
      narrow={false}
      image={settings.sectionImages?.mission || "/photos/site/rwanda-science-mountain.jpg"}
    >
      <PageRenderer data={data} />
    </PageShell>
  );
}
