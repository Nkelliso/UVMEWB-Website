"use client";

import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck-config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PuckEditor({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [data, setData] = useState<Data | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/page-data?slug=${slug}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ root: {}, content: [] } as Data));
  }, [slug]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-500">
        Loading editor…
      </div>
    );
  }

  return (
    <Puck
      config={puckConfig}
      data={data}
      iframe={{ enabled: false }}
      headerPath={title}
      onPublish={async (updated) => {
        await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, data: updated }),
        });
        router.push("/admin");
      }}
      overrides={{
        headerActions: ({ children }) => (
          <>
            <Link
              href="/admin"
              className="flex items-center px-3 text-sm text-neutral-600 hover:text-neutral-900"
            >
              ← Admin
            </Link>
            {children}
          </>
        ),
      }}
    />
  );
}
