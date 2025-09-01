export type QueueList = 'nextUp' | 'later';

export interface ReadingQueueState {
  nextUp: string[];
  later: string[];
}

const STORAGE_KEY = 'readingQueue';

class ReadingQueue {
  private state: ReadingQueueState;
  private listeners: Array<(s: ReadingQueueState) => void> = [];

  constructor() {
    this.state = { nextUp: [], later: [] };
    this.load();
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nextUp && parsed.later) {
          this.state = {
            nextUp: Array.isArray(parsed.nextUp) ? parsed.nextUp : [],
            later: Array.isArray(parsed.later) ? parsed.later : []
          };
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore storage errors
    }
  }

  private notify(): void {
    for (const fn of this.listeners) fn(this.state);
  }

  subscribe(fn: (s: ReadingQueueState) => void): () => void {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  add(term: string, list: QueueList): void {
    const arr = this.state[list];
    if (!arr.includes(term)) {
      arr.push(term);
      this.save();
      this.notify();
    }
  }

  remove(term: string, list: QueueList): void {
    const arr = this.state[list];
    const idx = arr.indexOf(term);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.save();
      this.notify();
    }
  }

  getState(): ReadingQueueState {
    return this.state;
  }
}

export const readingQueue = new ReadingQueue();
