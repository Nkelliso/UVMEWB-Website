import ParallaxHero from "@/components/ParallaxHero";
import PageRenderer from "@/components/PageRenderer";
import { getPageData, getSettings } from "@/lib/store";

const BASE = "/stevens";

export default async function StevensHomePage() {
  const [settings, data] = await Promise.all([
    getSettings(),
    getPageData("home"),
  ]);

  return (
    <>
      <ParallaxHero
        eyebrow={settings.chapterName + " · UVM"}
        heading={settings.heroHeading}
        subline={settings.heroSubline}
        image={settings.heroImages?.[0]}
        basePath={BASE}
      />
      <PageRenderer data={data} basePath={BASE} />
    </>
  );
}
