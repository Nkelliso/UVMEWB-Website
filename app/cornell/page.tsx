import CornellHero from "@/components/cornell/CornellHero";
import CornellStatement from "@/components/cornell/CornellStatement";
import PageRenderer from "@/components/PageRenderer";
import { getPageData, getSettings } from "@/lib/store";

export default async function CornellHome() {
  const [settings, data] = await Promise.all([
    getSettings(),
    getPageData("home"),
  ]);

  return (
    <>
      <CornellHero
        heading={settings.chapterName}
        sub="at UVM"
        image={settings.heroImages?.[0]}
      />
      <CornellStatement
        text={settings.heroSubline}
        ctaLabel="Learn more"
        ctaHref="/cornell/about"
      />
      <PageRenderer data={data} />
    </>
  );
}
