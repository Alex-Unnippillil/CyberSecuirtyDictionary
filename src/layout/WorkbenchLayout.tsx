import React, { useEffect, useRef, useState } from "react";
import { safeParse } from "../utils/safeJson";

/**
 * WorkbenchLayout provides a simple two-pane workbench with a resizable divider.
 * Users can save, load and delete layouts. Layout presets are stored in
 * localStorage and are immediately applied when selected from the "Layouts"
 * menu without reloading the page.
 */

const LOCAL_STORAGE_KEY = "workbench-layouts";

export interface WorkbenchLayoutProps {
  /** React node rendered in the left pane */
  left: React.ReactNode;
  /** React node rendered in the right pane */
  right: React.ReactNode;
}

const WorkbenchLayout: React.FC<WorkbenchLayoutProps> = ({ left, right }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [divider, setDivider] = useState(50); // percentage width for left pane
  const [dragging, setDragging] = useState(false);
  const [presets, setPresets] = useState<Record<string, number>>({});

  // Load presets from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    setPresets(safeParse<Record<string, number>>(raw, {}));
  }, []);

  // Persist presets on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const startDrag = () => setDragging(true);

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    // constrain between 10% and 90%
    setDivider(Math.min(90, Math.max(10, percent)));
  };

  const stopDrag = () => setDragging(false);

  // Handle global mouse events while dragging
  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => onMouseMove(e);
    const up = () => stopDrag();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  const saveLayout = () => {
    const name = prompt("Save layout as:");
    if (!name) return;
    setPresets((p) => ({ ...p, [name]: divider }));
  };

  const loadLayout = (name: string) => {
    if (name in presets) {
      setDivider(presets[name]);
    }
  };

  const deleteLayout = (name: string) => {
    setPresets(({ [name]: _, ...rest }) => rest);
  };

  const selectedLayout = useRef<string>("");

  return (
    <div>
      <div className="layouts-menu">
        <select
          defaultValue=""
          onChange={(e) => {
            selectedLayout.current = e.target.value;
            loadLayout(e.target.value);
          }}
        >
          <option value="" disabled>
            Layouts
          </option>
          {Object.keys(presets).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button type="button" onClick={saveLayout}>
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            if (selectedLayout.current) {
              deleteLayout(selectedLayout.current);
              selectedLayout.current = "";
            }
          }}
        >
          Delete
        </button>
      </div>
      <div
        ref={containerRef}
        className="workbench-layout"
        style={{ display: "flex", width: "100%", height: "100%" }}
      >
        <div style={{ width: `${divider}%`, overflow: "auto" }}>{left}</div>
        <div
          onMouseDown={startDrag}
          style={{
            width: "4px",
            cursor: "col-resize",
            background: "#ccc",
          }}
        />
        <div style={{ flex: 1, overflow: "auto" }}>{right}</div>
      </div>
    </div>
  );
};

export default WorkbenchLayout;
