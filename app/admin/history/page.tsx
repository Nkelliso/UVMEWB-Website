import { redirect } from "next/navigation";
import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import RestoreButton from "./RestoreButton";
import { isAuthed } from "@/lib/auth";
import { listVersions, type Version } from "@/lib/history";

/** Plain names for each stored section, in the order they're listed. */
const SECTIONS: { key: string; name: string; edit: string }[] = [
  { key: "projects", name: "Projects", edit: "/admin/projects" },
  { key: "settings", name: "Page words, contact page, site details & photos", edit: "/admin" },
  { key: "officers", name: "Officer board", edit: "/admin/officers" },
  { key: "sponsors", name: "Sponsors", edit: "/admin/sponsors" },
  { key: "page:about", name: "About page", edit: "/admin/edit/about" },
  { key: "page:mission-statement", name: "Mission statement page", edit: "/admin/edit/mission-statement" },
];

const SETTING_NAMES: Record<string, string> = {
  chapterName: "the club name",
  tagline: "the tagline",
  contactEmail: "the club email",
  contactPeople: "the contact people",
  instagram: "social media links",
  facebook: "social media links",
  linkedin: "social media links",
  sponsorshipPackageUrl: "the sponsorship packet link",
  logoUrl: "the logo",
  heroHeading: "the home page headline",
  heroSubline: "the home page headline",
  heroImages: "the home page photo",
  sectionImages: "page photos",
  home: "the home page sections",
  contactText: "the Contact page words",
  projectsText: "the Projects page words",
  sponsorsText: "the Sponsors page words and photos",
};

const OFFICER_NAMES: Record<string, string> = {
  asOf: "the year",
  facultyAdvisor: "the faculty advisor",
  executiveBoard: "the executive board",
  projectDirectors: "the project team leaders",
};

type Item = { title?: string; name?: string; slug?: string; order?: number };

function nameOf(x: Item) {
  return x.title || x.name || "an unnamed item";
}

function names(list: string[]) {
  const unique = [...new Set(list)];
  if (unique.length > 3) return `${unique.slice(0, 3).join(", ")} and ${unique.length - 3} more`;
  if (unique.length > 1) return `${unique.slice(0, -1).join(", ")} and ${unique[unique.length - 1]}`;
  return unique.join("");
}

/** One plain sentence describing what changed between two versions. */
function describe(key: string, older: unknown, newer: unknown): string {
  if (JSON.stringify(older) === JSON.stringify(newer)) return "Saved with no visible changes";

  if (Array.isArray(older) && Array.isArray(newer)) {
    // `order` is renumbered on every save, so ignore it when comparing.
    const strip = (x: Item) => JSON.stringify({ ...x, order: undefined });
    const id = (x: Item) => x.slug || nameOf(x);
    const oldMap = new Map((older as Item[]).map((x) => [id(x), x]));
    const newMap = new Map((newer as Item[]).map((x) => [id(x), x]));
    const added = (newer as Item[]).filter((x) => !oldMap.has(id(x))).map(nameOf);
    const removed = (older as Item[]).filter((x) => !newMap.has(id(x))).map(nameOf);
    const edited = (newer as Item[])
      .filter((x) => oldMap.has(id(x)) && strip(oldMap.get(id(x))!) !== strip(x))
      .map(nameOf);
    const parts: string[] = [];
    if (added.length) parts.push(`Added ${names(added)}`);
    if (removed.length) parts.push(`Removed ${names(removed)}`);
    if (edited.length) parts.push(`Edited ${names(edited)}`);
    const sameSet = !added.length && !removed.length;
    if (sameSet && (older as Item[]).map(id).join() !== (newer as Item[]).map(id).join())
      parts.push("Changed the order");
    return parts.join(" · ") || "Small edits";
  }

  if (key.startsWith("page:")) return "Edited the page";

  const a = (older ?? {}) as Record<string, unknown>;
  const b = (newer ?? {}) as Record<string, unknown>;
  const labels = key === "officers" ? OFFICER_NAMES : SETTING_NAMES;
  const changed = [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => labels[k] ?? "other details");
  return changed.length ? `Changed ${names(changed)}` : "Small edits";
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  if (!(await isAuthed())) redirect("/login");
  const result = await listVersions();

  const groups = result.ok
    ? SECTIONS.map((s) => ({
        ...s,
        versions: result.versions.filter((v) => v.key === s.key),
      })).filter((g) => g.versions.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <AdminTopBar title="Undo a mistake" />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Undo a mistake</h1>
        <div className="text-neutral-600 space-y-3 mb-10 max-w-2xl">
          <p>
            Every time someone clicks Save, the site keeps a copy here: the last 25 saves for each
            part of the site. If something went wrong, find the version from before the mistake and
            click <b>Restore this version</b>.
          </p>
          <p>Restoring counts as a new save, so if you restore the wrong one, you can undo that too.</p>
        </div>

        {!result.ok && result.reason === "not-set-up" && (
          <div className="border border-amber-300 bg-amber-50 rounded-lg p-5 text-amber-900">
            <p className="font-semibold mb-2">Version history isn&apos;t switched on for the live site yet.</p>
            <p className="text-sm">
              This is a one-time setup for whoever manages the site&apos;s Supabase account: open
              Supabase, go to <b>SQL Editor</b>, paste in the &quot;Version history&quot; part of{" "}
              <code>supabase/schema.sql</code>, and click <b>Run</b>. Saving still works normally in
              the meantime.
            </p>
          </div>
        )}
        {!result.ok && result.reason === "error" && (
          <p className="text-red-700">Couldn&apos;t load the history right now. Refresh the page to try again.</p>
        )}
        {result.ok && groups.length === 0 && (
          <p className="text-neutral-500">Nothing saved yet. Copies will show up here after the first save.</p>
        )}

        {groups.map((g) => (
          <details key={g.key} className="border border-neutral-300 rounded-lg bg-white mb-4 group">
            <summary className="cursor-pointer px-5 py-4 flex justify-between items-center gap-4">
              <span>
                <span className="block font-semibold">{g.name}</span>
                <span className="block text-sm text-neutral-500">
                  Last saved {when(g.versions[0].savedAt)} · {g.versions.length}{" "}
                  {g.versions.length === 1 ? "copy" : "copies"} kept
                </span>
              </span>
              <span className="text-sm text-neutral-500 shrink-0 group-open:hidden">Show ▼</span>
              <span className="text-sm text-neutral-500 shrink-0 hidden group-open:inline">Hide ▲</span>
            </summary>
            <ol className="border-t border-neutral-200">
              {g.versions.map((v: Version, i) => {
                const older = g.versions[i + 1];
                return (
                  <li
                    key={v.id}
                    className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-b border-neutral-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{when(v.savedAt)}</p>
                      <p className="text-sm text-neutral-500">
                        {older ? describe(g.key, older.value, v.value) : "The oldest copy kept"}
                      </p>
                    </div>
                    {i === 0 ? (
                      <span className="text-sm font-semibold text-green-800 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                        What&apos;s on the site now
                      </span>
                    ) : (
                      <RestoreButton id={v.id} />
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="px-5 py-3 border-t border-neutral-200 text-sm">
              <Link href={g.edit} className="underline text-neutral-600 hover:text-neutral-900">
                {g.key === "settings" ? "Back to all sections" : "Open this editor"}
              </Link>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
