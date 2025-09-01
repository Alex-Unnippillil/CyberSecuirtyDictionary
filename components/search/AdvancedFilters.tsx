import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AdvancedFiltersProps {
  posOptions?: string[];
  regionOptions?: string[];
}

/**
 * AdvancedFilters provides controls for narrowing down search results.
 * Selections are synced to the URL query string, e.g. `/search?pos=noun&region=US`.
 */
export default function AdvancedFilters({
  posOptions = [],
  regionOptions = [],
}: AdvancedFiltersProps) {
  const router = useRouter();
  const { query, pathname } = router;

  const [pos, setPos] = useState<string>((query.pos as string) || "");
  const [region, setRegion] = useState<string>((query.region as string) || "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (pos) params.set("pos", pos);
    if (region) params.set("region", region);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, undefined, {
      shallow: true,
    });
  }, [pos, region, pathname, router]);

  return (
    <div>
      <label>
        Part of Speech
        <select value={pos} onChange={(e) => setPos(e.target.value)}>
          <option value="">Any</option>
          {posOptions.map((p) => (
            <option key={p} value={p}>
              {p}
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
    </div>
  );
}
