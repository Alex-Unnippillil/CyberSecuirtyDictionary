import React, { useState } from "react";

interface UnitConverterProps {
  /** Text that may contain measurements to convert */
  text: string;
}

interface Conversion {
  to: string;
  factor: number;
}

const conversions: Record<string, Conversion> = {
  km: { to: "mi", factor: 0.621371 },
  mi: { to: "km", factor: 1.60934 },
  m: { to: "ft", factor: 3.28084 },
  ft: { to: "m", factor: 0.3048 },
  cm: { to: "in", factor: 0.393701 },
  in: { to: "cm", factor: 2.54 },
  kg: { to: "lb", factor: 2.20462 },
  lb: { to: "kg", factor: 0.453592 },
  g: { to: "oz", factor: 0.035274 },
  oz: { to: "g", factor: 28.3495 },
  l: { to: "gal", factor: 0.264172 },
  gal: { to: "l", factor: 3.78541 },
  ml: { to: "oz", factor: 0.033814 },
};

interface MeasurementProps {
  value: number;
  unit: string;
  original: string;
}

const Measurement: React.FC<MeasurementProps> = ({ value, unit, original }) => {
  const [show, setShow] = useState(false);
  const info = conversions[unit.toLowerCase()];
  if (!info) return <>{original}</>;
  const converted = (value * info.factor).toFixed(2);
  const copyText = `${converted} ${info.to}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      // eslint-disable-next-line no-alert
      alert("Converted value copied");
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <span
      className="unit-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {original}
      {show && (
        <span className="unit-tooltip">
          {copyText}
          <button type="button" onClick={handleCopy} aria-label={`Copy ${copyText}`}>
            Copy
          </button>
        </span>
      )}
    </span>
  );
};

export const UnitConverter: React.FC<UnitConverterProps> = ({ text }) => {
  const regex = /(\d+(?:\.\d+)?)\s?(km|m|cm|mm|mi|ft|in|kg|g|lb|oz|l|ml)/gi;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    const value = parseFloat(match[1]);
    const unit = match[2];
    elements.push(
      <Measurement
        key={elements.length}
        value={value}
        unit={unit}
        original={match[0]}
      />
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return <>{elements}</>;
};

export default UnitConverter;
