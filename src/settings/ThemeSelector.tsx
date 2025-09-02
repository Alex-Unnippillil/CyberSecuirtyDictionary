import React, { useEffect, useRef, useState } from "react";

interface ThemeOption {
  id: string;
  label: string;
}

const themes: ThemeOption[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

/**
 * ThemeSelector lets users preview themes before applying them.
 * Hover or press Space to try a theme, then click or press Enter to keep it.
 * Mouse out, press Escape, or tab away to restore the previous theme.
 */
export default function ThemeSelector() {
  const [current, setCurrent] = useState("light");
  const committed = useRef("light");

  useEffect(() => {
    const initial =
      typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-theme") || "light"
        : "light";
    setCurrent(initial);
    committed.current = initial;
  }, []);

  const apply = (id: string) => {
    if (id === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
  };

  const preview = (id: string) => {
    setCurrent(id);
    apply(id);
  };

  const revert = () => {
    setCurrent(committed.current);
    apply(committed.current);
  };

  const commit = (id: string) => {
    committed.current = id;
    setCurrent(id);
    apply(id);
  };

  const handleKeyDown = (
    id: string,
    e: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (e.key === " ") {
      e.preventDefault();
      preview(id);
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      revert();
    }
  };

  return (
    <div className="theme-selector">
      {themes.map((t) => (
        <button
          key={t.id}
          onMouseEnter={() => preview(t.id)}
          onMouseLeave={revert}
          onClick={() => commit(t.id)}
          onKeyDown={(e) => handleKeyDown(t.id, e)}
          onBlur={revert}
          aria-pressed={current === t.id}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
