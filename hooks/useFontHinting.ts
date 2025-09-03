import { useEffect } from "react";
import { safeParse } from "../src/utils/safeJson";

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
      const raw = localStorage.getItem("settings");
      const settings = safeParse<any>(raw, {});
      if (settings.enhancedHinting !== false) {
        features = featureSettings(detectOS());
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
