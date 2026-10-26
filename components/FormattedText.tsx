import type { ReactNode } from "react";

/**
 * Renders the small formatting language the page editor's text boxes write:
 *
 *   **bold**   *italic*   [link text](https://…)   "- " at the start of a line = bullet
 *   a blank line starts a new paragraph; a single line break stays a line break
 *
 * Everything becomes React elements (never raw HTML), and links only accept
 * http(s), mailto: and on-site "/" paths, so pasted text can't inject markup
 * or javascript: links. Plain text without any markers renders as before.
 */

const INLINE = /(\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\))/g;

export function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\//i.test(h) || /^mailto:/i.test(h)) return h;
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  if (h.startsWith("#")) return h;
  return null;
}

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[2] !== undefined) out.push(<strong key={k}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<em key={k}>{m[3]}</em>);
    else {
      const href = safeHref(m[5]);
      const external = href && /^https?:/i.test(href);
      out.push(
        href ? (
          <a key={k} className="ewb-rich-link" href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {m[4]}
          </a>
        ) : (
          m[4]
        )
      );
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function withBreaks(lines: string[], key: string): ReactNode[] {
  return lines.flatMap((line, i) => (i === 0 ? inline(line, `${key}-${i}`) : [<br key={`${key}-br${i}`} />, ...inline(line, `${key}-${i}`)]));
}

const BULLET = /^\s*[-•]\s+/;

export default function FormattedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (!lines.length) return null;
        if (lines.every((l) => BULLET.test(l))) {
          return (
            <ul key={bi} className={`ewb-rich-list${className ? ` ${className}` : ""}`}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(BULLET, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className={className}>
            {withBreaks(lines, `${bi}`)}
          </p>
        );
      })}
    </>
  );
}
