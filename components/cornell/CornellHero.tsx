"use client";

import { useEffect, useState } from "react";

/**
 * Cornell-DNA photographic hero: full-bleed dusk photo, a dark scrim for
 * legibility, a gradient headline, and a smaller right-offset second line
 * ("at UVM"). No button in the hero — the primary CTA lives in the statement
 * band below, matching the studied source. Falls back to a labeled placeholder
 * on the deep-green field when no photo is set (edit via /admin).
 */
export default function CornellHero({
  heading,
  sub,
  image,
}: {
  heading: string;
  sub: string;
  image?: string;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Respect reduced-motion: the parallax is a JS-driven inline transform, so
    // the CSS media query can't stop it — gate the listener here instead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="cornell-hero">
      <div
        className="cornell-hero-layer"
        style={{
          transform: `translateY(${offset}px)`,
          background: image
            ? `center / cover no-repeat url(${image})`
            : "var(--field)",
        }}
      >
        {!image && (
          <div
            className="ewb-placeholder"
            style={{
              position: "absolute",
              inset: "12% 8%",
              color: "var(--chalk-soft)",
              borderColor: "var(--rule-dark)",
              background: "transparent",
            }}
          >
            Hero photo — placeholder · replace via /admin
          </div>
        )}
      </div>
      <div className="cornell-hero-overlay" />
      <div className="cornell-hero-content">
        <div className="cornell-hero-inner">
          <h1 className="cornell-hero-title">
            {heading}
            {sub && <span className="cornell-hero-sub">{sub}</span>}
          </h1>
        </div>
      </div>
      <span className="cornell-hero-scroll">Scroll</span>
    </section>
  );
}
