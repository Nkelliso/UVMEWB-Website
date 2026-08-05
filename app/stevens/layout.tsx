import { Poppins } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav } from "@/lib/pages";
import "../stevens-theme.css";

/** Light geometric display face for the Stevens-studied re-skin. Scoped to this
 *  subtree via `poppins.variable` on the theme wrapper — the canonical site
 *  never loads it. */
const poppins = Poppins({
  variable: "--font-stevens",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const BASE = "/stevens";

export default async function StevensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);
  const nav = buildNav(projects, BASE);

  return (
    <div className={`theme-stevens ${poppins.variable}`}>
      <SiteHeader nav={nav} brand={settings.chapterName} basePath={BASE} />
      <main>{children}</main>
      <SiteFooter settings={settings} basePath={BASE} />
      <EditionSwitcher />
    </div>
  );
}
