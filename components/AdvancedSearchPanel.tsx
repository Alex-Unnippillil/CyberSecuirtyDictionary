import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

interface AdvancedSearchPanelProps {
  /** API endpoint to call when applying filters */
  endpoint: string;
  /** Called when the panel should be closed */
  onClose: () => void;
  /** Optional callback to receive API results */
  onResults?: (data: unknown) => void;
}

const partOfSpeechOptions = ["noun", "verb", "adjective", "adverb"];
const registerOptions = ["formal", "informal"];
const regionOptions = ["us", "uk", "global"];
const frequencyOptions = ["common", "rare"];

/** Advanced search filter panel */
export default function AdvancedSearchPanel({
  endpoint,
  onClose,
  onResults,
}: AdvancedSearchPanelProps) {
  const [selectedPOS, setSelectedPOS] = useState<string[]>([]);
  const [register, setRegister] = useState("");
  const [region, setRegion] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState("");

  function togglePOS(value: string) {
    setSelectedPOS((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function reset() {
    setSelectedPOS([]);
    setRegister("");
    setRegion("");
    setFrequency("");
    setDate("");
    onClose();
  }

  const { trigger } = useSWRMutation(endpoint, async (url, { arg }: { arg: URLSearchParams }) => {
    const resp = await fetch(`${url}?${arg.toString()}`);
    if (!resp.ok) throw new Error("Advanced search request failed");
    return resp.json();
  });

  async function apply() {
    const params = new URLSearchParams();
    if (selectedPOS.length) params.set("pos", selectedPOS.join(","));
    if (register) params.set("register", register);
    if (region) params.set("region", region);
    if (frequency) params.set("frequency", frequency);
    if (date) params.set("date", date);

    try {
      const data = await trigger(params);
      onResults?.(data);
    } catch (err) {
      console.error("Advanced search request failed", err);
    } finally {
      onClose();
    }
  }

  return (
    <div className="advanced-search-panel">
      <h2>Advanced Search</h2>

      <fieldset>
        <legend>Part of Speech</legend>
        {partOfSpeechOptions.map((pos) => (
          <label key={pos}>
            <input
              type="checkbox"
              checked={selectedPOS.includes(pos)}
              onChange={() => togglePOS(pos)}
            />
            {pos}
          </label>
        ))}
      </fieldset>

      <label>
        Register
        <select value={register} onChange={(e) => setRegister(e.target.value)}>
          <option value="">Any</option>
          {registerOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label>
        Region
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Any</option>
          {regionOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label>
        Frequency
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="">Any</option>
          {frequencyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <div className="controls">
        <button type="button" onClick={apply}>
          Apply
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
