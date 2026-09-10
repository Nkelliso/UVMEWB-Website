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
  titleSuffix,
  actions = [],
  strip,
  showScroll = false,
  short = false,
  warm = false,
  scrimToFooter = false,
  parallaxStrength = 60,
}: {
  variant?: "hero" | "poster";
  align?: "center" | "left" | "right";
  image?: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  /** Small trailing text inside the heading, e.g. "at UVM". */
  titleSuffix?: string;
  actions?: PosterAction[];
  strip?: string[];
  showScroll?: boolean;
  short?: boolean;
  /** Warm the background photo (sepia + saturation + hue shift). Used on the
   *  home page's photographic bands. */
  warm?: boolean;
  /** Keep the deep fade-to-black at the bottom of this poster. Used only on the
   *  LAST section so it blends into the black footer; every other poster uses the
   *  soft scrim so photo-to-photo seams don't show a hard dark line. */
  scrimToFooter?: boolean;
  /** Max background travel in px. Default 60 = the subtle home parallax. A large
   *  value (~180) turns it into the pronounced Cal-Poly-style reveal and requires
   *  the `.is-parallax` bleed override (applied automatically past 120). */
  parallaxStrength?: number;
}) {
  const strong = parallaxStrength > 120;
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const el = sectionRef.current;
    if (!bg || !el) return;

    // Parallax is desktop + motion-OK only: on phones the scroll-driven transform
    // stutters (throttled scroll + address-bar resize churn), and reduced-motion
    // users opt out entirely. We watch both media queries live so crossing the
    // breakpoint (resize / rotate) turns parallax on or off without a reload.
    const mqPhone = window.matchMedia("(max-width: 760px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let active = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // progress of this section through the viewport, centered → offset
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        window.innerHeight;
      // translate3d keeps the move on the GPU compositor so the reveal stays
      // smooth (no per-frame repaint of the large photo) → the Cal-Poly feel.
      bg.style.transform = `translate3d(0, ${progress * parallaxStrength}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const enable = () => {
      if (active) return;
      active = true;
      // Promote to a compositor layer only while parallax actually runs, so the
      // large photo isn't permanently layer-promoted on phones / reduced-motion.
      bg.style.willChange = "transform";
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    };
    const disable = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      bg.style.transform = "";
      bg.style.willChange = "";
    };

    const evaluate = () => {
      if (mqPhone.matches || mqReduce.matches) disable();
      else enable();
    };

    evaluate();
    mqPhone.addEventListener("change", evaluate);
    mqReduce.addEventListener("change", evaluate);
    return () => {
      mqPhone.removeEventListener("change", evaluate);
      mqReduce.removeEventListener("change", evaluate);
      disable();
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
      } ${strong ? "is-parallax" : ""} ${warm ? "is-warm" : ""} ${
        scrimToFooter ? "is-tofooter" : ""
      }`}
    >
      <div
        ref={bgRef}
        className="imm-poster-bg"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      />
      <div className="imm-poster-scrim" />
      <div className="imm-poster-content">
        {eyebrow && <p className="imm-poster-eyebrow">{eyebrow}</p>}
        <Heading className="imm-poster-title">
          {title}
          {titleSuffix && (
            <span className="imm-poster-title-suffix">{titleSuffix}</span>
          )}
        </Heading>
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
