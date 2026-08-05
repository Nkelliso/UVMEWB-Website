"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/pages";

/**
 * Immersive-route masthead (N6). Transparent white-on-photo over the home hero,
 * collapses to a solid deep-green bar on scroll and on interior pages. Uppercase
 * tracked links — the studied EWB Cal Poly type voice, dressed in UVM green+gold.
 * All hrefs arrive already prefixed with /immersive from the layout.
 *
 * Accessibility: submenus open on hover (mouse), on the caret toggle (touch +
 * keyboard, with aria-expanded), and close on Escape / outside-click. Below the
 * collapse breakpoint the nav becomes a full drawer behind a hamburger button,
 * and the dropdowns expand inline as accordions.
 */
export default function ImmersiveHeader({
  nav,
  brand,
  homeHref,
}: {
  nav: NavItem[];
  brand: string;
  homeHref: string;
}) {
  const pathname = usePathname();
  const overHero = pathname === homeHref; // only the immersive home has a full-height hero
  const [hidden, setHidden] = useState(false);
  const [overDark, setOverDark] = useState(overHero);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOverDark(overHero);
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      if (y < 80) setHidden(false);
      else if (goingDown && y > 200) setHidden(true);
      else if (!goingDown) setHidden(false);
      lastY.current = y;

      if (overHero) setOverDark(y < window.innerHeight - 120);
      else setOverDark(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overHero]);

  // Close everything on route change.
  useEffect(() => {
    setMenuOpen(false);
    setOpenIdx(null);
  }, [pathname]);

  // Escape closes; outside-click closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenIdx(null); setMenuOpen(false); }
    };
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenIdx(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className="imm-header"
      data-hidden={hidden}
      data-over-dark={overDark && !menuOpen}
      data-menu-open={menuOpen}
      onMouseLeave={() => setOpenIdx(null)}
    >
      <div className="imm-header-inner">
        <Link href={homeHref} className="imm-brand" aria-label={`${brand} — home`}>
          EWB<small>UVM</small>
        </Link>

        <button
          type="button"
          className="imm-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="imm-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav id="imm-nav" className="imm-nav" data-open={menuOpen}>
          {nav.map((item, i) => {
            const hasChildren = !!item.children?.length;
            const isOpen = openIdx === i;
            return (
              <div
                key={item.label}
                className="imm-nav-item"
                onMouseEnter={() => hasChildren && setOpenIdx(i)}
              >
                <div className="imm-nav-row">
                  <Link
                    href={item.href}
                    className="imm-nav-link"
                    data-active={isActive(item.href) ? "true" : undefined}
                    onClick={() => { setOpenIdx(null); setMenuOpen(false); }}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      className="imm-nav-caret"
                      aria-label={`${item.label} submenu`}
                      aria-expanded={isOpen}
                      aria-controls={`imm-sub-${i}`}
                      data-open={isOpen}
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                    >
                      <span aria-hidden>▾</span>
                    </button>
                  )}
                </div>
                {hasChildren && (
                  <div
                    id={`imm-sub-${i}`}
                    className="imm-dropdown"
                    data-open={isOpen}
                    role="menu"
                    aria-label={item.label}
                  >
                    <div className="imm-dropdown-inner">
                      {item.children!.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="imm-dropdown-link"
                          role="menuitem"
                          data-active={pathname === c.href ? "true" : undefined}
                          onClick={() => { setOpenIdx(null); setMenuOpen(false); }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
