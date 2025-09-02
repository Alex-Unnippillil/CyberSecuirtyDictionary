import { useEffect } from "react";

/**
 * Enable dragging an element to the desktop to create a `.url` shortcut.
 * The hook only applies on desktop environments.
 *
 * @param ref - ref to the draggable element
 * @param term - term to link to
 */
const useDragToDesktop = (
  ref: React.RefObject<HTMLElement>,
  term: string
): void => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    if (!isDesktop) return;

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(
        term
      )}`;
      const fileName = `${term}.url`;
      const contents = `[InternetShortcut]\nURL=${url}`;
      const file = new File([contents], fileName, { type: "text/plain" });

      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/uri-list", url);
      e.dataTransfer.setData("text/plain", url);
      try {
        e.dataTransfer.setData("DownloadURL", `text/plain:${fileName}:${url}`);
        e.dataTransfer.items.add(file);
      } catch {
        // Ignore if the browser disallows adding files or DownloadURL
      }
      document.body.classList.add("dragging-to-desktop");
    };

    const handleDragEnd = () => {
      document.body.classList.remove("dragging-to-desktop");
    };

    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", handleDragStart);
    el.addEventListener("dragend", handleDragEnd);

    return () => {
      el.removeEventListener("dragstart", handleDragStart);
      el.removeEventListener("dragend", handleDragEnd);
      document.body.classList.remove("dragging-to-desktop");
    };
  }, [ref, term]);
};

export default useDragToDesktop;

