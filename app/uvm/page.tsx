import ParallaxHero from "@/components/ParallaxHero";
import PageRenderer from "@/components/PageRenderer";
import { getPageData, getSettings } from "@/lib/store";

// The original UVM edition, kept as a reference route (the Cal-Poly-styled site is
// now canonical at "/"). Renders the same editable "home" layout the admin builder
// edits, under the UVM masthead. basePath keeps its links inside /uvm.
export default async function UvmHome() {
  const [data, settings] = await Promise.all([
    getPageData("home"),
    getSettings(),
  ]);

  return (
    <>
      <ParallaxHero
        eyebrow={`${settings.chapterName} · UVM`}
        heading={settings.heroHeading}
        subline={settings.heroSubline}
        image={settings.heroImages?.[0] || "/photos/hero.jpg"}
        basePath="/uvm"
      />
      <PageRenderer data={data} basePath="/uvm" />
    </>
  );
}
