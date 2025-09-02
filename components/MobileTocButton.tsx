import React, { useEffect, useState } from "react";
import TOC from "./TOC";

/**
 * Floating button that reveals a full-screen table of contents on mobile.
 * The overlay can be dismissed by tapping or using the browser back button.
 */
const MobileTocButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Allow the browser back button to close the overlay.
  useEffect(() => {
    if (!open) return;
    history.pushState({ mobileToc: true }, "");
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  const close = () => {
    if (open) history.back();
  };

  return (
    <>
      <button
        className="mobile-toc-button"
        onClick={() => setOpen(true)}
        aria-label="Open table of contents"
      >
        TOC
      </button>
      {open && (
        <div className="mobile-toc-overlay" onClick={close}>
          <div
            className="mobile-toc"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={close}
              aria-label="Close table of contents"
            >
              ×
            </button>
            <TOC />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTocButton;

