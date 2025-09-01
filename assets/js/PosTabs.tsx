import React, { useState } from "react";

export interface PosTabsProps {
  registers: string[];
  fetchDefinition: (register: string) => void;
}

const PosTabs: React.FC<PosTabsProps> = ({ registers, fetchDefinition }) => {
  const [active, setActive] = useState(registers[0] ?? "");

  const handleSelect = (register: string) => {
    setActive(register);
    fetchDefinition(register);
  };

  return (
    <div className="pos-tabs">
      {registers.map((register) => (
        <button
          key={register}
          className={register === active ? "active" : ""}
          onClick={() => handleSelect(register)}
        >
          {register}
        </button>
      ))}
    </div>
  );
};

export default PosTabs;
