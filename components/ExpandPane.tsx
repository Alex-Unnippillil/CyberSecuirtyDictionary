"use client";
import React, { useState } from "react";

interface ExpandPaneProps {
  summary: string;
  children: React.ReactNode;
}

/**
 * A simple collapsible pane used on the term page to show extra details.
 */
export function ExpandPane({ summary, children }: ExpandPaneProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded my-4">
      <button
        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200"
        onClick={() => setOpen((v) => !v)}
      >
        {summary}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default ExpandPane;
