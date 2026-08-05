"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/pages";

export default function SiteHeader({
  nav,
  brand,
  basePath = "",
}: {
  nav: NavItem[];
  brand: string;
  /** Path root for a parallel route tree (e.g. "/stevens"). Default "" = canonical site. */
  basePath?: string;
}) {
  const pathname = usePathname();
  const home = basePath || "/";
  const overHero = pathname === home; // only the home page has a full-height dark hero
  const [hidden, setHidden] = useState(false);
  const [overDark, setOverDark] = useState(overHero);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    setOverDark(overHero);
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      if (y < 80) setHidden(false);
      else if (goingDown && y > 200) setHidden(true);
      else if (!goingDown) setHidden(false);
      lastY.current = y;

      // On the home hero, keep the dark translucent bar while over it.
      if (overHero) {
        setOverDark(y < window.innerHeight - 120);
      } else {
        setOverDark(false);
      }
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
      className="ewb-header"
      data-hidden={hidden}
      data-over-dark={overDark}
      onMouseLeave={() => setOpenIdx(null)}
    >
      <div className="ewb-header-inner">
        <Link href={home} className="ewb-brand" aria-label={`${brand} — home`}>
          EWB<small>UVM</small>
        </Link>

        <nav className="ewb-nav">
          {nav.map((item, i) => (
            <div
              key={item.label}
              className="ewb-nav-item"
              onMouseEnter={() => item.children && setOpenIdx(i)}
            >
              <Link
                href={item.href}
                className="ewb-nav-link"
                data-active={isActive(item.href) ? "true" : undefined}
                onClick={() => setOpenIdx(null)}
              >
                {item.label}
              </Link>
              {item.children && openIdx === i && (
                <div className="ewb-dropdown">
                  <div className="ewb-dropdown-inner">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="ewb-dropdown-link"
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
          <Link href="/login" className="ewb-nav-link ewb-nav-login">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
