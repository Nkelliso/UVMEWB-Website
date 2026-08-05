"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Floating design-edition switcher. Lets you jump between the canonical UVM site
 * and each parallel re-skin (/immersive, /stevens, /cornell) while preserving the
 * current sub-page (e.g. /immersive/about → /stevens/about). Purely a
 * dev/demo/preview control — deliberately theme-agnostic (inline styles, its own
 * dark pill) so it looks identical on every edition and can't be broken by a
 * scoped `.theme-*` layer. Mounted in each edition's layout, so it never appears
 * on /admin or /login.
 */

type Edition = { id: string; label: string; base: string };

const EDITIONS: Edition[] = [
  { id: "uvm", label: "UVM · canonical", base: "" },
  { id: "immersive", label: "Cal Poly", base: "/immersive" },
  { id: "stevens", label: "Stevens", base: "/stevens" },
  { id: "cornell", label: "Cornell", base: "/cornell" },
];

/** Split a pathname into the edition it belongs to and the shared sub-path. */
function locate(pathname: string): { current: Edition; sub: string } {
  // Longest matching base wins; "" (canonical) is the fallback.
  const match = EDITIONS.filter((e) => e.base !== "")
    .sort((a, b) => b.base.length - a.base.length)
    .find(
      (e) => pathname === e.base || pathname.startsWith(e.base + "/")
    );
  const current = match ?? EDITIONS[0];
  const sub = current.base ? pathname.slice(current.base.length) : pathname;
  return { current, sub };
}

/** Build the href for `target` that keeps the same sub-page as the current one. */
function hrefFor(target: Edition, sub: string): string {
  const clean = sub === "/" ? "" : sub; // treat bare "/" as home
  if (!target.base) return clean || "/"; // canonical
  return clean ? `${target.base}${clean}` : target.base;
}

export default function EditionSwitcher() {
  const pathname = usePathname() || "/";
  const { current, sub } = locate(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={styles.root}>
      {open && (
        <div role="menu" style={styles.menu}>
          <div style={styles.menuLabel}>Design edition</div>
          {EDITIONS.map((e) => {
            const isCurrent = e.id === current.id;
            return (
              <Link
                key={e.id}
                href={hrefFor(e, sub)}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.item,
                  ...(isCurrent ? styles.itemCurrent : null),
                }}
              >
                <span style={styles.dot(isCurrent)} />
                {e.label}
                {isCurrent && <span style={styles.check}>✓</span>}
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={styles.pill}
      >
        <span style={styles.swatch} />
        <span style={styles.pillText}>{current.label}</span>
        <span style={styles.caret(open)}>▲</span>
      </button>
    </div>
  );
}

const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const styles = {
  root: {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    zIndex: 2147483000,
    fontFamily: FONT,
  } as React.CSSProperties,
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(17,19,23,0.82)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#f5f5f4",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: "pointer",
    boxShadow: "0 6px 22px rgba(0,0,0,0.28)",
  } as React.CSSProperties,
  swatch: {
    width: "9px",
    height: "9px",
    borderRadius: "999px",
    background: "linear-gradient(135deg,#2f6b3d,#e0b429)",
    flex: "0 0 auto",
  } as React.CSSProperties,
  pillText: { whiteSpace: "nowrap" } as React.CSSProperties,
  caret: (open: boolean) =>
    ({
      fontSize: "9px",
      opacity: 0.7,
      transition: "transform 0.15s ease",
      transform: open ? "rotate(0deg)" : "rotate(180deg)",
    }) as React.CSSProperties,
  menu: {
    position: "absolute",
    right: 0,
    bottom: "calc(100% + 8px)",
    minWidth: "210px",
    padding: "6px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(17,19,23,0.92)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
  } as React.CSSProperties,
  menuLabel: {
    padding: "6px 10px 8px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "rgba(245,245,244,0.5)",
  } as React.CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px 10px",
    borderRadius: "9px",
    color: "#f5f5f4",
    fontSize: "13.5px",
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
  } as React.CSSProperties,
  itemCurrent: {
    background: "rgba(255,255,255,0.08)",
    fontWeight: 700,
  } as React.CSSProperties,
  dot: (on: boolean) =>
    ({
      width: "7px",
      height: "7px",
      borderRadius: "999px",
      flex: "0 0 auto",
      background: on ? "#e0b429" : "rgba(255,255,255,0.28)",
    }) as React.CSSProperties,
  check: {
    marginLeft: "auto",
    fontSize: "12px",
    color: "#e0b429",
  } as React.CSSProperties,
};
