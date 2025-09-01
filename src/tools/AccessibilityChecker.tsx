import React, { useState } from "react";
import axe from "axe-core";

interface Issue {
  id: string;
  impact: axe.ImpactValue | null;
  description: string;
  target: string[];
}

const AccessibilityChecker: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const runScan = async () => {
    const { violations } = await axe.run(document);
    const flattened: Issue[] = violations.flatMap((v) =>
      v.nodes.map((n) => ({
        id: v.id,
        impact: v.impact ?? null,
        description: v.help,
        target: n.target,
      }))
    );
    setIssues(flattened);
  };

  const focusNode = (target: string[]) => {
    const selector = target[0];
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      <button onClick={runScan}>Run Accessibility Scan</button>
      {issues.length > 0 && (
        <ul>
          {issues.map((issue, i) => (
            <li key={`${issue.id}-${i}`}>
              <button
                onClick={() => focusNode(issue.target)}
                style={{ display: "block", width: "100%", textAlign: "left" }}
              >
                <strong>{issue.impact ?? "unknown"}:</strong> {issue.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessibilityChecker;

