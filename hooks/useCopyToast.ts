import { useEffect } from "react";

/**
 * Hook that listens for clipboard copy events and displays a small toast
 * summarizing the copied data. The toast lists the primary format and
 * character length and provides quick links to re-copy the data in any
 * available format. The toast fades automatically after a short timeout.
 */
export default function useCopyToast(timeout: number = 3000) {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const types = Array.from(e.clipboardData?.types || []);
      if (!types.length) return;

      const dataMap = new Map<string, string>();
      types.forEach((t) => {
        const data = e.clipboardData?.getData(t) ?? "";
        dataMap.set(t, data);
      });

      const format = types[0];
      const text = dataMap.get(format) ?? "";
      const length = text.length;

      // Remove any existing copy toast
      document.querySelectorAll(".copy-toast").forEach((el) => el.remove());

      const toast = document.createElement("div");
      toast.className = "copy-toast";
      toast.style.position = "fixed";
      toast.style.bottom = "1rem";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "#333";
      toast.style.color = "#fff";
      toast.style.padding = "0.5rem 1rem";
      toast.style.borderRadius = "4px";
      toast.style.zIndex = "1000";
      toast.textContent = `Copied ${format} (${length} chars)`;

      if (types.length > 1) {
        const linksWrapper = document.createElement("span");
        linksWrapper.style.marginLeft = "0.5rem";

        types.forEach((t) => {
          const link = document.createElement("a");
          link.href = "#";
          link.textContent = t.replace("text/", "");
          link.style.marginLeft = "0.5rem";
          link.addEventListener("click", (ev) => {
            ev.preventDefault();
            const data = dataMap.get(t) ?? "";
            navigator.clipboard.writeText(data).catch(() => {});
          });
          linksWrapper.appendChild(link);
        });

        toast.appendChild(linksWrapper);
      }

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), timeout);
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [timeout]);
}
