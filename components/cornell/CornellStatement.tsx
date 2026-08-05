import Link from "next/link";

/**
 * Calm statement band — the exhale after the full-bleed hero. A single centered
 * line + one primary pill CTA, echoing the studied source's "Humanitarian
 * Engineering in Action" band. Dressed in UVM green.
 */
export default function CornellStatement({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="cornell-statement">
      <div className="cornell-statement-inner">
        <p className="cornell-statement-text">{text}</p>
        <Link href={ctaHref} className="ewb-btn ewb-btn-primary">
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
