import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

/**
 * Immersive-route footer (Ft1 minimal). A single dark band — mark, tagline,
 * a compact centered link row, and one copyright line. Deliberately quiet,
 * mirroring the studied site's minimal footer but carrying UVM identity.
 */
export default function ImmersiveFooter({
  settings,
  base,
}: {
  settings: SiteSettings;
  base: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="imm-footer">
      <div className="ewb-wrap">
        <p className="imm-footer-mark">
          Engineers Without <span>Borders</span>
        </p>
        <p className="imm-footer-tag">{settings.tagline}</p>

        <nav className="imm-footer-nav">
          <Link href={`${base}/about`}>About</Link>
          <Link href={`${base}/projects`}>Projects</Link>
          <Link href={`${base}/sponsors`}>Sponsors</Link>
          <Link href={`${base}/contact`}>Contact</Link>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
        </nav>

        <div className="imm-footer-base">
          © {year} EWB-USA · University of Vermont Chapter
        </div>
      </div>
    </footer>
  );
}
