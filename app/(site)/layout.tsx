import type { Metadata } from "next";
import localFont from "next/font/local";
import ImmersiveHeader from "@/components/immersive/ImmersiveHeader";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";
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

/** Button face. Nunito Sans, not the Montserrat display voice — Montserrat is
 *  self-hosted at 300–600, so the buttons' bold was being synthesised. Chosen
 *  over Manrope and Poppins by comparing every self-hosted face at real button
 *  size; its humanist letterforms read warmer than the geometric options
 *  without losing weight. Scoped to its own variable so the theme's
 *  --font-display override doesn't reach it. */
const buttonFace = localFont({
  variable: "--font-button",
  display: "swap",
  src: [
    { path: "../fonts/nunito-sans-700.woff2", weight: "700", style: "normal" },
  ],
});

/** Hero headline face. Oswald — the condensed grotesque the Cal Poly source uses
 *  for its big photo titles. Condensed caps are ~70% the width of Montserrat's,
 *  which is what lets the one-line lockup run large. Google ships Oswald as a
 *  single variable file covering 200-700, so one woff2 serves every weight. */
const heroFace = localFont({
  variable: "--font-hero",
  display: "swap",
  src: [
    { path: "../fonts/oswald-variable.woff2", weight: "200 700", style: "normal" },
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
    <div
      className={`theme-immersive ${immersiveDisplay.variable} ${buttonFace.variable} ${heroFace.variable}`}
    >
      <ImmersiveHeader
        nav={nav}
        brand={settings.chapterName}
        homeHref="/"
        logoUrl={settings.logoUrl}
      />
      <main>{children}</main>
      <ImmersiveFooter settings={settings} base="" />
    </div>
  );
}
