"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreVersionAction } from "@/app/admin/actions";

export default function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function restore() {
    setStatus("working");
    try {
      await restoreVersionAction(id);
      router.refresh();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="flex items-center gap-3">
      {status === "error" && <span className="text-sm text-red-700">Couldn&apos;t restore. Try again.</span>}
      <button
        type="button"
        onClick={restore}
        disabled={status === "working"}
        className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 bg-white hover:border-neutral-900 disabled:opacity-50"
      >
        {status === "working" ? "Restoring…" : "Restore this version"}
      </button>
    </span>
  );
}
