import React from "react";
import { useSearch } from "../../hooks/useSearch";

const labels = ["Exact", "Low", "Medium", "High"];

export const SearchSettingsPopover: React.FC = () => {
  const { fuzziness, setFuzziness } = useSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFuzziness(Number(e.target.value));
  };

  return (
    <div className="search-settings-popover">
      <label htmlFor="fuzziness-slider">Fuzziness</label>
      <input
        id="fuzziness-slider"
        type="range"
        min={0}
        max={3}
        step={1}
        value={fuzziness}
        onChange={handleChange}
      />
      <div className="fuzziness-labels">
        {labels.map((l, i) => (
          <span key={l} className={i === fuzziness ? "active" : undefined}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchSettingsPopover;
