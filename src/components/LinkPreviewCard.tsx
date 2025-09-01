import React from 'react';

export interface LinkPreviewMetadata {
  title: string;
  description: string;
  image?: string;
  url: string;
}

interface LinkPreviewCardProps {
  metadata: LinkPreviewMetadata;
  position: { x: number; y: number };
}

const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({ metadata, position }) => {
  return (
    <div
      className="link-preview-card"
      style={{ top: position.y, left: position.x }}
    >
      {metadata.image && (
        <img src={metadata.image} alt="" />
      )}
      <div className="link-preview-content">
        <strong>{metadata.title}</strong>
        {metadata.description && <p>{metadata.description}</p>}
        <small>{metadata.url}</small>
      </div>
    </div>
  );
};

export default LinkPreviewCard;
