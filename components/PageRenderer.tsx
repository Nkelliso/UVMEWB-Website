"use client";

import { Render } from "@measured/puck";
import type { Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck-config";

/** Prefix internal ("/"-rooted) hrefs in Puck props with a route base so a
 *  site is served from the root, so this is "" in practice.
 *  Default basePath "" is a no-op — the canonical site renders unchanged. */
function withBasePath(data: Data, basePath: string): Data {
  if (!basePath) return data;

  const fix = (v: string) =>
    v.startsWith("/") &&
    !v.startsWith("//") &&
    v !== basePath &&
    !v.startsWith(`${basePath}/`)
      ? `${basePath}${v}`
      : v;

  const mapProps = (props: Record<string, unknown> = {}) => {
    const out: Record<string, unknown> = { ...props };
    for (const key of Object.keys(out)) {
      if (/href$/i.test(key) && typeof out[key] === "string") {
        out[key] = fix(out[key] as string);
      }
    }
    return out;
  };

  type Item = { props?: Record<string, unknown> };
  const mapItems = (items: Item[] = []) =>
    items.map((it) => ({ ...it, props: mapProps(it.props) }));

  const next = { ...data, content: mapItems(data.content as Item[]) } as Data;
  if (data.zones) {
    next.zones = Object.fromEntries(
      Object.entries(data.zones).map(([zone, items]) => [
        zone,
        mapItems(items as Item[]),
      ])
    ) as Data["zones"];
  }
  return next;
}

export default function PageRenderer({
  data,
  basePath = "",
}: {
  data: Data;
  /** Path root for a parallel route tree. Default "" = canonical site. */
  basePath?: string;
}) {
  return <Render config={puckConfig} data={withBasePath(data, basePath)} />;
}
