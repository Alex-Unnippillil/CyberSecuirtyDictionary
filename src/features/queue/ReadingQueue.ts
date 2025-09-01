export type QueueList = "nextUp" | "later";

export interface QueueState {
  nextUp: string[];
  later: string[];
}

/**
 * Simple reading queue supporting two lists: `nextUp` and `later`.
 * State is persisted to localStorage and components can subscribe to changes.
 */
export class ReadingQueue {
  private static STORAGE_KEY = "readingQueue";

  private state: QueueState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = { nextUp: [], later: [] };
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(ReadingQueue.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.nextUp && parsed.later) {
            this.state = {
              nextUp: Array.isArray(parsed.nextUp) ? parsed.nextUp : [],
              later: Array.isArray(parsed.later) ? parsed.later : [],
            };
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  private save() {
    try {
      window.localStorage.setItem(
        ReadingQueue.STORAGE_KEY,
        JSON.stringify(this.state),
      );
    } catch {
      // ignore storage errors
    }
  }

  private notify() {
    for (const l of this.listeners) l();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): QueueState {
    return {
      nextUp: [...this.state.nextUp],
      later: [...this.state.later],
    };
  }

  counts(): { nextUp: number; later: number } {
    return {
      nextUp: this.state.nextUp.length,
      later: this.state.later.length,
    };
  }

  add(list: QueueList, term: string) {
    const arr = this.state[list];
    if (!arr.includes(term)) {
      arr.push(term);
      this.save();
      this.notify();
    }
  }

  remove(list: QueueList, term: string) {
    const arr = this.state[list];
    const idx = arr.indexOf(term);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.save();
      this.notify();
    }
  }
}

export const readingQueue = new ReadingQueue();
