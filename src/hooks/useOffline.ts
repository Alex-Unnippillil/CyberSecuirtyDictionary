import { useEffect, useState } from "react";

export default function useOffline(): boolean {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return offline;
}
