import type { Metadata } from "next";
import localFont from "next/font/local";
import CornellHeader from "@/components/cornell/CornellHeader";
import CornellFooter from "@/components/cornell/CornellFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav } from "@/lib/pages";
import "../cornell-theme.css";

const poppins = localFont({
  variable: "--font-cornell",
  display: "swap",
  src: [
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Engineers Without Borders — UVM (Cornell-DNA edition)",
  description:
    "A second visual edition of the EWB-UVM site, built from the design DNA of ewbcornell.org and dressed in UVM green and gold.",
};

export default async function CornellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);
  const nav = buildNav(projects, "/cornell");

  return (
    <div className={`theme-cornell ${poppins.variable}`}>
      <CornellHeader nav={nav} brand={settings.chapterName} home="/cornell" />
      <main>{children}</main>
      <CornellFooter settings={settings} />
      <EditionSwitcher />
    </div>
  );
}
