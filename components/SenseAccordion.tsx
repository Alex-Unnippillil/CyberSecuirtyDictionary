import React from "react";

export interface Sense {
  id?: string | number;
  label: React.ReactNode;
  description: React.ReactNode;
}

export interface SenseAccordionProps {
  senses: Sense[];
}

const SenseAccordion: React.FC<SenseAccordionProps> = ({ senses }) => {
  if (senses.length <= 1) {
    const sense = senses[0];
    return (
      <div>
        <h3>{sense.label}</h3>
        <div>{sense.description}</div>
      </div>
    );
  }

  return (
    <div>
      {senses.map((sense, index) => (
        <details key={sense.id ?? index}>
          <summary>{sense.label}</summary>
          <div>{sense.description}</div>
        </details>
      ))}
    </div>
  );
};

export default SenseAccordion;
