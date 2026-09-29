import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import { listContactSubmissions } from "@/lib/store";

// Must match SIGNUP_TAG in app/actions.ts: email-list signups share the
// contact_submissions table and are told apart by this message value.
const SIGNUP_TAG = "Email list signup";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Full token check, not cookie presence: this page shows people's emails.
  if (!(await isAuthed())) redirect("/login");

  const tab = (await searchParams).tab === "signups" ? "signups" : "messages";
  const all = await listContactSubmissions();
  const signups = all.filter((s) => s.message === SIGNUP_TAG);
  const messages = all.filter((s) => s.message !== SIGNUP_TAG);

  const tabs = [
    { key: "messages", label: "Messages", count: messages.length },
    { key: "signups", label: "Email list", count: signups.length },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="flex justify-between items-center px-8 py-4 bg-neutral-950">
        <Link href="/admin" className="text-white font-bold tracking-tight text-sm">
          ← EWB-UVM Admin
        </Link>
        <Link href="/" className="text-neutral-400 text-sm hover:text-white transition-colors">
          View site
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-14">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Inbox</p>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Contact submissions</h1>

        <div className="flex gap-2 mb-8" role="tablist">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/admin/inbox?tab=${t.key}`}
              role="tab"
              aria-selected={tab === t.key}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                tab === t.key
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900"
              }`}
            >
              {t.label} ({t.count})
            </Link>
          ))}
        </div>

        {tab === "messages" &&
          (messages.length === 0 ? (
            <p className="text-neutral-500">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((m, i) => (
                <li key={m.id ?? i} className="border border-neutral-300 rounded-lg bg-white p-6">
                  <div className="flex flex-wrap justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="text-sm text-neutral-600 underline hover:text-neutral-900">
                        {m.email}
                      </a>
                    </div>
                    <p className="text-sm text-neutral-500">{formatDate(m.createdAt)}</p>
                  </div>
                  <p className="whitespace-pre-wrap text-neutral-800">{m.message}</p>
                </li>
              ))}
            </ul>
          ))}

        {tab === "signups" &&
          (signups.length === 0 ? (
            <p className="text-neutral-500">No email-list signups yet.</p>
          ) : (
            <>
              <label className="block mb-8">
                <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                  All addresses (paste into BCC)
                </span>
                <textarea
                  readOnly
                  rows={3}
                  className="w-full border border-neutral-300 rounded px-3 py-2 bg-white font-mono text-sm"
                  value={[...new Set(signups.map((s) => s.email))].join(", ")}
                />
              </label>
              <label className="block mb-8">
                <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                  Listserv bulk add (one &quot;email Full Name&quot; per line)
                </span>
                <textarea
                  readOnly
                  rows={Math.min(8, signups.length + 1)}
                  className="w-full border border-neutral-300 rounded px-3 py-2 bg-white font-mono text-sm"
                  value={[...new Map(signups.map((s) => [s.email.toLowerCase(), s])).values()]
                    .map((s) => `${s.email} ${s.name}`)
                    .join("\n")}
                />
                <span className="block text-sm text-neutral-500 mt-1">
                  Paste into the listserv&apos;s bulk add page (needs list owner access).
                </span>
              </label>
              <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white">
                {signups.map((s, i) => (
                  <div
                    key={s.id ?? i}
                    className="flex flex-wrap justify-between gap-2 px-6 py-3 border-b border-neutral-200 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-neutral-600">{s.email}</p>
                    </div>
                    <p className="text-sm text-neutral-500">{formatDate(s.createdAt)}</p>
                  </div>
                ))}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
