import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { isAuthed } from "@/lib/auth";

function Topic({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-neutral-300 pt-8 mt-8 first:border-t-0 first:pt-0 first:mt-0">
      <h2 className="text-xl font-bold tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-neutral-700 leading-relaxed">{children}</div>
    </section>
  );
}

export default async function HelpPage() {
  if (!(await isAuthed())) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <AdminTopBar title="How to edit the site" />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-10">How to edit the site</h1>

        <Topic title="Making a change">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              From <Link href="/admin" className="underline">the start screen</Link>, find the page
              you want to change and click what you want to do.
            </li>
            <li>Make your edits. Each box says what it is and where it shows up on the site.</li>
            <li>
              Click <b>Save changes</b> in the black bar at the top. Your change is live on the
              website right away.
            </li>
          </ol>
          <p>
            If the Save button is greyed out, there&apos;s nothing new to save. If you try to leave
            with unsaved edits, your browser will ask you first.
          </p>
        </Topic>

        <Topic title="Fixing a mistake">
          <p>
            If you haven&apos;t saved yet, the <b>Undo</b> button in the top bar brings back anything
            you just removed, added, or moved. <b>Discard changes</b> throws away everything since
            your last save.
          </p>
          <p>
            If you already saved, go to <Link href="/admin/history" className="underline">Undo a mistake</Link>.
            It keeps the last 25 saves for each part of the site. Find the version from before the
            problem and click <b>Restore this version</b>.
          </p>
        </Topic>

        <Topic title="Photos">
          <p>
            Use the original, full-size photo whenever you can. AirDrop keeps the full size,
            and so does downloading the original file from Google Drive or iCloud. If a photo is too
            small, the editor shows a yellow warning under it. Big photos straight off a phone are
            fine: the editor shrinks them to web size when you upload, and removes hidden details
            like the location the photo was taken.
          </p>
          <p>
            Wide (landscape) photos work best for page headers. To crop a photo or make it brighter,
            use <Link href="/admin/photos" className="underline">Photos</Link>.
          </p>
        </Topic>

        <Topic title="Projects">
          <p>
            Click a project to open it. The arrows change the order projects appear in on the site
            and in the menu.
          </p>
          <p>
            New projects start hidden, so you can build them without anyone seeing a half-finished
            page. When it&apos;s ready, tick <b>Show this project on the website</b> and save. To
            take a project down without deleting it, untick the same box.
          </p>
        </Topic>

        <Topic title="The About and Mission statement pages">
          <p>
            These open a drag-and-drop editor. Click any block on the page to change its text, drag
            blocks to reorder them, and click <b>Publish</b> in the top-right corner when
            you&apos;re done. Publishing works like Save: it&apos;s live right away and can be
            undone from Undo a mistake.
          </p>
        </Topic>

        <Topic title="Messages and the email list">
          <p>
            The <Link href="/admin/inbox" className="underline">Inbox</Link> has messages people
            sent through the website and everyone who signed up for the email list. The email list
            tab has every address ready to copy into the BCC line of an email, or to paste into the
            club listserv.
          </p>
        </Topic>

        <Topic title="Handing the site to next year's officers">
          <ul className="list-disc pl-5 space-y-2">
            <li>Update the officer board and the contact people on the Contact page.</li>
            <li>
              Give the new webmaster the admin password. It&apos;s set in the site&apos;s hosting
              account (Vercel), so whoever manages that can change it at the start of each year.
            </li>
          </ul>
        </Topic>
        <p className="text-sm text-neutral-500 border-t border-neutral-300 pt-6 mt-12">
          This website was originally made by Nathan and Sophie.
        </p>
      </div>
    </div>
  );
}
