/**
 * Simple undo manager that stores a single previous state per entity.
 * Capture state before an edit and call `undo()` to revert the last change.
 */
export type State = unknown;

type ApplyFn<T> = (id: string, state: T) => void;

export class UndoManager<T = State> {
  private states: Map<string, T> = new Map();
  private order: string[] = [];
  private apply: ApplyFn<T>;
  private handleKeyDown: (e: KeyboardEvent) => void;

  constructor(apply: ApplyFn<T>) {
    this.apply = apply;
    this.handleKeyDown = (e: KeyboardEvent) => {
      const isUndo =
        (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
      if (isUndo) {
        e.preventDefault();
        this.undo();
      }
    };
    document.addEventListener("keydown", this.handleKeyDown);
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
    // Use structuredClone if available to decouple from future mutations.
    const clonedState =
      typeof structuredClone === "function"
        ? structuredClone(state)
        : JSON.parse(JSON.stringify(state));
    this.states.set(id, clonedState);
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

    const clonedState =
      typeof structuredClone === "function"
        ? structuredClone(prev)
        : JSON.parse(JSON.stringify(prev));
    this.apply(targetId, clonedState);
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
