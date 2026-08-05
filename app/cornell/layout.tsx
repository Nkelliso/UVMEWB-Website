import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import CornellHeader from "@/components/cornell/CornellHeader";
import CornellFooter from "@/components/cornell/CornellFooter";
import EditionSwitcher from "@/components/EditionSwitcher";
import { getProjects, getSettings } from "@/lib/store";
import { buildNav } from "@/lib/pages";
import "../cornell-theme.css";

const poppins = Poppins({
  variable: "--font-cornell",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
