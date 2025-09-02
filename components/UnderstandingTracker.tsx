"use client";

import { useEffect, useState } from "react";
import {
  loadStatuses,
  saveStatus,
  removeStatus,
} from "../lib/understanding";

interface Props {
  term: string;
}

export default function UnderstandingTracker({ term }: Props) {
  const [understood, setUnderstood] = useState(false);
  const [confidence, setConfidence] = useState(50);

  useEffect(() => {
    const data = loadStatuses();
    if (data[term]) {
      setUnderstood(true);
      setConfidence(data[term].confidence);
    }
  }, [term]);

  const toggle = () => {
    if (understood) {
      removeStatus(term);
      setUnderstood(false);
    } else {
      saveStatus(term, confidence);
      setUnderstood(true);
    }
  };

  const updateConfidence = (value: number) => {
    setConfidence(value);
    saveStatus(term, value);
  };

  return (
    <div className="understanding-tracker">
      <button type="button" onClick={toggle}>
        {understood ? "Mark as Not Yet" : "Mark as Understood"}
      </button>
      {understood && (
        <label>
          Confidence: {confidence}
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => updateConfidence(Number(e.target.value))}
          />
        </label>
      )}
    </div>
  );
}
