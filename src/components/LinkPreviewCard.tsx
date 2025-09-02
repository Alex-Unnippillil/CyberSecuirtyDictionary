import React from "react";
import Image from "next/image";

export interface LinkPreviewData {
  /** URL for which preview is shown */
  url: string;
  /** Optional page title */
  title?: string;
  /** Optional description extracted from meta tags */
  description?: string;
  /** Optional preview image (Cloudinary public ID or URL) */
  image?: string;
  /** Screen coordinates where the card should be rendered */
  position: { x: number; y: number };
}

/**
 * Small floating card used to display metadata about a hovered link.
 *
 * The card is absolutely positioned near the mouse cursor and includes a
 * minimal preview: optional image, title and description.
 */
const LinkPreviewCard: React.FC<LinkPreviewData> = ({
  url,
  title,
  description,
  image,
  position,
}) => {
  const style: React.CSSProperties = {
    position: "fixed",
    top: position.y + 12,
    left: position.x + 12,
    zIndex: 1000,
    width: 260,
    maxWidth: "90vw",
    pointerEvents: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    borderRadius: 4,
    background: "#fff",
    color: "#000",
    overflow: "hidden",
    fontSize: 14,
  };

  return (
    <div className="link-preview-card" style={style}>
      {image && (
        <Image
          src={image}
          alt=""
          width={260}
          height={130}
          style={{ width: "100%", height: "auto" }}
        />
      )}
      <div style={{ padding: 8 }}>
        <strong style={{ display: "block", marginBottom: 4 }}>
          {title || url}
        </strong>
        {description && (
          <p style={{ margin: 0, color: "#555" }}>{description}</p>
        )}
      </div>
    </div>
  );
};

export default LinkPreviewCard;
