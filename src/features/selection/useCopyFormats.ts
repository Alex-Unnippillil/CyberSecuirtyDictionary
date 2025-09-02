export type CopyFormat = "plain" | "markdown" | "html";

export interface CopyFormats {
  "text/plain": string;
  "text/markdown": string;
  "text/html": string;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Hook returning a formatter for clipboard copy operations. Given a text
 * selection, heading and source URL, it produces Plain, Markdown and HTML
 * representations.
 */
export default function useCopyFormats() {
  return (text: string, heading: string, url: string): CopyFormats => {
    const escapedText = escapeHtml(text);
    const escapedHeading = escapeHtml(heading);
    const escapedUrl = escapeHtml(url);

    return {
      "text/plain": `${text}\n\n${heading} - ${url}`,
      "text/markdown": `${text}\n\n[${heading}](${url})`,
      "text/html": `<blockquote>${escapedText}</blockquote><p><a href="${escapedUrl}">${escapedHeading}</a></p>`,
    };
  };
}
