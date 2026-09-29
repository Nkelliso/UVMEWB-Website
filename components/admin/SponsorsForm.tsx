"use client";

import AdminChrome, { Field, ImageField, Card, AddButton, MoveButtons } from "./AdminChrome";
import { useEditable, move } from "./useEditable";
import { saveSponsorsAction } from "@/app/admin/actions";
import type { Sponsor } from "@/lib/types";

export default function SponsorsForm({ initial }: { initial: Sponsor[] }) {
  const editor = useEditable<Sponsor[]>(initial);
  const sponsors = editor.value;

  const update = (i: number, patch: Partial<Sponsor>) =>
    editor.change(sponsors.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <AdminChrome
      title="Sponsors"
      editor={editor}
      onSave={saveSponsorsAction}
      viewHref="/sponsors"
      intro={
        <p>
          Every sponsor and partner in the logo list on the Sponsors page, in the order shown
          there. The sponsorship packet link is under{" "}
          <a className="underline" href="/admin/settings">Site details</a>.
        </p>
      }
    >
      {sponsors.map((s, i) => (
        <Card
          key={i}
          title={s.name || "(no name yet)"}
          move={
            <MoveButtons
              what={s.name}
              onUp={() => editor.change(move(sponsors, i, -1), `Moved ${s.name}`)}
              onDown={() => editor.change(move(sponsors, i, 1), `Moved ${s.name}`)}
              isFirst={i === 0}
              isLast={i === sponsors.length - 1}
            />
          }
          onRemove={() => editor.change(sponsors.filter((_, j) => j !== i), `Removed ${s.name || "sponsor"}`)}
        >
          <Field
            label="Name"
            hint="Shows as text when there's no logo. With a logo, screen readers read it aloud."
            value={s.name}
            onChange={(v) => update(i, { name: v })}
          />
          <Field
            label="Their website (optional)"
            hint="Clicking their logo or name opens this."
            value={s.url ?? ""}
            placeholder="https://…"
            onChange={(v) => update(i, { url: v })}
          />
          <ImageField
            label="Logo (optional)"
            hint="A PNG with a transparent background looks best."
            minWidth={0}
            value={s.logoUrl ?? ""}
            onChange={(v) => update(i, { logoUrl: v })}
          />
        </Card>
      ))}
      <AddButton
        label="Add a sponsor"
        onClick={() =>
          editor.change(
            [...sponsors, { name: "", tier: "Partners", url: "", logoUrl: "" }],
            "Added a sponsor"
          )
        }
      />
    </AdminChrome>
  );
}
