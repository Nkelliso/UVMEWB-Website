"use client";

import AdminChrome, { Field, ImageField, Row, Card, AddButton, MoveButtons, Section } from "./AdminChrome";
import { useEditable, move } from "./useEditable";
import { saveOfficersAction } from "@/app/admin/actions";
import type { OfficerBoard, Officer, OfficerGroup } from "@/lib/types";

function PersonFields({ o, onChange }: { o: Officer; onChange: (patch: Partial<Officer>) => void }) {
  return (
    <>
      <Row>
        <Field label="Name" value={o.name} onChange={(v) => onChange({ name: v })} />
        <Field label="Role" value={o.title} placeholder="e.g. Treasurer" onChange={(v) => onChange({ title: v })} />
      </Row>
      <ImageField
        label="Headshot (optional)"
        hint="Without one, the site shows their initials."
        minWidth={500}
        value={o.photoUrl ?? ""}
        onChange={(v) => onChange({ photoUrl: v })}
      />
    </>
  );
}

export default function OfficersForm({ initial }: { initial: OfficerBoard }) {
  const editor = useEditable<OfficerBoard>(initial);
  const board = editor.value;

  const setExec = (list: Officer[], label?: string) =>
    editor.change({ ...board, executiveBoard: list }, label);
  const setGroups = (list: OfficerGroup[], label?: string) =>
    editor.change({ ...board, projectDirectors: list }, label);
  const updGroup = (gi: number, patch: Partial<OfficerGroup>, label?: string) =>
    setGroups(board.projectDirectors.map((g, j) => (j === gi ? { ...g, ...patch } : g)), label);

  return (
    <AdminChrome
      title="Officer board"
      editor={editor}
      onSave={saveOfficersAction}
      viewHref="/about/officer-board"
      intro={
        <p>
          The people on the Meet our team page. Update this at the start of each year when
          officers change.
        </p>
      }
    >
      <Field
        label="Which year or semester this list is for"
        hint="The page shows this, for example Fall 2026."
        value={board.asOf}
        onChange={(v) => editor.change({ ...board, asOf: v })}
      />

      <Section title="Faculty advisor">
        <Card>
          <PersonFields
            o={board.facultyAdvisor}
            onChange={(patch) =>
              editor.change({ ...board, facultyAdvisor: { ...board.facultyAdvisor, ...patch } })
            }
          />
        </Card>
      </Section>

      <Section title="Executive board" hint="This is the order they appear in on the page.">
        {board.executiveBoard.map((o, i) => (
          <Card
            key={i}
            title={o.name || "(no name yet)"}
            move={
              <MoveButtons
                what={o.name}
                onUp={() => setExec(move(board.executiveBoard, i, -1), `Moved ${o.name}`)}
                onDown={() => setExec(move(board.executiveBoard, i, 1), `Moved ${o.name}`)}
                isFirst={i === 0}
                isLast={i === board.executiveBoard.length - 1}
              />
            }
            onRemove={() =>
              setExec(board.executiveBoard.filter((_, j) => j !== i), `Removed ${o.name || "officer"}`)
            }
          >
            <PersonFields
              o={o}
              onChange={(patch) =>
                setExec(board.executiveBoard.map((x, j) => (j === i ? { ...x, ...patch } : x)))
              }
            />
          </Card>
        ))}
        <AddButton
          label="Add an officer"
          onClick={() => setExec([...board.executiveBoard, { title: "", name: "" }], "Added an officer")}
        />
      </Section>

      <Section title="Project team leaders" hint="Leaders are grouped by project team, like International or Domestic.">
        {board.projectDirectors.map((g, gi) => (
          <div key={gi} className="border border-neutral-300 rounded-lg bg-neutral-50 p-4 mb-4">
            <div className="flex flex-wrap justify-between items-start gap-x-4">
              <div className="flex-1 min-w-48">
                <Field
                  label="Team name"
                  value={g.heading ?? ""}
                  placeholder="e.g. International Project"
                  onChange={(v) => updGroup(gi, { heading: v })}
                />
              </div>
              <div className="flex gap-3 items-center sm:mt-7 mb-4">
                <MoveButtons
                  what={g.heading ?? "team"}
                  onUp={() => setGroups(move(board.projectDirectors, gi, -1), `Moved ${g.heading || "a team"}`)}
                  onDown={() => setGroups(move(board.projectDirectors, gi, 1), `Moved ${g.heading || "a team"}`)}
                  isFirst={gi === 0}
                  isLast={gi === board.projectDirectors.length - 1}
                />
                <button
                  type="button"
                  onClick={() =>
                    setGroups(board.projectDirectors.filter((_, j) => j !== gi), `Removed ${g.heading || "a team"}`)
                  }
                  className="text-sm text-red-700 hover:text-red-900"
                >
                  Remove team
                </button>
              </div>
            </div>
            {g.officers.map((o, oi) => (
              <Card
                key={oi}
                title={o.name || "(no name yet)"}
                move={
                  <MoveButtons
                    what={o.name}
                    onUp={() => updGroup(gi, { officers: move(g.officers, oi, -1) }, `Moved ${o.name}`)}
                    onDown={() => updGroup(gi, { officers: move(g.officers, oi, 1) }, `Moved ${o.name}`)}
                    isFirst={oi === 0}
                    isLast={oi === g.officers.length - 1}
                  />
                }
                onRemove={() =>
                  updGroup(gi, { officers: g.officers.filter((_, j) => j !== oi) }, `Removed ${o.name || "leader"}`)
                }
              >
                <PersonFields
                  o={o}
                  onChange={(patch) =>
                    updGroup(gi, { officers: g.officers.map((x, j) => (j === oi ? { ...x, ...patch } : x)) })
                  }
                />
              </Card>
            ))}
            <AddButton
              label="Add a leader to this team"
              onClick={() => updGroup(gi, { officers: [...g.officers, { title: "", name: "" }] }, "Added a leader")}
            />
          </div>
        ))}
        <AddButton
          label="Add a project team"
          onClick={() => setGroups([...board.projectDirectors, { heading: "", officers: [] }], "Added a team")}
        />
      </Section>
    </AdminChrome>
  );
}
