"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Full-height parallax hero. When `image` is empty (the default — no photos were
 * uploaded to the original build) it shows a deep-green field with a labeled
 * placeholder so it's obvious a real photo belongs here.
 */
export default function ParallaxHero({
  eyebrow,
  heading,
  subline,
  image,
  basePath = "",
}: {
  eyebrow: string;
  heading: string;
  subline: string;
  image?: string;
  /** Path root for a parallel route tree (e.g. "/stevens"). Default "" = canonical site. */
  basePath?: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="ewb-hero">
      <div
        ref={layerRef}
        className="ewb-hero-layer"
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
      <div className="ewb-hero-overlay" />
      <div className="ewb-hero-content">
        <div className="ewb-inner">
          <p className="ewb-eyebrow ewb-eyebrow-chalk">{eyebrow}</p>
          <h1>{heading}</h1>
          {subline && <p className="ewb-hero-sub">{subline}</p>}
          <div className="ewb-hero-actions">
            <Link href={`${basePath}/about`} className="ewb-btn ewb-btn-gold">
              Who we are <span aria-hidden>→</span>
            </Link>
            <Link href={`${basePath}/contact`} className="ewb-btn ewb-btn-ghost">
              Join us <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      <span className="ewb-hero-scroll">Scroll</span>
    </section>
  );
}
