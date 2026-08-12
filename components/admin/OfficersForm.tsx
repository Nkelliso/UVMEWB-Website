"use client";

import { useState } from "react";
import AdminChrome, { Field, ImageField, Row, Card, AddButton } from "./AdminChrome";
import { saveOfficersAction } from "@/app/admin/actions";
import type { OfficerBoard, Officer, OfficerGroup } from "@/lib/types";

export default function OfficersForm({ initial }: { initial: OfficerBoard }) {
  const [board, setBoard] = useState<OfficerBoard>(initial);

  const setExec = (list: Officer[]) => setBoard((b) => ({ ...b, executiveBoard: list }));
  const updExec = (i: number, patch: Partial<Officer>) =>
    setExec(board.executiveBoard.map((o, j) => (j === i ? { ...o, ...patch } : o)));

  const setGroups = (list: OfficerGroup[]) => setBoard((b) => ({ ...b, projectDirectors: list }));
  const updGroup = (gi: number, patch: Partial<OfficerGroup>) =>
    setGroups(board.projectDirectors.map((g, j) => (j === gi ? { ...g, ...patch } : g)));
  const updGroupOfficer = (gi: number, oi: number, patch: Partial<Officer>) =>
    updGroup(gi, {
      officers: board.projectDirectors[gi].officers.map((o, j) =>
        j === oi ? { ...o, ...patch } : o
      ),
    });

  return (
    <AdminChrome
      title="Officer Board"
      intro="Photos render as placeholders until you upload or paste one. Update this each year as officers change."
      value={board}
      onSave={saveOfficersAction}
    >
      <Field
        label="Officers as of"
        value={board.asOf}
        onChange={(v) => setBoard((b) => ({ ...b, asOf: v }))}
        placeholder="e.g. Fall 2025"
      />

      <h2 className="text-lg font-bold mt-8 mb-3">Faculty Advisor</h2>
      <Card>
        <Row>
          <Field label="Title" value={board.facultyAdvisor.title} onChange={(v) => setBoard((b) => ({ ...b, facultyAdvisor: { ...b.facultyAdvisor, title: v } }))} />
          <Field label="Name" value={board.facultyAdvisor.name} onChange={(v) => setBoard((b) => ({ ...b, facultyAdvisor: { ...b.facultyAdvisor, name: v } }))} />
        </Row>
        <ImageField label="Photo (optional)" value={board.facultyAdvisor.photoUrl ?? ""} onChange={(v) => setBoard((b) => ({ ...b, facultyAdvisor: { ...b.facultyAdvisor, photoUrl: v } }))} />
      </Card>

      <h2 className="text-lg font-bold mt-8 mb-3">Executive Board</h2>
      {board.executiveBoard.map((o, i) => (
        <Card key={i} onRemove={() => setExec(board.executiveBoard.filter((_, j) => j !== i))}>
          <Row>
            <Field label="Title" value={o.title} onChange={(v) => updExec(i, { title: v })} />
            <Field label="Name" value={o.name} onChange={(v) => updExec(i, { name: v })} />
          </Row>
          <ImageField label="Photo (optional)" value={o.photoUrl ?? ""} onChange={(v) => updExec(i, { photoUrl: v })} />
        </Card>
      ))}
      <AddButton label="Add officer" onClick={() => setExec([...board.executiveBoard, { title: "", name: "" }])} />

      <h2 className="text-lg font-bold mt-8 mb-3">Project Directors</h2>
      {board.projectDirectors.map((g, gi) => (
        <div key={gi} className="border border-neutral-300 rounded-lg bg-white p-4 mb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <Field label="Group heading" value={g.heading ?? ""} onChange={(v) => updGroup(gi, { heading: v })} placeholder="e.g. International Project" />
            </div>
            <button onClick={() => setGroups(board.projectDirectors.filter((_, j) => j !== gi))} className="text-xs text-red-600 hover:text-red-800 mt-6">
              Remove group
            </button>
          </div>
          {g.officers.map((o, oi) => (
            <Card key={oi} onRemove={() => updGroup(gi, { officers: g.officers.filter((_, j) => j !== oi) })}>
              <Row>
                <Field label="Title" value={o.title} onChange={(v) => updGroupOfficer(gi, oi, { title: v })} />
                <Field label="Name" value={o.name} onChange={(v) => updGroupOfficer(gi, oi, { name: v })} />
              </Row>
              <ImageField label="Photo (optional)" value={o.photoUrl ?? ""} onChange={(v) => updGroupOfficer(gi, oi, { photoUrl: v })} />
            </Card>
          ))}
          <AddButton label="Add director" onClick={() => updGroup(gi, { officers: [...g.officers, { title: "", name: "" }] })} />
        </div>
      ))}
      <AddButton label="Add director group" onClick={() => setGroups([...board.projectDirectors, { heading: "", officers: [] }])} />
    </AdminChrome>
  );
}
