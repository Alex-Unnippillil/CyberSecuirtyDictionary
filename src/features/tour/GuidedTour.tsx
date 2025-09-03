import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

// Define the steps for the tour
const steps: Step[] = [
  {
    target: "#search",
    content: "Search for terms here.",
  },
  {
    target: "#random-term",
    content: "Explore a random term with this button.",
  },
];

let triggerStart: (() => void) | null = null;

export function startGuidedTour() {
  triggerStart && triggerStart();
}

const GuidedTour: React.FC = () => {
  const [run, setRun] = useState(false);

  // Auto-launch on first visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem("guided-tour-seen");
      if (!seen) {
        setRun(true);
        localStorage.setItem("guided-tour-seen", "true");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    triggerStart = () => setRun(true);
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      callback={handleCallback}
      styles={{ options: { zIndex: 10000 } }}
    />
  );
};

export default GuidedTour;

export function mountGuidedTour(): void {
  const container = document.createElement("div");
  document.body.appendChild(container);
  (ReactDOM as any).render(<GuidedTour />, container);
}

if (typeof document !== "undefined") {
  mountGuidedTour();
}

