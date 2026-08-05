"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * PREVIEW component — two full-screen scroll effects over the same photo stack so
 * the effect can be chosen before wiring it into the real home:
 *
 *  - mode="curtain"   : each layer slides up over the previous (sticky-curtain
 *                        reveal). The footer layer slides up over the last photo.
 *  - mode="crossfade" : each layer dissolves into the next; the footer dissolves
 *                        in over the last photo.
 *
 * The footer is the final layer, so the last-photo → footer transition is the
 * same effect as every photo-to-photo transition. Respects reduced-motion by
 * falling back to a plain stacked scroll.
 */

export type Layer = {
  image?: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  strip?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  footer?: boolean;
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);

export default function ScrollStack({
  mode,
  layers,
  copyright,
}: {
  mode: "curtain" | "crossfade";
  layers: Layer[];
  copyright: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);
  const M = layers.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      setP(total > 0 ? (scrolled / total) * (M - 1) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [M]);

  const renderInner = (L: Layer) =>
    L.footer ? (
      <div className="imm-stack-footer">
        <p className="imm-footer-mark">
          Engineers Without <span>Borders</span>
        </p>
        <p className="imm-poster-sub" style={{ margin: "0 auto" }}>
          This is the footer — it reveals over the last photo with the same effect.
        </p>
        <div className="imm-footer-base" style={{ borderTop: "none" }}>
          {copyright}
        </div>
      </div>
    ) : (
      <div className="imm-poster-content">
        {L.eyebrow && <p className="imm-poster-eyebrow">{L.eyebrow}</p>}
        <h2 className="imm-poster-title">{L.title}</h2>
        {L.sub && <p className="imm-poster-sub">{L.sub}</p>}
        {L.strip && L.strip.length > 0 && (
          <div className="imm-poster-strip">
            {L.strip.map((s) => <span key={s}>{s}</span>)}
          </div>
        )}
        {L.ctaLabel && L.ctaHref && (
          <div className="imm-poster-actions">
            <Link href={L.ctaHref} className="ewb-btn ewb-btn-gold">
              {L.ctaLabel} <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    );

  // Reduced-motion fallback: plain, opaque, stacked full-height panels.
  if (reduced) {
    return (
      <div>
        {layers.map((L, k) => (
          <section
            key={k}
            className="imm-stack-layer is-static"
            style={{
              background: L.image
                ? `center / cover no-repeat url(${L.image})`
                : "var(--poster-field)",
            }}
          >
            <div className="imm-stack-scrim" />
            {renderInner(L)}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="imm-stack"
      style={{ height: `${M * 100}svh` }}
    >
      <div className="imm-stack-stage">
        {layers.map((L, k) => {
          const style: React.CSSProperties = { zIndex: k };
          if (mode === "curtain") {
            style.transform = `translateY(${clamp(k - p) * 100}svh)`;
          } else {
            style.opacity = clamp(p - (k - 1));
          }
          return (
            <div key={k} className="imm-stack-layer" style={style}>
              <div
                className="imm-stack-bg"
                style={{
                  backgroundImage: !L.footer && L.image ? `url(${L.image})` : undefined,
                  background: L.footer
                    ? "oklch(15% 0.02 158)"
                    : L.image
                      ? undefined
                      : "var(--poster-field)",
                }}
              />
              <div className="imm-stack-scrim" />
              {renderInner(L)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
