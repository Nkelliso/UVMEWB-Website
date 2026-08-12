import type { Metadata } from "next";
import Link from "next/link";
import { getSponsors, getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Sponsors & Partners · EWB UVM",
  description:
    "Partner with the University of Vermont chapter of Engineers Without Borders: corporate sponsorship, professional mentorship, and alumni support.",
};

const BASE = "";

// Structural page content (the "ways professionals get involved" block). Our own
// copy + framing — the Cornell layout, our voice. Photos fall back to existing
// site photos until dedicated ones are placed via /admin.
const WAYS = [
  {
    title: "Corporate Partners",
    body: "Fuel our projects through financial support, in-kind donations, and collaborative opportunities. Put your name behind clean water and infrastructure that outlasts us.",
    image: "/photos/giving.jpg",
  },
  {
    title: "Professional Mentors",
    body: "Licensed engineers and technical experts who guide our student teams and help ensure every design meets real-world industry standards.",
    image: "/photos/projects.jpg",
  },
  {
    title: "Alumni & Friends",
    body: "Former members and community supporters who keep the mission moving through mentorship, networking, and ongoing project support.",
    image: "/photos/site/cooper-uvm.jpg",
  },
];

export default async function SponsorsPage() {
  const [sponsors, settings] = await Promise.all([getSponsors(), getSettings()]);
  const hasPackage = !!settings.sponsorshipPackageUrl;
  const headerImage = settings.sectionImages?.sponsors || "/photos/sponsors.jpg";
  const namedSponsors = sponsors.filter(
    (s) => s.name && !/your organization|become a sponsor/i.test(s.name)
  );

  return (
    <div className="ewb-shell">
      {/* Cornell-style overlay hero — title + package CTA on the left, intro on
          the right, both sitting over the header photo. Keeps the .ewb-shell-head
          class so the sticky header knows this page opens on a photo band. */}
      <header className="ewb-shell-head spon-hero">
        <div
          className="ewb-shell-bg"
          style={{ backgroundImage: `url(${headerImage})` }}
        />
        <div className="ewb-shell-scrim" />
        <div className="ewb-wrap spon-hero-grid">
          <div className="spon-hero-left">
            <p className="ewb-eyebrow">Partnership</p>
            <h1>Sponsors</h1>
            {hasPackage ? (
              <a
                href={settings.sponsorshipPackageUrl}
                target="_blank"
                rel="noreferrer"
                className="ewb-btn ewb-btn-gold spon-hero-cta"
              >
                Sponsorship Package <span aria-hidden>→</span>
              </a>
            ) : (
              <Link
                href={`${BASE}/contact`}
                className="ewb-btn ewb-btn-gold spon-hero-cta"
              >
                Sponsorship Package <span aria-hidden>→</span>
              </Link>
            )}
          </div>
          <div className="spon-hero-right">
            <p className="spon-hero-lede">
              Behind every successful project is a community of supporters. From
              corporate partners and professional mentors to our alumni network,
              we’re proud to be backed by those who believe in student-led,
              community-driven engineering.
            </p>
          </div>
        </div>
      </header>

      <div className="ewb-shell-body">
        <div className="ewb-wrap">
          {/* Ways professionals get involved */}
          <section className="spon-ways">
            <div className="spon-ways-grid">
              {WAYS.map((w) => (
                <article key={w.title} className="spon-way">
                  <div
                    className="spon-way-media"
                    style={{ backgroundImage: `url(${w.image})` }}
                    role="img"
                    aria-label={w.title}
                  />
                  <h3 className="spon-way-title">{w.title}</h3>
                  <p className="spon-way-body">{w.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Sponsor / partner logo strip */}
          <section className="spon-logos">
            <p className="ewb-sponsor-tier-name">Our sponsors &amp; partners</p>
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
              <p className="ewb-note spon-logos-empty">
                Be one of our founding partners. Your organization’s logo will
                appear here.
              </p>
            )}
            <p className="ewb-note spon-contact">
              Interested in partnering? Email{" "}
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
