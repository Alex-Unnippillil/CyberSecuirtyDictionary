import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface CitationExpanderProps {
  /** Contents of the citation link, e.g. superscript index. */
  children: React.ReactNode;
  /** Footnote text to reveal when expanded. */
  footnote: React.ReactNode;
}

/**
 * Inline citation link that toggles an associated footnote.
 * Clicking the citation reveals the footnote with a sliding motion.
 * A second click collapses the footnote and returns focus to the
 * citation link for accessible navigation.
 */
export default function CitationExpander({
  children,
  footnote,
}: CitationExpanderProps) {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen((prev) => {
      const next = !prev;
      if (prev && linkRef.current) {
        // Returning focus improves keyboard navigation when collapsing.
        linkRef.current.focus();
      }
      return next;
    });
  };

  return (
    <span className="citation-expander">
      <a
        href="#"
        ref={linkRef}
        onClick={handleToggle}
        aria-expanded={open}
        className="citation-expander__link"
      >
        {children}
      </a>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            className="citation-expander__footnote"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            {footnote}
          </motion.aside>
        )}
      </AnimatePresence>
    </span>
  );
}
