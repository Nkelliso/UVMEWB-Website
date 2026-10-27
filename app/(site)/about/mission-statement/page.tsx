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
  // The statement carries the emphasis; omit its duplicate section label.
  const statementData = {
    ...data,
    content: data.content.map((block) =>
      block.type === "RichText" &&
      (block.props.id === "mission-1" || block.props.heading?.trim().toLowerCase() === "mission statement")
        ? { ...block, props: { ...block.props, heading: "" } }
        : block
    ),
  };
  return (
    <PageShell
      title="Mission statement"
      narrow={false}
      image={settings.sectionImages?.mission || "/photos/site/rwanda-science-mountain.jpg"}
    >
      <div className="ewb-mission-copy">
        <PageRenderer data={statementData} />
      </div>
    </PageShell>
  );
}
