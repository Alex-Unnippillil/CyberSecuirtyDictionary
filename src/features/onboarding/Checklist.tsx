import React, { useEffect, useState } from 'react';

// Define the structure of a task
export interface ChecklistTask {
  id: string;
  label: string;
}

// Default tasks for onboarding
const DEFAULT_TASKS: ChecklistTask[] = [
  { id: 'first-search', label: 'Search for a term' },
  { id: 'first-highlight', label: 'Highlight some text' },
];

interface Props {
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
      const raw = localStorage.getItem('onboarding-checklist');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return {};
  });

  // Persist completion state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('onboarding-checklist', JSON.stringify(completed));
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
    const handleSearch = () => check('first-search');
    const handleHighlight = () => check('first-highlight');

    // Custom events are used so that the application can dispatch
    // `window.dispatchEvent(new Event('user-search'))` once a search is made
    // and `window.dispatchEvent(new Event('user-highlight'))` when text is highlighted.
    window.addEventListener('user-search', handleSearch);
    window.addEventListener('user-highlight', handleHighlight);

    return () => {
      window.removeEventListener('user-search', handleSearch);
      window.removeEventListener('user-highlight', handleHighlight);
    };
  }, []);

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

