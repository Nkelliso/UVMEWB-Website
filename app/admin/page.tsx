import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { isAuthed } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { listContactSubmissions, getSettings, getOfficers } from "@/lib/store";
import { DEFAULT_CONTACT_PEOPLE } from "@/lib/contact-people";

// Must match SIGNUP_TAG in app/actions.ts (see /admin/inbox).
const SIGNUP_TAG = "Email list signup";

/** The admin home mirrors the website's own menu, so "I want to change X on
 *  the Y page" leads straight to the right screen. */
const PAGES: {
  name: string;
  path: string;
  actions: { label: string; href: string; note?: string }[];
}[] = [
  {
    name: "Home page",
    path: "/",
    actions: [
      { label: "Change the words", href: "/admin/home" },
      { label: "Change the photos", href: "/admin/photos" },
    ],
  },
  {
    name: "About",
    path: "/about",
    actions: [
      { label: "Edit the About page", href: "/admin/edit/about", note: "drag-and-drop editor" },
      { label: "Edit the Mission statement", href: "/admin/edit/mission-statement", note: "drag-and-drop editor" },
      { label: "Update the officer board", href: "/admin/officers" },
    ],
  },
  {
    name: "Projects",
    path: "/projects",
    actions: [
      { label: "Edit projects", href: "/admin/projects", note: "each project's page, photos, order, show or hide" },
      { label: "Change the page title and intro", href: "/admin/projects-page" },
    ],
  },
  {
    name: "Sponsors",
    path: "/sponsors",
    actions: [
      { label: "Edit sponsors and logos", href: "/admin/sponsors" },
      { label: "Change the words and photos", href: "/admin/sponsors-page" },
      { label: "Change the sponsorship packet link", href: "/admin/settings" },
    ],
  },
  {
    name: "Contact",
    path: "/contact",
    actions: [
      { label: "Change the words, meeting info, club email, and contact people", href: "/admin/contact" },
    ],
  },
];

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/login");
  const live = isSupabaseConfigured();
  const [submissions, settings, officers] = await Promise.all([
    listContactSubmissions(),
    getSettings(),
    getOfficers(),
  ]);
  const signups = submissions.filter((s) => s.message === SIGNUP_TAG).length;
  const messages = submissions.length - signups;

  // Start-of-year checklist. Live: an item turns amber when what's saved right
  // now needs a look (e.g. a contact person with no email).
  const people = settings.contactPeople?.length ? settings.contactPeople : DEFAULT_CONTACT_PEOPLE;
  const socials = [settings.instagram, settings.facebook, settings.linkedin].filter(Boolean).length;
  const checklist: { label: string; href: string; attention?: boolean }[] = [
    { label: "Update the officer board", href: "/admin/officers", attention: !officers.asOf },
    {
      label: "Update the contact people",
      href: "/admin/contact",
      attention: people.some((p) => !p.email?.trim()),
    },
    { label: "Update this semester's meeting info", href: "/admin/contact" },
    { label: "Check the club email", href: "/admin/contact", attention: !settings.contactEmail },
    { label: "Check the social media links", href: "/admin/settings", attention: socials === 0 },
  ];
  const needsLook = checklist.filter((c) => c.attention).length;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <AdminTopBar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <p
          className={`inline-block text-sm font-medium px-3 py-1.5 rounded-full mb-6 ${
            live ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"
          }`}
        >
          {live
            ? "You're editing the live website. Saved changes show up right away."
            : "Practice mode: changes save on this computer only and won't appear on the live website."}
        </p>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit the website</h1>
        <p className="text-neutral-600 max-w-2xl mb-10">
          Pick the page you want to change. Nothing changes until you click <b>Save changes</b>, and
          every save can be undone from <Link href="/admin/history" className="underline">Undo a mistake</Link>.
        </p>


        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
          <div>
            <h2 className="text-sm font-semibold text-neutral-500 mb-3">Pages on the website</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {PAGES.map((p) => (
                <div key={p.name} className="border border-neutral-300 rounded-lg bg-white p-5">
                  <div className="flex justify-between items-baseline gap-3 mb-3">
                    <p className="text-lg font-bold">{p.name}</p>
                    <a href={p.path} target="_blank" rel="noreferrer" className="text-sm text-neutral-500 underline hover:text-neutral-900 shrink-0">
                      View ↗
                    </a>
                  </div>
                  <ul className="space-y-2">
                    {p.actions.map((a) => (
                      <li key={a.href + a.label}>
                        <Link href={a.href} className="group block">
                          <span className="font-medium underline decoration-neutral-300 group-hover:decoration-neutral-900">
                            {a.label} →
                          </span>
                          {a.note && <span className="block text-sm text-neutral-500">{a.note}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="text-sm font-semibold text-neutral-500 mt-10 mb-3">On every page</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/admin/settings" className="block border border-neutral-300 rounded-lg bg-white p-5 hover:border-neutral-900">
                <p className="text-lg font-bold">Site details</p>
                <p className="text-sm text-neutral-500 mt-1">Club name, logo, social media links, sponsorship packet</p>
              </Link>
              <Link href="/admin/photos" className="block border border-neutral-300 rounded-lg bg-white p-5 hover:border-neutral-900">
                <p className="text-lg font-bold">Photos</p>
                <p className="text-sm text-neutral-500 mt-1">Swap, crop, or brighten the big photo on any page</p>
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <Link
              href="/admin/help"
              className="block rounded-lg bg-amber-300 text-neutral-950 p-5 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <p className="text-lg font-bold">How to edit the site →</p>
              <p className="text-sm mt-1">Start here if you&apos;re new.</p>
            </Link>
            <details className="group border border-neutral-300 rounded-lg bg-white">
              <summary className="cursor-pointer list-none p-5 hover:bg-neutral-50 rounded-lg">
                <span className="flex justify-between items-baseline gap-3">
                  <span className="text-lg font-bold">Start of year checklist</span>
                  <span className="text-sm text-neutral-500 shrink-0 group-open:hidden">Show ▼</span>
                  <span className="text-sm text-neutral-500 shrink-0 hidden group-open:inline">Hide ▲</span>
                </span>
                <span className="block text-sm text-neutral-500 mt-1">
                  {needsLook > 0
                    ? `${needsLook} of ${checklist.length} ${needsLook === 1 ? "needs" : "need"} a look`
                    : `${checklist.length} things to check when officers change`}
                </span>
              </summary>
              <ol className="px-5 pb-5 space-y-2.5">
                {checklist.map((c, i) => (
                  <li key={c.label} className="flex gap-3 items-start">
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${
                        c.attention ? "bg-amber-300 text-amber-950" : "bg-neutral-200 text-neutral-700"
                      }`}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <Link href={c.href} className="font-medium underline decoration-neutral-300 hover:decoration-neutral-900">
                      {c.label}
                      {c.attention && <span className="sr-only"> (needs a look)</span>}
                    </Link>
                  </li>
                ))}
              </ol>
            </details>
            <Link href="/admin/inbox" className="block border border-neutral-300 rounded-lg bg-white p-5 hover:border-neutral-900">
              <p className="text-lg font-bold">Inbox</p>
              <p className="text-sm text-neutral-500 mt-1">
                {messages} {messages === 1 ? "message" : "messages"} · {signups} email list{" "}
                {signups === 1 ? "signup" : "signups"}
              </p>
            </Link>
            <Link href="/admin/history" className="block border border-neutral-300 rounded-lg bg-white p-5 hover:border-neutral-900">
              <p className="text-lg font-bold">Undo a mistake</p>
              <p className="text-sm text-neutral-500 mt-1">Go back to any recent saved version</p>
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-neutral-500 underline hover:text-neutral-900">
                Log out
              </button>
            </form>
            <p className="text-sm text-neutral-500">This website was originally made by Nathan and Sophie.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
