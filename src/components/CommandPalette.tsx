import React, { useEffect, useState } from "react";
import useFocusTrap from "../../hooks/useFocusTrap";
import { useNavigate } from "react-router-dom";

interface Command {
  label: string;
  action: () => void;
}

interface CommandPaletteProps {
  openTermDialog: () => void;
  toggleTheme: () => void;
  beginCompareFlow: () => void;
  openSettingsModal: () => void;
}

/**
 * Command palette with search input and a list of commands.
 * Opens with Ctrl/Cmd+K and executes commands without reloading the page.
 */
const CommandPalette: React.FC<CommandPaletteProps> = ({
  openTermDialog,
  toggleTheme,
  beginCompareFlow,
  openSettingsModal,
}) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const overlayRef = useFocusTrap(visible, () => setVisible(false));
  const navigate = useNavigate();

  const commands: Command[] = [
    { label: "Open Term", action: openTermDialog },
    { label: "Toggle Theme", action: toggleTheme },
    {
      label: "Compare Terms",
      action: () => {
        beginCompareFlow();
        navigate("/compare");
      },
    },
    {
      label: "Settings",
      action: () => {
        openSettingsModal();
        navigate("/settings");
      },
    },
  ];

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const execute = (action: () => void) => {
    action();
    setVisible(false);
    setQuery("");
  };

  if (!visible) return null;

  return (
    <div
      className="command-palette-overlay"
      role="dialog"
      aria-modal="true"
      ref={overlayRef}
      tabIndex={-1}
    >
      <div className="command-palette">
        <input
          autoFocus
          type="text"
          placeholder="Type a command"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul>
          {filtered.map((cmd) => (
            <li key={cmd.label}>
              <button onClick={() => execute(cmd.action)}>{cmd.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;
