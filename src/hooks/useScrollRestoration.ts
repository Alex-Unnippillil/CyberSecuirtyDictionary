import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "scroll-positions";

function readPositions(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePositions(pos: Record<string, number>) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

/**
 * Persists scroll positions per route and restores them on navigation.
 * Useful when custom transitions or manual router usage disable the
 * browser's default scroll restoration.
 */
export function useScrollRestoration() {
  const pathname = usePathname();
  const positions = useRef<Record<string, number>>(readPositions());

  useEffect(() => {
    const stored = positions.current[pathname];
    if (typeof stored === "number") {
      window.scrollTo(0, stored);
    }

    const save = () => {
      positions.current[pathname] = window.scrollY;
      writePositions(positions.current);
    };

    window.addEventListener("beforeunload", save);
    return () => {
      save();
      window.removeEventListener("beforeunload", save);
    };
  }, [pathname]);
}

export default useScrollRestoration;

