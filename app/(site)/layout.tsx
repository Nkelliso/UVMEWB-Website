import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav } from "@/lib/pages";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);
  const nav = buildNav(projects);

  return (
    <>
      <SiteHeader nav={nav} brand={settings.chapterName} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <EditionSwitcher />
    </>
  );
}
