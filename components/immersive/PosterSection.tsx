"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface PosterAction {
  label: string;
  href: string;
  variant?: "gold" | "primary" | "ghost";
}

/**
 * Full-viewport photographic poster — the studied EWB Cal Poly DNA. Each poster
 * carries its own scroll-linked parallax on its background (the "photos tied
 * together as you scroll" effect), a green-tinted legibility scrim (fixing the
 * source's un-scrimmed white-on-photo text), a giant uppercase title, and SOLID
 * UVM buttons (fixing the source's ghost-only CTAs). When no image is supplied
 * it falls back to a deep-green field — no invented stock photography.
 */
export default function PosterSection({
  variant = "poster",
  align = "center",
  image,
  eyebrow,
  title,
  sub,
  actions = [],
  strip,
  showScroll = false,
  short = false,
  parallaxStrength = 60,
}: {
  variant?: "hero" | "poster";
  align?: "center" | "left" | "right";
  image?: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: PosterAction[];
  strip?: string[];
  showScroll?: boolean;
  short?: boolean;
  /** Max background travel in px. Default 60 = the subtle home parallax. A large
   *  value (~180) turns it into the pronounced Cal-Poly-style reveal and requires
   *  the `.is-parallax` bleed override (applied automatically past 120). */
  parallaxStrength?: number;
}) {
  const strong = parallaxStrength > 120;
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      const bg = bgRef.current;
      if (!el || !bg) return;
      const rect = el.getBoundingClientRect();
      // progress of this section through the viewport, centered → offset
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        window.innerHeight;
      bg.style.transform = `translateY(${progress * parallaxStrength}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallaxStrength]);

  const Heading = variant === "hero" ? "h1" : "h2";

  const btnClass = (v: PosterAction["variant"]) =>
    v === "primary"
      ? "ewb-btn ewb-btn-primary"
      : v === "ghost"
        ? "ewb-btn ewb-btn-ghost"
        : "ewb-btn ewb-btn-gold";

  return (
    <section
      ref={sectionRef}
      className={`imm-poster ${variant === "hero" ? "is-hero" : `align-${align}`} ${
        short ? "is-short" : ""
      } ${strong ? "is-parallax" : ""}`}
    >
      <div
        ref={bgRef}
        className="imm-poster-bg"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      />
      <div className="imm-poster-scrim" />
      <div className="imm-poster-content">
        {eyebrow && <p className="imm-poster-eyebrow">{eyebrow}</p>}
        <Heading className="imm-poster-title">{title}</Heading>
        {sub && <p className="imm-poster-sub">{sub}</p>}
        {strip && strip.length > 0 && (
          <div className="imm-poster-strip">
            {strip.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
        {actions.length > 0 && (
          <div className="imm-poster-actions">
            {actions.map((a) => (
              <Link key={a.href + a.label} href={a.href} className={btnClass(a.variant)}>
                {a.label} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      {showScroll && <span className="imm-poster-scroll">Scroll</span>}
    </section>
  );
}
