import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { canOptimize } from "@/lib/can-optimize";
import Link from "next/link";
import { getSponsors, getSettings } from "@/lib/store";
import { SPONSORS_TEXT, withDefaults } from "@/lib/page-text";

export const metadata: Metadata = {
  title: "Sponsors & Partners · EWB UVM",
  description:
    "Partner with the University of Vermont chapter of Engineers Without Borders: corporate sponsorship, professional mentorship, and alumni support.",
};

const BASE = "";

// Colour corrections tuned for the default "ways" photos (see SPONSORS_TEXT).
// They only apply while a card still uses that exact photo; a newly chosen
// photo shows as uploaded.
const DEFAULT_PHOTO_FILTERS: Record<string, string> = {
  // Flat, overcast source: correct toward the punch of the other two.
  "/photos/giving.jpg": "saturate(1.3) contrast(1.12) brightness(1.08)",
  // Dusk lighting reads slightly dim next to the other two.
  "/photos/site/cooper-uvm.jpg": "saturate(1.12) brightness(1.1)",
};

export default async function SponsorsPage() {
  const [sponsors, settings] = await Promise.all([getSponsors(), getSettings()]);
  const hasPackage = !!settings.sponsorshipPackageUrl;
  // Wording and card photos are edited in /admin/sponsors-page.
  const t = withDefaults(SPONSORS_TEXT, settings.sponsorsText);
  // Changed from /admin/photos ("Sponsors page: header", cropped 4:3 to match
  // the header band's imageRatio). A new key on purpose: the old
  // sectionImages.sponsors still holds a stale portrait photo in saved data.
  const headerImage =
    settings.sectionImages?.sponsorsHeader || "/photos/site/rwanda-schoolkids-road.jpg";
  const namedSponsors = sponsors.filter(
    (s) => s.name && !/your organization|become a sponsor/i.test(s.name)
  );

  return (
    <div className="ewb-shell">
      {/* Cornell-style overlay hero — title + package CTA on the left, intro on
          the right, both sitting over the header photo. Keeps the .ewb-shell-head
          class so the sticky header knows this page opens on a photo band. */}
      <header
        className="ewb-shell-head spon-hero is-fit"
        // Photo is 4:3; the band takes that shape, capped at one screen height.
        style={{ "--head-ratio": 4 / 3 } as CSSProperties}
      >
        <div
          className="ewb-shell-bg"
          style={{ backgroundImage: `url(${headerImage})` }}
        />
        <div className="ewb-shell-scrim" />
        <div className="ewb-wrap spon-hero-grid">
          <div className="spon-hero-left">
            <h1>{t.title}</h1>
            {hasPackage ? (
              <a
                href={settings.sponsorshipPackageUrl}
                target="_blank"
                rel="noreferrer"
                className="ewb-btn ewb-btn-gold spon-hero-cta"
              >
                {t.buttonLabel} <span aria-hidden>→</span>
              </a>
            ) : (
              <Link
                href={`${BASE}/contact`}
                className="ewb-btn ewb-btn-gold spon-hero-cta"
              >
                {t.buttonLabel} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
          <div className="spon-hero-right">
            <p className="spon-hero-lede">{t.intro}</p>
          </div>
        </div>
      </header>

      <div className="ewb-shell-body">
        <div className="ewb-wrap">
          {/* Ways professionals get involved */}
          <section className="spon-ways">
            <div className="spon-ways-grid">
              {t.ways.map((w, i) => (
                <article key={i} className="spon-way">
                  {/* next/image serves a copy resized to the card (~320px, 2-3x
                      for sharp screens). Shrinking the 2000px+ original 7x in
                      CSS, through a filter, rendered visibly jagged. */}
                  <div className="spon-way-media">
                    {w.image && (
                      <Image
                        src={w.image}
                        alt={w.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                        unoptimized={!canOptimize(w.image)}
                        style={{ objectFit: "cover", filter: DEFAULT_PHOTO_FILTERS[w.image] }}
                      />
                    )}
                  </div>
                  <h3 className="spon-way-title">{w.title}</h3>
                  <p className="spon-way-body">{w.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Sponsor / partner logo strip */}
          <section className="spon-logos">
            <p className="ewb-sponsor-tier-name">{t.logosTitle}</p>
            {namedSponsors.length > 0 ? (
              <div className="spon-logo-strip">
                {namedSponsors.map((s, i) => {
                  const inner = s.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logoUrl} alt={s.name} className="spon-logo-img" />
                  ) : (
                    <span className="spon-logo-text">{s.name}</span>
                  );
                  return s.url ? (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="spon-logo"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="spon-logo">
                      {inner}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="ewb-note spon-logos-empty">{t.logosEmpty}</p>
            )}
            <p className="ewb-note spon-contact">
              {t.partnerPrompt} Email{" "}
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
