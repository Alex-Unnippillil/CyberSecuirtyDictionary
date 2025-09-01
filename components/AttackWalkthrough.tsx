import React, { useEffect, useState, KeyboardEvent } from "react";

/**
 * Map of common cyber threats to ordered step descriptions.
 * Each sequence contains three to five steps explaining how the attack unfolds.
 */
const THREAT_SEQUENCES: Record<string, string[]> = {
  phishing: [
    "A deceptive email or message is sent to the victim.",
    "Victim clicks a malicious link or attachment.",
    "Credentials are captured or malware is installed.",
    "Attacker uses the stolen information to access systems.",
  ],
  ransomware: [
    "User downloads or runs a malicious payload.",
    "Malware silently encrypts important files.",
    "A ransom note demands payment for decryption keys.",
    "Data remains locked until the attacker is paid.",
  ],
  ddos: [
    "Attackers build or rent a large botnet.",
    "Botnet launches a massive traffic flood at the target.",
    "Server resources become exhausted and slow.",
    "Legitimate users can no longer access the service.",
  ],
  passwordattack: [
    "Attacker gathers usernames or email addresses.",
    "Automated scripts try many password combinations.",
    "Successful logins are leveraged for further intrusion.",
  ],
};

export interface AttackWalkthroughProps {
  /**
   * Type of threat to visualize. Must be a key of THREAT_SEQUENCES.
   */
  threat: keyof typeof THREAT_SEQUENCES;
  /**
   * Milliseconds to show each step while playing.
   * @default 4000
   */
  interval?: number;
}

/**
 * Accessible walkthrough component that animates through the steps
 * of a selected cyber attack. Includes play/pause controls, captions,
 * and keyboard navigation using arrow keys to move between steps.
 */
export const AttackWalkthrough: React.FC<AttackWalkthroughProps> = ({
  threat,
  interval = 4000,
}) => {
  const steps = THREAT_SEQUENCES[threat] || [];
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Auto-advance steps when playing
  useEffect(() => {
    if (!playing || steps.length === 0) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, interval);
    return () => clearInterval(id);
  }, [playing, interval, steps.length]);

  // Keyboard navigation handler
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setPlaying(false);
      setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setPlaying(false);
      setCurrent((prev) => Math.max(prev - 1, 0));
    }
  }

  return (
    <div className="attack-walkthrough">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause animation" : "Play animation"}
      >
        {playing ? "Pause" : "Play"}
      </button>

      <div
        role="group"
        tabIndex={0}
        aria-label={`${threat} attack walkthrough`}
        onKeyDown={handleKeyDown}
        className="attack-steps"
      >
        {steps.map((caption, index) => (
          <figure key={index} hidden={index !== current}>
            {/* Visual placeholder for the step; real implementation could use graphics */}
            <div aria-hidden="true" className="attack-step-visual">
              Step {index + 1}
            </div>
            <figcaption aria-live="polite">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default AttackWalkthrough;
