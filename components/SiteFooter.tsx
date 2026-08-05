import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function SiteFooter({
  settings,
  basePath = "",
}: {
  settings: SiteSettings;
  /** Path root for a parallel route tree (e.g. "/stevens"). Default "" = canonical site. */
  basePath?: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="ewb-footer">
      <div className="ewb-wrap">
        <div className="ewb-footer-top">
          <div>
            <p className="ewb-footer-mark">
              Engineers Without <span>Borders</span>
            </p>
            <p className="ewb-footer-tag">{settings.tagline}</p>
          </div>
          <div className="ewb-footer-cols">
            <div className="ewb-footer-col">
              <h4>Explore</h4>
              <Link href={`${basePath}/about`}>About</Link>
              <Link href={`${basePath}/about/officer-board`}>Officer Board</Link>
              <Link href={`${basePath}/projects`}>Projects</Link>
              <Link href={`${basePath}/sponsors`}>Sponsors</Link>
            </div>
            <div className="ewb-footer-col">
              <h4>Connect</h4>
              <Link href={`${basePath}/contact`}>Contact us</Link>
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              <Link href="/login">Officer login</Link>
            </div>
          </div>
        </div>
        <div className="ewb-footer-base">
          <span>© {year} EWB-USA · University of Vermont Chapter</span>
          <span>Student-run. Built to be edited.</span>
        </div>
      </div>
    </footer>
  );
}
