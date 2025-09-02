import React from "react";
import highlight from "@lib/highlight";

interface DefinitionItemProps {
  term: string;
  definition: string;
  match?: string;
}

export default function DefinitionItem({
  term,
  definition,
  match,
}: DefinitionItemProps) {
  const title = match ? highlight(term, match) : term;
  const body = match ? highlight(definition, match) : definition;

  return (
    <div className="definition-item">
      <h3 dangerouslySetInnerHTML={{ __html: title }} />
      <p dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
