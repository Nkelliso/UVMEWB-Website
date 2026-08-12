import type { Metadata } from "next";
import localFont from "next/font/local";
import ImmersiveHeader from "@/components/immersive/ImmersiveHeader";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav } from "@/lib/pages";

/** Display face for the Cal-Poly-studied home site — the light-geometric,
 *  uppercase, wide-tracked voice. */
const immersiveDisplay = localFont({
  variable: "--font-immersive-display",
  display: "swap",
  src: [
    { path: "../fonts/montserrat-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/montserrat-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/montserrat-600.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Engineers Without Borders · UVM Chapter",
  description:
    "The University of Vermont student chapter of Engineers Without Borders, designing sustainable infrastructure alongside the communities we serve.",
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  // Canonical root site. Trim the nav to real destinations; the logo covers Home.
  // Keeps About/Projects (with their dropdowns), Sponsors, Contact.
  const nav = buildNav(projects).filter((item) => item.href !== "/");

  return (
    <div className={`theme-immersive ${immersiveDisplay.variable}`}>
      <ImmersiveHeader
        nav={nav}
        brand={settings.chapterName}
        homeHref="/"
        logoUrl={settings.logoUrl}
      />
      <main>{children}</main>
      <ImmersiveFooter settings={settings} base="" />
      <EditionSwitcher />
    </div>
  );
}
