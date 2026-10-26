"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/pages";

/** A photo-overlay masthead that stays at the start of the document.
 * Desktop dropdowns support hover, disclosure buttons, and keyboard focus.
 * On smaller screens the menu expands below the header and scrolls with it.
 * Reference: the spacious wordmark/navigation on uvmssc.org (2026-10-26).
 */
export default function ImmersiveHeader({
  nav,
  brand,
  homeHref,
  logoUrl,
}: {
  nav: NavItem[];
  brand: string;
  homeHref: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Reset disclosure state when navigation changes the route, including Back.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
    setOpenIdx(null);
  }

  useEffect(() => {
    const close = () => { setOpenIdx(null); setMenuOpen(false); };
    const onDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) close();
    };
    const breakpoint = window.matchMedia("(max-width: 1000px)");
    document.addEventListener("pointerdown", onDown);
    breakpoint.addEventListener("change", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      breakpoint.removeEventListener("change", close);
    };
  }, []);

  const isDesktop = () => window.matchMedia("(min-width: 1001px)").matches;
  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);
  const close = () => { setOpenIdx(null); setMenuOpen(false); };
  // Preserve the official chapter lockup. The SVG is the same artwork,
  // trimmed to its bounds so it stays sharp and readable at larger sizes.
  const chapterLogo = !logoUrl || logoUrl === "/logo.png" ? "/logo.svg" : logoUrl;

  return (
    <header
      ref={headerRef}
      className="imm-header"
      data-over-dark="true"
      data-menu-open={menuOpen}
      onMouseLeave={() => { if (isDesktop()) setOpenIdx(null); }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        if (menuOpen) burgerRef.current?.focus();
        else if (openIdx !== null) {
          headerRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="imm-sub-${openIdx}"]`)?.focus();
        }
        close();
      }}
    >
      <div className="imm-header-inner">
        <Link href={homeHref} className="imm-brand" aria-label={`${brand} home`} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chapterLogo} alt={brand} className="imm-brand-logo" />
        </Link>

        <button
          ref={burgerRef}
          type="button"
          className="imm-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="imm-nav"
          onClick={() => { setMenuOpen((value) => !value); setOpenIdx(null); }}
        >
          <span /><span /><span />
        </button>

        <nav id="imm-nav" className="imm-nav" aria-label="Main navigation" data-open={menuOpen}>
          {nav.map((item, i) => {
            const hasChildren = !!item.children?.length;
            const isOpen = openIdx === i;
            return (
              <div
                key={item.label}
                className="imm-nav-item"
                onMouseEnter={() => { if (isDesktop()) setOpenIdx(hasChildren ? i : null); }}
              >
                <div className="imm-nav-row">
                  <Link
                    href={item.href}
                    className="imm-nav-link"
                    data-active={isActive(item.href) ? "true" : undefined}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onFocus={() => { if (isDesktop()) setOpenIdx(hasChildren ? i : null); }}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowDown" || !hasChildren) return;
                      event.preventDefault();
                      setOpenIdx(i);
                      requestAnimationFrame(() => {
                        headerRef.current?.querySelector<HTMLAnchorElement>(`#imm-sub-${i} a`)?.focus();
                      });
                    }}
                    onClick={close}
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
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  )}
                </div>
                {hasChildren && (
                  <div id={`imm-sub-${i}`} className="imm-dropdown" data-open={isOpen}>
                    <div className="imm-dropdown-inner">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="imm-dropdown-link"
                          data-active={pathname === child.href ? "true" : undefined}
                          aria-current={pathname === child.href ? "page" : undefined}
                          onClick={close}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/contact"
            className="imm-nav-cta"
            onMouseEnter={() => { if (isDesktop()) setOpenIdx(null); }}
            onFocus={() => setOpenIdx(null)}
            aria-current={pathname === "/contact" ? "page" : undefined}
            onClick={close}
          >
            Get involved
          </Link>
        </nav>
      </div>
    </header>
  );
}
