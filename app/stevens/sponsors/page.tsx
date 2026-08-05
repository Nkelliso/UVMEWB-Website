import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getSponsors, getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Sponsors — EWB UVM",
  description: "Support the University of Vermont chapter of Engineers Without Borders.",
};

export default async function StevensSponsorsPage() {
  const [sponsors, settings] = await Promise.all([
    getSponsors(),
    getSettings(),
  ]);

  // Group sponsors by tier, preserving first-seen tier order.
  const tiers: string[] = [];
  for (const s of sponsors) if (!tiers.includes(s.tier)) tiers.push(s.tier);

  return (
    <PageShell eyebrow="Giving" title="Sponsors & partners" narrow={false} image="/photos/sponsors.jpg">
      <p className="ewb-lede">
        Our work is powered by sponsors and partners who believe in hands-on
        engineering education and lasting community impact. When you support
        EWB-UVM, you invest in clean water, reliable infrastructure, and the
        next generation of engineers.
      </p>

      <div style={{ marginTop: "var(--space-lg)" }}>
        <Link href="/stevens/contact" className="ewb-btn ewb-btn-gold">
          Become a sponsor <span aria-hidden>→</span>
        </Link>
      </div>

      {tiers.map((tier) => (
        <div key={tier}>
          <p className="ewb-sponsor-tier-name">{tier}</p>
          <div className="ewb-sponsor-grid">
            {sponsors
              .filter((s) => s.tier === tier)
              .map((s, i) =>
                s.url ? (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ewb-sponsor-card"
                  >
                    {s.name}
                  </a>
                ) : (
                  <div key={i} className="ewb-sponsor-card">
                    {s.name}
                  </div>
                )
              )}
          </div>
        </div>
      ))}

      <p className="ewb-note" style={{ marginTop: "var(--space-xl)" }}>
        Interested in partnering? Email{" "}
        <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
      </p>
    </PageShell>
  );
}
