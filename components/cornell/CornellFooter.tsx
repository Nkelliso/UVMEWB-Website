import type { SiteSettings } from "@/lib/types";

/**
 * Minimal 3-zone footer studied from ewbcornell.org: wordmark (left), a quiet
 * italic disclaimer (center), and social icons (right) — dressed in UVM green.
 * Only renders icons we have real data for; no invented social links.
 */
export default function CornellFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="cornell-footer">
      <div className="ewb-wrap">
        <div className="cornell-footer-inner">
          <p className="cornell-footer-mark">
            Engineers Without Borders — University of Vermont
          </p>

          <p className="cornell-footer-note">{settings.tagline}</p>

          <div className="cornell-footer-social">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            <a href={`mailto:${settings.contactEmail}`} aria-label="Email us">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 6 10 7 10-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
