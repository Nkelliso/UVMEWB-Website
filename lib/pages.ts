import type { Project } from "./types";

/** Pages whose content is edited with the Puck drag-and-drop builder. */
export interface EditablePage {
  slug: string;
  title: string;
  path: string;
}

export const EDITABLE_PAGES: EditablePage[] = [
  { slug: "home", title: "Home", path: "/" },
  { slug: "about", title: "About", path: "/about" },
  {
    slug: "mission-statement",
    title: "Mission Statement",
    path: "/about/mission-statement",
  },
];

export function getEditablePage(slug: string): EditablePage | undefined {
  return EDITABLE_PAGES.find((p) => p.slug === slug);
}

export function isEditablePage(slug: string): boolean {
  return EDITABLE_PAGES.some((p) => p.slug === slug);
}

/* ── Navigation ───────────────────────────────────────────── */

export interface NavChild {
  label: string;
  href: string;
}
export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

function shortLabel(title: string): string {
  return title.split("—")[0].trim();
}

/** Build the top nav. Projects dropdown is populated from live project data so
 *  adding a project in /admin updates the menu everywhere.
 *
 *  `prefix` lets a parallel route tree (e.g. the `/cornell` design version) reuse
 *  the same nav with its own path root. Default "" preserves the canonical site. */
export function buildNav(projects: Project[], prefix = ""): NavItem[] {
  const p = (href: string) =>
    prefix ? (href === "/" ? prefix : `${prefix}${href}`) : href;

  const projectChildren: NavChild[] = [
    { label: "All Projects", href: p("/projects") },
    ...projects
      .filter((proj) => proj.published)
      .sort((a, b) => a.order - b.order)
      .map((proj) => ({
        label: proj.navLabel ?? shortLabel(proj.title),
        href: p(`/projects/${proj.slug}`),
      })),
  ];

  return [
    { label: "Home", href: p("/") },
    {
      label: "About",
      href: p("/about"),
      children: [
        { label: "About", href: p("/about") },
        { label: "Mission Statement", href: p("/about/mission-statement") },
        { label: "Officer Board", href: p("/about/officer-board") },
      ],
    },
    { label: "Projects", href: p("/projects"), children: projectChildren },
    { label: "Contact", href: p("/contact") },
    { label: "Sponsors", href: p("/sponsors") },
  ];
}
