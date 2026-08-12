import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ImmersiveHeader from "@/components/immersive/ImmersiveHeader";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav, type NavItem } from "@/lib/pages";

/** Scoped display face for the immersive re-skin — the studied light-geometric,
 *  uppercase, wide-tracked voice. Loaded here so the variable exists only inside
 *  this subtree, never on the "/" site. */
const immersiveDisplay = Montserrat({
  variable: "--font-immersive-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const BASE = "/immersive";

export const metadata: Metadata = {
  title: "Engineers Without Borders — UVM Chapter",
  description:
    "The University of Vermont student chapter of Engineers Without Borders — designing sustainable infrastructure alongside the communities we serve.",
};

/** Re-point every nav href into the /immersive tree so the parallel site links
 *  to itself. "/" → "/immersive", "/about" → "/immersive/about", etc. */
function prefixNav(nav: NavItem[]): NavItem[] {
  const px = (href: string) => (href === "/" ? BASE : `${BASE}${href}`);
  return nav.map((item) => ({
    ...item,
    href: px(item.href),
    children: item.children?.map((c) => ({ ...c, href: px(c.href) })),
  }));
}

export default async function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  // Trim the source's 10-link sitemap-nav down to real destinations; the logo
  // covers Home. Keeps About/Projects (with their dropdowns), Sponsors, Contact.
  const nav = prefixNav(buildNav(projects)).filter(
    (item) => item.href !== BASE
  );

  return (
    <div className={`theme-immersive ${immersiveDisplay.variable}`}>
      <ImmersiveHeader
        nav={nav}
        brand={settings.chapterName}
        homeHref={BASE}
        logoUrl={settings.logoUrl}
      />
      <main>{children}</main>
      <ImmersiveFooter settings={settings} base={BASE} />
      <EditionSwitcher />
    </div>
  );
}
