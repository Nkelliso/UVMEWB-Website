import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions";
import { EDITABLE_PAGES } from "@/lib/pages";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const DATA_SECTIONS = [
  { href: "/admin/photos", title: "Photos", note: "Upload, crop, color-adjust & place site photos" },
  { href: "/admin/officers", title: "Officer Board", note: "Executive board, advisor, project directors" },
  { href: "/admin/projects", title: "Projects", note: "International, domestic & local projects" },
  { href: "/admin/sponsors", title: "Sponsors", note: "Partners and sponsor tiers" },
  { href: "/admin/settings", title: "Site Settings", note: "Chapter name, tagline, hero, contact email" },
];

export default async function AdminPage() {
  const store = await cookies();
  if (!store.get("ewb_auth")) redirect("/login");
  const live = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="flex justify-between items-center px-8 py-4 bg-neutral-950">
        <span className="text-white font-bold tracking-tight text-sm">
          EWB-UVM — Admin
        </span>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-neutral-400 text-sm hover:text-white transition-colors">
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="text-neutral-500 text-sm hover:text-white transition-colors">
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-14">
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 ${
            live ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {live
            ? "● Connected to Supabase — edits go live"
            : "● Local mode — edits save to /data files (connect Supabase to go live)"}
        </span>

        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Page layouts</p>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Edit the website</h1>

        <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white mb-10">
          {EDITABLE_PAGES.map((p) => (
            <div
              key={p.slug}
              className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 last:border-b-0"
            >
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-neutral-500 font-mono">{p.path}</p>
              </div>
              <div className="flex gap-3 items-center">
                <Link href={p.path} className="text-sm text-neutral-500 hover:text-neutral-900">
                  Preview
                </Link>
                <Link
                  href={`/admin/edit/${p.slug}`}
                  className="bg-neutral-950 text-white font-semibold text-xs uppercase tracking-wide px-5 py-2.5 rounded hover:bg-neutral-800 transition-colors"
                >
                  Edit layout
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Chapter content</p>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Update the details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {DATA_SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block border border-neutral-300 rounded-lg bg-white p-6 hover:border-neutral-900 transition-colors"
            >
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.note}</p>
            </Link>
          ))}
        </div>

        <p className="text-sm text-neutral-500 mt-8">
          <b>Page layouts</b> open a drag-and-drop builder — add sections, edit text, hit Publish.
          <br />
          <b>Chapter content</b> uses simple forms for the things that change every year.
        </p>
      </div>
    </div>
  );
}
