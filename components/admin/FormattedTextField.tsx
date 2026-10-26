"use client";

import { useRef } from "react";
import { safeHref } from "@/components/FormattedText";

/** Text box with a small toolbar for the page editor. The buttons write the
 *  simple markers FormattedText understands (**bold**, *italic*, [text](link),
 *  "- " bullets), so officers never have to type them by hand. */
export default function FormattedTextField({
  value,
  onChange,
  rows = 5,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  readOnly?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(edit: (selected: string) => string | null) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const replaced = edit(value.slice(a, b));
    if (replaced === null) return;
    const next = value.slice(0, a) + replaced + value.slice(b);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a, a + replaced.length);
    });
  }

  const wrap = (marker: string, fallback: string) =>
    apply((sel) => `${marker}${sel || fallback}${marker}`);

  const link = () =>
    apply((sel) => {
      const href = window.prompt("Paste the web address for this link (for example https://… or /contact):");
      if (!href) return null;
      if (!safeHref(href)) {
        window.alert("Links need to start with https://, mailto:, or / for a page on this site.");
        return null;
      }
      return `[${sel || "link text"}](${href.trim()})`;
    });

  const bullets = () =>
    apply((sel) =>
      (sel || "First item\nSecond item")
        .split("\n")
        .map((l) => (l.trim() ? `- ${l.replace(/^\s*[-•]\s+/, "")}` : l))
        .join("\n")
    );

  const btn =
    "px-2.5 py-1 text-sm border border-neutral-300 rounded bg-white hover:border-neutral-900 disabled:opacity-40";

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5" role="toolbar" aria-label="Text formatting">
        <button type="button" className={`${btn} font-bold`} disabled={readOnly} onClick={() => wrap("**", "bold text")}>
          Bold
        </button>
        <button type="button" className={`${btn} italic`} disabled={readOnly} onClick={() => wrap("*", "italic text")}>
          Italic
        </button>
        <button type="button" className={`${btn} underline`} disabled={readOnly} onClick={link}>
          Link
        </button>
        <button type="button" className={btn} disabled={readOnly} onClick={bullets}>
          • Bullet list
        </button>
      </div>
      <textarea
        ref={ref}
        className="w-full border border-neutral-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        rows={rows}
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-neutral-500 mt-1">
        Select some words, then click a button. Leave an empty line to start a new paragraph. The page
        preview shows how it will look.
      </p>
    </div>
  );
}
