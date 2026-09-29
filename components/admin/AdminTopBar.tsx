import Link from "next/link";

/** Top bar for admin screens that don't have a Save button (home, inbox,
 *  history, help). Editing screens use AdminChrome instead. */
export default function AdminTopBar({ title }: { title?: string }) {
  return (
    <div className="bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center">
          {title ? (
            <>
              <Link href="/admin" className="text-neutral-400 text-sm hover:text-white">
                ← All sections
              </Link>
              <span className="font-bold text-sm">{title}</span>
            </>
          ) : (
            <span className="font-bold text-sm">EWB UVM website editor</span>
          )}
        </div>
        <div className="flex gap-5 items-center text-sm">
          <Link href="/admin/help" className="text-amber-300 hover:text-amber-200 font-semibold">
            How to edit the site
          </Link>
          <Link href="/" className="text-neutral-400 hover:text-white">
            View the website
          </Link>
        </div>
      </div>
    </div>
  );
}
