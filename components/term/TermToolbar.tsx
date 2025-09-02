"use client";

import { useState, useEffect } from "react";

interface TermEntry {
  term?: string;
  name?: string;
  synonyms?: string[];
}

/**
 * Toolbar that toggles synonym pills for term references.
 */
export default function TermToolbar() {
  const [enabled, setEnabled] = useState(false);
  const [map, setMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (enabled) inject();
    else remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  async function loadSynonyms() {
    if (Object.keys(map).length) return;
    try {
      const res = await fetch("/terms.json");
      const data = await res.json();
      const list: TermEntry[] = Array.isArray(data) ? data : data.terms || [];
      const dictionary: Record<string, string[]> = {};
      list.forEach((t) => {
        const key = (t.term || t.name || "").toLowerCase();
        if (key && t.synonyms && t.synonyms.length) {
          dictionary[key] = t.synonyms;
        }
      });
      setMap(dictionary);
    } catch (err) {
      console.error("Failed to load terms", err);
    }
  }

  function showToast(message: string) {
    const toast = document.createElement("div");
    toast.className = "toast show";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      toast.remove();
    }, 2000);
  }

  function inject() {
    document
      .querySelectorAll<HTMLAnchorElement>('a[href^="/terms/"]')
      .forEach((link) => {
        const term = link.textContent?.trim().toLowerCase() || "";
        const syns = map[term];
        if (!syns) return;
        const frag = document.createDocumentFragment();
        syns.forEach((syn) => {
          const pill = document.createElement("span");
          pill.textContent = syn;
          pill.className = "synonym-pill";
          pill.addEventListener("click", () => {
            navigator.clipboard.writeText(syn);
            showToast(`Copied \"${syn}\"`);
          });
          frag.appendChild(pill);
        });
        link.after(frag);
      });
  }

  function remove() {
    document
      .querySelectorAll(".synonym-pill")
      .forEach((el) => el.remove());
  }

  const toggle = async () => {
    if (!enabled) await loadSynonyms();
    setEnabled((prev) => !prev);
  };

  return (
    <div className="term-toolbar">
      <button onClick={toggle} aria-pressed={enabled}>
        {enabled ? "Hide Synonyms" : "Show Synonyms"}
      </button>
    </div>
  );
}

