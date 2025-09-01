import React, { useEffect, useState } from 'react';

/** Structure of a checklist task. If `event` is provided the checklist
 * will listen for that custom event on the window object and
 * automatically mark the task as complete when the event fires.
 */
export interface ChecklistTask {
  /** Unique identifier for the task */
  id: string;
  /** Human friendly label to display */
  label: string;
  /** Optional custom event dispatched on window when task is done */
  event?: string;
}

/** LocalStorage key used for persisting completion state */
const STORAGE_KEY = 'onboarding-checklist';

/** Default tasks for onboarding */
const DEFAULT_TASKS: ChecklistTask[] = [
  { id: 'first-search', label: 'Search for a term', event: 'user-search' },
  { id: 'first-highlight', label: 'Highlight some text', event: 'user-highlight' },
];

interface Props {
  /** Tasks to render. Defaults to {@link DEFAULT_TASKS}. */
  tasks?: ChecklistTask[];
}

/**
 * Checklist component used during onboarding to guide users through
 * common actions in the application. Completion state is stored in
 * localStorage so that a refresh will keep progress.
 */
const Checklist: React.FC<Props> = ({ tasks = DEFAULT_TASKS }) => {
  // Load completion information from localStorage on first render
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore parsing/storage issues
    }
    return {};
  });

  // Persist completion state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // ignore storage errors
    }
  }, [completed]);

  // Helper for marking a task as completed
  const check = (id: string) => {
    setCompleted((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  // Observe user events to automatically complete tasks
  useEffect(() => {
    const listeners: Array<[string, EventListener]> = [];
    tasks.forEach((task) => {
      if (!task.event) return;
      const handler = () => check(task.id);
      window.addEventListener(task.event, handler);
      listeners.push([task.event, handler]);
    });

    return () => {
      listeners.forEach(([evt, handler]) => {
        window.removeEventListener(evt, handler);
      });
    };
  }, [tasks]);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={!!completed[task.id]}
              onChange={() => check(task.id)}
            />
            {task.label}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default Checklist;

