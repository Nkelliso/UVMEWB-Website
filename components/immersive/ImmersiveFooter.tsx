import type { SiteSettings } from "@/lib/types";

/**
 * Immersive-route footer. Layout modeled on the EWB-Cornell footer — chapter
 * identity line, the registered-student-organization + equal-opportunity clause,
 * and a row of connect icons (Instagram / Facebook / LinkedIn / Email) — dressed
 * in our own dark green identity, not Cornell's palette. A quiet nav + copyright
 * line sits below. Social icons render only for links that are set in /admin.
 */
export default function ImmersiveFooter({
  settings,
  base,
}: {
  settings: SiteSettings;
  base: string;
}) {
  const year = new Date().getFullYear();

  const socials: { key: string; href: string; label: string; icon: React.ReactNode }[] = [];
  if (settings.instagram)
    socials.push({ key: "ig", href: settings.instagram, label: "Instagram", icon: <IgIcon /> });
  if (settings.facebook)
    socials.push({ key: "fb", href: settings.facebook, label: "Facebook", icon: <FbIcon /> });
  if (settings.linkedin)
    socials.push({ key: "li", href: settings.linkedin, label: "LinkedIn", icon: <LiIcon /> });
  if (settings.contactEmail)
    socials.push({ key: "em", href: `mailto:${settings.contactEmail}`, label: "Email", icon: <MailIcon /> });

  return (
    <footer className="imm-footer">
      <div className="ewb-wrap">
        {/* Cornell-style identity + clause + connect row (the nav lives in the
            top masthead, so the footer stays a single quiet identity band). */}
        <div className="imm-footer-org">
          <p className="imm-footer-org-name">
            Engineers Without Borders — University of Vermont
          </p>
          <p className="imm-footer-clause">
            A registered student organization of the University of Vermont.
            <br />
            An equal education and employment opportunity organization.
          </p>
          {socials.length > 0 && (
            <div className="imm-footer-social">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  aria-label={s.label}
                  className="imm-footer-social-link"
                  {...(s.key === "em" ? {} : { target: "_blank", rel: "noreferrer" })}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="imm-footer-base">
          © {year} EWB-USA · University of Vermont Chapter
        </div>
      </div>
    </footer>
  );
}

/* ── Inline icons (currentColor, ~20px) ──────────────────────────────────── */

function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5V6.9c0-.7.5-.9.9-.9H16V3.2l-2.1-.01c-2.4 0-3 1.8-3 2.9v2.4H9v2.8h1.9V21h3v-9.7h2.2l.4-2.8H14z" />
    </svg>
  );
}

function LiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.94 5A1.94 1.94 0 1 1 3 5a1.94 1.94 0 0 1 3.94 0zM3.3 8.5h3.28V21H3.3V8.5zM9.1 8.5h3.14v1.7h.05c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.9 2.17 3.9 5v7.5h-3.27v-6.65c0-1.58-.03-3.62-2.2-3.62-2.2 0-2.54 1.72-2.54 3.5V21H9.1V8.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7.5l8 5 8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
