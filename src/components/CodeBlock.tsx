'use client';

import React, { useState } from 'react';
import copyToClipboard from '../../lib/copyToClipboard';

interface CodeBlockProps {
  /** CLI command to display */
  command: string;
  /** Optional checklist items to show below the command */
  prerequisites?: string[];
}

/**
 * Renders a command-line snippet with a copy button and an optional
 * checklist of prerequisite steps. Checkbox state is stored in component
 * state only, so it resets when the session reloads.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  command,
  prerequisites = [],
}) => {
  const [checked, setChecked] = useState<boolean[]>(
    prerequisites.map(() => false),
  );

  const copyCommand = async () => {
    try {
      await copyToClipboard(command);
    } catch {
      // Clipboard API not available or permission denied.
    }
  };

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="code-block">
      <div style={{ position: 'relative' }}>
        <pre>
          <code>{command}</code>
        </pre>
        <button
          onClick={copyCommand}
          aria-label="Copy command"
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          Copy
        </button>
      </div>

      {prerequisites.length > 0 && (
        <ul className="prerequisites">
          {prerequisites.map((item, idx) => (
            <li key={idx}>
              <label>
                <input
                  type="checkbox"
                  checked={checked[idx]}
                  onChange={() => toggle(idx)}
                />{' '}
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CodeBlock;

