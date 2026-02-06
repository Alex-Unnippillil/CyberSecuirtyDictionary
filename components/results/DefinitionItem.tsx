import React from "react";
import highlight from "../../lib/highlight";
import sanitize from "../../src/utils/sanitize";

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
  const title = sanitize(match ? highlight(term, match) : term);
  const body = sanitize(match ? highlight(definition, match) : definition);

  return (
    <div className="definition-item">
      <h3 dangerouslySetInnerHTML={{ __html: title }} />
      <p dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
