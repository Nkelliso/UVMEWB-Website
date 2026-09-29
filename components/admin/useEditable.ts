"use client";

import { useState } from "react";

export interface Editable<T> {
  value: T;
  /** Replace the value. Pass a label ("Removed Kajinge, Rwanda") to make the
   *  change undoable; plain typing is left out of the undo list on purpose. */
  change: (next: T | ((prev: T) => T), label?: string) => void;
  undo: () => void;
  canUndo: boolean;
  undoLabel: string | null;
  /** Throw away the undo list and set a value (used by "Discard changes"). */
  reset: (to: T) => void;
}

/** Form state for an admin screen, with a small undo list for big actions
 *  (remove, add, reorder) so a mis-click is never a disaster. */
export function useEditable<T>(initial: T): Editable<T> {
  const [value, setValue] = useState<T>(initial);
  const [past, setPast] = useState<{ value: T; label: string }[]>([]);

  const change: Editable<T>["change"] = (next, label) => {
    const resolved =
      typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    if (label) setPast((p) => [...p.slice(-19), { value, label }]);
    setValue(resolved);
  };

  const undo = () => {
    const last = past[past.length - 1];
    if (!last) return;
    setPast((p) => p.slice(0, -1));
    setValue(last.value);
  };

  const reset = (to: T) => {
    setPast([]);
    setValue(to);
  };

  return {
    value,
    change,
    undo,
    canUndo: past.length > 0,
    undoLabel: past[past.length - 1]?.label ?? null,
    reset,
  };
}

/** Move item i one step up (-1) or down (+1). */
export function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
