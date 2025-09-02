import { useEffect } from "react";

function detectOS(): "mac" | "windows" | "linux" | "other" {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "other";
}

function featureSettings(os: string): string {
  switch (os) {
    case "mac":
      return '"kern" 1, "liga" 1';
    case "windows":
      return '"ss01" 1, "ss02" 1';
    case "linux":
      return '"liga" 1, "clig" 1';
    default:
      return '"kern" 1';
  }
}

export function useFontHinting() {
  useEffect(() => {
    const apply = () => {
      let features = "";
      try {
        const raw = localStorage.getItem("settings");
        const disabled = raw && JSON.parse(raw).enhancedHinting === false;
        if (!disabled) {
          features = featureSettings(detectOS());
        }
      } catch {
        /* ignore */
      }
      document.documentElement.style.fontFeatureSettings = features;
    };

    apply();
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener("storage", apply);
    };
  }, []);
}

export default useFontHinting;
