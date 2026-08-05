"use client";

import { useState } from "react";
import AdminChrome, { Field, ImageField, Row, Card, AddButton } from "./AdminChrome";
import { saveSponsorsAction } from "@/app/admin/actions";
import type { Sponsor } from "@/lib/types";

export default function SponsorsForm({ initial }: { initial: Sponsor[] }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initial);

  const update = (i: number, patch: Partial<Sponsor>) =>
    setSponsors((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const remove = (i: number) =>
    setSponsors((s) => s.filter((_, j) => j !== i));
  const add = () =>
    setSponsors((s) => [...s, { name: "", tier: "Partners", url: "", logoUrl: "" }]);

  return (
    <AdminChrome
      title="Sponsors"
      intro="Sponsors are grouped on the site by their tier. Photos/logos are placeholders until you paste a logo URL."
      value={sponsors}
      onSave={saveSponsorsAction}
    >
      {sponsors.map((s, i) => (
        <Card key={i} onRemove={() => remove(i)}>
          <Row>
            <Field label="Name" value={s.name} onChange={(v) => update(i, { name: v })} />
            <Field label="Tier" value={s.tier} onChange={(v) => update(i, { tier: v })} placeholder="e.g. Founding Partners" />
          </Row>
          <Field label="Website URL (optional)" value={s.url ?? ""} onChange={(v) => update(i, { url: v })} placeholder="https://…" />
          <ImageField label="Logo (optional)" value={s.logoUrl ?? ""} onChange={(v) => update(i, { logoUrl: v })} />
        </Card>
      ))}
      <AddButton label="Add sponsor" onClick={add} />
    </AdminChrome>
  );
}
