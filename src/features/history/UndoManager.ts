/**
 * Simple undo manager that stores a single previous state per entity.
 * Capture state before an edit and call `undo()` to revert the last change.
 */
export type State = unknown;

type ApplyFn<T> = (id: string, state: T) => void;

import { safeParse } from '../../utils/safeJson';

export class UndoManager<T = State> {
  private states: Map<string, T> = new Map();
  private order: string[] = [];
  private apply: ApplyFn<T>;
  private handleKeyDown: (e: KeyboardEvent) => void;

  constructor(apply: ApplyFn<T>) {
    this.apply = apply;
    this.handleKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private clone(state: T): T {
    return typeof structuredClone === "function"
      ? structuredClone(state)
      : safeParse(JSON.stringify(state), state);
  }

  private onKeyDown(e: KeyboardEvent) {
    const isUndo =
      (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
    if (!isUndo) return;
    e.preventDefault();
    this.undo();
  }

  /**
   * Store the current state of an entity before it is edited.
   * Only the latest state for each entity is kept.
   */
  capture(id: string, state: T) {
    if (this.states.has(id)) {
      const index = this.order.indexOf(id);
      if (index !== -1) {
        this.order.splice(index, 1);
      }
    }
    // Decouple from future mutations.
    this.states.set(id, this.clone(state));
    this.order.push(id);
  }

  /**
   * Revert the last captured change or the change for the provided entity.
   */
  undo(id?: string) {
    let targetId = id;
    if (!targetId) {
      targetId = this.order.pop();
    } else {
      const index = this.order.indexOf(targetId);
      if (index !== -1) {
        this.order.splice(index, 1);
      }
    }
    if (!targetId) return;

    const prev = this.states.get(targetId);
    if (prev === undefined) return;

    this.apply(targetId, this.clone(prev));
    this.states.delete(targetId);
  }

  /**
   * Remove listeners and clear stored history.
   */
  dispose() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.states.clear();
    this.order = [];
  }
}
