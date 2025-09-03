import React, { useState } from "react";
import copyToClipboard from "../../lib/copyToClipboard";

/**
 * ShareButton copies the current page's canonical URL to the clipboard
 * and shows a temporary toast notification.
 */
const ShareButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const copyCanonical = async () => {
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const url = canonical?.href || window.location.href;

    try {
      await copyToClipboard(url);
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    } catch (err) {
      console.error("Unable to copy URL", err);
    }
  };

  return (
    <>
      <button onClick={copyCanonical} aria-label="Share term">
        Share
      </button>
      {visible && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          Link copied to clipboard
        </div>
      )}
    </>
  );
};

export default ShareButton;
