"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/pages";

/**
 * Cornell-DNA header: transparent over the hero photo, darkening to a solid dark
 * bar on scroll (the signature move studied from ewbcornell.org). Hides on
 * scroll-down, returns on scroll-up. Collapses to a hamburger below 760px.
 * Text is always light — it sits over the photo or the solid dark bar.
 */
export default function CornellHeader({
  nav,
  brand,
  home,
}: {
  nav: NavItem[];
  brand: string;
  home: string;
}) {
  const pathname = usePathname();
  const overHero = pathname === home;
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(!overHero);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setSolid(!overHero);
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      if (y < 80) setHidden(false);
      else if (goingDown && y > 200) setHidden(true);
      else if (!goingDown) setHidden(false);
      lastY.current = y;
      setSolid(overHero ? y > 60 : true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overHero]);

  const isActive = (href: string) =>
    href === home ? pathname === home : pathname.startsWith(href);

  return (
    <header
      className="cornell-header"
      data-hidden={hidden && !mobileOpen}
      data-solid={solid || mobileOpen}
      data-open={mobileOpen}
      onMouseLeave={() => setOpenIdx(null)}
    >
      <div className="cornell-header-inner">
        <Link href={home} className="cornell-brand" aria-label={`${brand} — home`}>
          <strong>Engineers Without Borders</strong>
          <small>University of Vermont Chapter</small>
        </Link>

        <nav className="cornell-nav">
          {nav.map((item, i) => (
            <div
              key={item.label}
              className="cornell-nav-item"
              onMouseEnter={() => item.children && setOpenIdx(i)}
            >
              <Link
                href={item.href}
                className="cornell-nav-link"
                data-active={isActive(item.href) ? "true" : undefined}
                onClick={() => setOpenIdx(null)}
              >
                {item.label}
              </Link>
              {item.children && openIdx === i && (
                <div className="cornell-dropdown">
                  <div className="cornell-dropdown-inner">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="cornell-dropdown-link"
                        data-active={pathname === c.href ? "true" : undefined}
                        onClick={() => setOpenIdx(null)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="cornell-menu-btn"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="cornell-mobile">
        {nav.map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              className="cornell-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
            {item.children?.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="cornell-mobile-child"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </header>
  );
}
