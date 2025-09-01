import React from "react";

type TermCardProps = {
  title: string;
  definition: string;
  tags?: string[];
};

const TermCard: React.FC<TermCardProps> = ({ title, definition, tags = [] }) => (
  <div className="term-card">
    <h2>{title}</h2>
    <p>{definition}</p>
    {tags.length > 0 && (
      <ul className="term-tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    )}
  </div>
);

export default TermCard;
